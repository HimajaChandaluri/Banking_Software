#pragma once
#include <string>
#include <mutex>

namespace cmpe202
{
    class Log
    {
    public:
        enum class Level
        {
            Info = 0,
            Warning,
            Error,
        };

    public:
        static int init(const char *name);
        static Log *get();

        void print(Level level, const char *fmt, ...);

        template<typename ...Args>
        void infoMsg(const char *fmt, Args... args)
        {
            print(Level::Info, fmt, args...);
        }

        template<typename ...Args>
        void warningMsg(const char *fmt, Args... args)
        {
            print(Level::Warning, fmt, args...);
        }

        template<typename ...Args>
        void errorMsg(int line, const char *file, const char *fmt, Args... args)
        {
            std::string tmpFmt = "%s line %d:";
            tmpFmt += fmt;
            print(Level::Error, tmpFmt.c_str(), args...);
        }

        void close();
        ~Log();

    private:
        Log();
        std::string m_name;
        int m_sockfd;
        std::string m_homedir;
        uint16_t m_port;
        std::string m_buffer;
        std::mutex m_mutex;

        int connect();
        int loadConfig();
    };
}