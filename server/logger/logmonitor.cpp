#include "logmonitor.h"
#include <string>
#include <pwd.h>
#include <unistd.h>
#include <fstream>
#include <sys/stat.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <time.h>

namespace
{
    std::string getHomeDir();
    int createDirectories(const std::string &dir);
}

cmpe202::LogMonitor::LogMonitor()
    : m_sockfd(0)
    , m_port(8081)
    , m_run(false)
{
    // Load config, if available
    m_homedir = ::getHomeDir();
    std::string configPath = m_homedir + "/.bankserver/log.json";
    // Load config
    std::ifstream conf(configPath);
    std::string configStr;
    bool dumpConfig = false;
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
        printf("Generating default settings\n");
        // Load default config
        configStr = R"({"port":8081, "outdir":"~/.bankserver/logs/", "flush":10, "timeformat":"%a %b %d %H:%M:%S %Y", "maxfilesize":10000})";
        dumpConfig = true;
    }
    std::string err;
    const auto parsed = json11::Json::parse(configStr, err);

    if(err.empty())
    {
        printf("No errors\n");
        // No errors
        if(dumpConfig)
        {
            std::string configDir = configPath.substr(0, configPath.find_last_of('/'));
            int err = ::createDirectories(configDir);
            if(err != 0)
            {
                printf("mkdir failed with err %s\n", strerror(errno));
                return;
            }
            configStr.clear();
            parsed.dump(configStr);
            printf("Exporting settings %s\n", configStr.c_str());
            std::ofstream outConf(configPath);
            if(outConf)
            {
                outConf << configStr;
            }
            else
            {
                printf("Failed to export default settings\n");
            }
        }
        initSettings(parsed);
    }
    else
    {
        printf("Parsing errors: %s\n", err.c_str());
    }
}

cmpe202::LogMonitor::~LogMonitor()
{
    // Close socket
    if(m_sockfd)
        close(m_sockfd);
    m_sockfd = 0;
}

void cmpe202::LogMonitor::mainLoop()
{
    int err = startServer();
    if(err < 0)
    {
        printf("Failed to start log server.\n");
        printf("Error: %s\n", strerror(errno));
        return;
    }
    m_run = true;
    while(m_run)
    {
        ssize_t bytesReceived = -1;
        char tmp;
        sockaddr_in client = {};
        socklen_t clientSz = sizeof(client);
        /* Try to receive the buffer */
        while(bytesReceived < 0)
        {
            /* Check for incoming messages without removing them from the queue.
             * Using MSG_TRUNC to retrieve the actual size of the buffer, even though
             * we're not providing sufficient buffer space.
             */
            bytesReceived = recvfrom(m_sockfd, &tmp, sizeof(tmp), MSG_PEEK | MSG_TRUNC, (struct sockaddr*)&client, &clientSz);
            if(bytesReceived < 0)
            {
                /* Sleep for 1ms before retrying */
                printf("Message didn't arrive\n");
                usleep(1000);
            }
            else
                break;
        }
        m_inBuffer.clear();
        m_inBuffer.resize(bytesReceived);
        bytesReceived = recvfrom(m_sockfd, &m_inBuffer[0], bytesReceived, 0, (struct sockaddr*)&client, &clientSz);
        if(bytesReceived < 0)
        {
            printf("recvfrom failed.\n");
            printf("Err: %s\n", strerror(errno));
            return;
        }

        time_t rawtime;
        struct tm * timeinfo;
        char buffer [80];

        time (&rawtime);
        timeinfo = localtime (&rawtime);

        strftime(buffer,sizeof(buffer), m_timeFormat.c_str(),timeinfo);

        printf("From client: %u:", client.sin_addr.s_addr);
        printf("%s %s\n", buffer, m_inBuffer.c_str());
    }
    printf("Exit server\n");
}

void cmpe202::LogMonitor::initSettings(const json11::Json &settings)
{
    m_port = static_cast<uint16_t>(settings["port"].int_value());
    m_logDir = settings["outdir"].string_value();
    size_t tildeLoc = m_logDir.find_first_of('~');
    if(tildeLoc != std::string::npos)
    {
        m_logDir.replace(tildeLoc, 1, m_homedir);
    }
    m_flushFrequency_s = settings["flush"].int_value();
    m_timeFormat = settings["timeformat"].string_value();
    m_maxFileSize = static_cast<uint32_t>(settings["maxfilesize"].int_value());

    printf("port: %u\n", m_port);
    printf("log dir: %s\n", m_logDir.c_str());
    printf("flush frequency: %lds\n", m_flushFrequency_s);
    printf("format time as: %s\n", m_timeFormat.c_str());
    printf("max file size: %ubytes\n", m_maxFileSize);
}

int cmpe202::LogMonitor::startServer()
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
    info.sin_addr.s_addr = INADDR_ANY;
    info.sin_port = htons(m_port);
    info.sin_family = AF_INET;
    int ret = bind(m_sockfd, (const sockaddr*)&info, sizeof(info));
    if(ret < 0)
    {
        printf("bind failed\n");
        return -1;
    }

#if 0
    // listen not required for UDP
    ret = listen(m_sockfd, 6);
    if(ret < 0)
    {
        printf("listen failed\n");
        printf("Err: %s\n", strerror(errno));
        return -1;
    }
#endif

    printf("listening on port %u...\n", m_port);

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

    int createDirectories(const std::string &dir)
    {
        printf("Full path to build %s\n", dir.c_str());
        size_t s = 0;
        std::string subpath;
        while(s != std::string::npos)
        {
            size_t e = dir.find_first_of('/', s);
            subpath = dir.substr(0, e);
            if(!subpath.empty())
            {
                printf("Trying to create directory %s\n", subpath.c_str());
                int err = mkdir(subpath.c_str(), S_IRWXU | S_IRWXG | S_IROTH | S_IXOTH);
                if(err != 0 && errno != EEXIST)
                    return err;
            }
            if(e == std::string::npos)
                break;
            s = e + 1;
        }
        return 0;
    }
}