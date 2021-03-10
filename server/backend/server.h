#pragma once
#include "error.h"

namespace cmpe202
{
    class SystemServer
    {
    public:
        SystemServer();
        ~SystemServer();

        Error initialize();
        Error updateLoop();
        Error finalize();

    private:
        bool m_isInitialized;
    };
}