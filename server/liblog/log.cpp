#include "log.h"
#include <memory>
#include <sys/stat.h>
#include <pwd.h>
#include <unistd.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <fstream>
#include <json11.hpp>
#include <string.h>

namespace
{
    std::unique_ptr<cmpe202::Log> s_logger;

    std::string getHomeDir();
}

int cmpe202::Log::init(const char *name)
{
    s_logger.reset(new Log());
    s_logger->m_name = name;
    int err = s_logger->loadConfig();
    if(err < 0)
        return err;
    err = s_logger->connect();
    if(err < 0)
    {
        printf("Err: %s\n", strerror(errno));
        return err;
    }

    s_logger->m_buffer = name;
    s_logger->m_buffer += "?START_OF_STREAM";
    if(send(s_logger->m_sockfd, s_logger->m_buffer.c_str(), s_logger->m_buffer.length(), 0) < 0)
    {
        printf("send failed\n");
        printf("Err: %s\n", strerror(errno));
        return -1;
    }

    return 0;
}

void cmpe202::Log::close()
{
    if(m_sockfd > 0)
    {
        m_buffer = m_name + "?END_OF_STREAM";
        if(send(m_sockfd, m_buffer.c_str(), m_buffer.length(), 0) < 0)
        {
            printf("send failed\n");
            printf("Err: %s\n", strerror(errno));
            return;
        }
        // Close connection
        ::close(m_sockfd);
        m_sockfd = 0;
    }
}

cmpe202::Log::Log()
    : m_sockfd(0)
    , m_port(0)
{
    m_homedir = ::getHomeDir();
}

cmpe202::Log::~Log()
{
    close();
}

int cmpe202::Log::connect()
{
    m_sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if(m_sockfd < 0)
    {
        printf("Socket creation failed\n");
        return -1;
    }
    int val = 1;
    setsockopt(m_sockfd, SOL_SOCKET, SO_REUSEADDR, &val, sizeof(val));
    setsockopt(m_sockfd, SOL_SOCKET, SO_REUSEPORT, &val, sizeof(val));

    sockaddr_in info = {};
    info.sin_port = htons(m_port);
    info.sin_family = AF_INET;
	if(inet_pton(info.sin_family, "127.0.0.1", &info.sin_addr) <= 0)
	{
        printf("inet_pton failed\n");
		return -1;
	}

	int ret = ::connect(m_sockfd, (struct sockaddr *)&info, sizeof(info));
	if(ret < 0)
	{
        printf("connect failed\n");
		return -1;
	}

    return 0;
}

int cmpe202::Log::loadConfig()
{
    std::string configPath = m_homedir + "/.bankserver/log.json";
    // Load config
    std::ifstream conf(configPath);
    std::string configStr;
    if(conf)
    {
        printf("Config loaded successfully\n");
        // Load config to string
        conf.seekg(0, std::ios::end);   
        configStr.reserve(conf.tellg());
        conf.seekg(0, std::ios::beg);
        configStr.assign((std::istreambuf_iterator<char>(conf)), std::istreambuf_iterator<char>());
        conf.close();
    }
    else
    {
        printf("Failed to load logger config\n");
        return -1;
    }

    std::string err;
    const auto parsed = json11::Json::parse(configStr, err);
    if(err.empty())
    {
        // No errors
        m_port = static_cast<uint16_t>(parsed["port"].int_value());
    }
    else
    {
        return -1;
    }

    return 0;
}

namespace
{
    std::string getHomeDir()
    {
        int myuid;
        passwd *mypasswd;
        myuid = getuid();
        mypasswd = getpwuid(myuid);
        return mypasswd->pw_dir;
    }
}