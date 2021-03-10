#include <stdio.h>
#include "server.h"

int main(int argc, char *argv[])
{
    cmpe202::SystemServer server;
    if(server.initialize() != cmpe202::Error::OK)
        return -1;

    server.updateLoop();
    server.finalize();

    return 0;
}