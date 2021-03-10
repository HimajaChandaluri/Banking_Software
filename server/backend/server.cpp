#include "server.h"
#include <stdio.h>

cmpe202::SystemServer::SystemServer()
    : m_isInitialized(false)
{
    printf("Server constructed.\n");
}

cmpe202::SystemServer::~SystemServer()
{
    printf("Server destructed.\n");
    if(m_isInitialized)
        finalize();
}

cmpe202::Error cmpe202::SystemServer::initialize()
{
    printf("Server initialized.\n");
    return Error::OK;
}

cmpe202::Error cmpe202::SystemServer::updateLoop()
{
    printf("Server update loop...\n");
    return Error::OK;
}

cmpe202::Error cmpe202::SystemServer::finalize()
{
    printf("Server finalized.\n");
    m_isInitialized = false;
    return Error::OK;
}