#include <stdio.h>
#include "logmonitor.h"

int main(int argc, char *argv[])
{
    printf("Hello, World!\n");
    cmpe202::LogMonitor monitor;
    monitor.mainLoop();
    return 0;
}