#include "log.h"
#include <memory>

namespace
{
    static std::unique_ptr<cmpe202::Log> s_logger;
}

cmpe202::Log::Log()
{
    printf("Logger constructor\n");
    // TODO: Connect to log monitor
}

cmpe202::Log::~Log()
{
    printf("Logger destructor\n");
    // Disconnect from log monitor
}

cmpe202::Log &cmpe202::Log::get()
{
    if(!::s_logger)
    {
        ::s_logger.reset(new Log());
    }
    return *::s_logger;
}