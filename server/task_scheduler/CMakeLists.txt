# List of src files for the build
set(SCHEDULER_SRC
"main.cpp"
)

set(SCHEDULER task-scheduler)

add_executable(${SCHEDULER} ${SCHEDULER_SRC})

# Include additional directories, when required
# target_include_directories(${SERVER} PUBLIC ${PROJECT_SOURCE_DIR}/dependencies/)

# Link libraries when required
# target_link_libraries(${SERVER} pthread)

# Add dependency if dependencies also need to be built
#add_dependencies(${SERVER} ${SOME_DEPENDENCY})

# Add post build events, if required
# add_custom_command(TARGET ${SERVER} POST_BUILD
# COMMAND cp ${PROJECT_SOURCE_DIR}/LICENSE ${CMAKE_BINARY_DIR}/src/${SERVER}/LICENSE
# )