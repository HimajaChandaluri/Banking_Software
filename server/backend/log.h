#pragma once
#include <ostream>

namespace cmpe202
{
    class Log
    {
    public:
        enum class Level
        {
            kLevelInfo = 0,
            kLevelWarning,
            kLevelError,
        };

    public:
        ~Log();

        static Log& get();

        void write(Level level, const char *msg);
        void write(Level level, int line, const char *file, const char *msg);
        void write(Level level, const char *msg, ...);

    private:
        // Singleton class
        Log();
    };
}