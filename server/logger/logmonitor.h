#pragma once
#include <cstdint>
#include <string>
#include <json11.hpp>

namespace cmpe202
{
    class LogMonitor
    {
    public:
        LogMonitor();
        ~LogMonitor();

        void mainLoop();

    private:
        int m_sockfd;
        bool m_run;
        std::string m_homedir;

        // Logger settings
        uint16_t m_port;
        std::string m_logDir;
        int64_t m_flushFrequency_s;
        std::string m_timeFormat;
        std::string m_inBuffer;

        void initSettings(const json11::Json &settings);
        int startServer();
    };
}
