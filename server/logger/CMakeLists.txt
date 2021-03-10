# List of src files for the build
set(LOGGER_SRC
"main.cpp"
"logmonitor.cpp"
)

set(LOGGER logger)

add_executable(${LOGGER} ${LOGGER_SRC})

# Include additional directories, when required
target_include_directories(${LOGGER} PUBLIC ${OSSDIR}/json11/)

# Link libraries when required
target_link_libraries(${LOGGER} json11)

# Add dependency if dependencies also need to be built
add_dependencies(${LOGGER} json11)

# Add post build events, if required
# add_custom_command(TARGET ${SERVER} POST_BUILD
# COMMAND cp ${PROJECT_SOURCE_DIR}/LICENSE ${CMAKE_BINARY_DIR}/src/${SERVER}/LICENSE
# )