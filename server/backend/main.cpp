#include <stdio.h>
#include "server.h"
#include <log.h>

int main(int argc, char *argv[])
{
    int err = cmpe202::Log::init("server");
    if(err < 0)
    {
        printf("Failed to initialize logger\n");
        return -1;
    }

    cmpe202::SystemServer server;
    if(server.initialize() != cmpe202::Error::OK)
        return -1;

    server.updateLoop();
    server.finalize();

    return 0;
}