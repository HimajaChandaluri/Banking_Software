# List of src files for the build
set(LIBLOG_SRC
"log.cpp"
)

set(LIBLOG liblog)

add_library(${LIBLOG} ${LIBLOG_SRC})

# Include additional directories, when required
target_include_directories(${LIBLOG} PUBLIC ${OSSDIR}/json11/)

# Link libraries when required
target_link_libraries(${LIBLOG} json11)

# Add dependency if dependencies also need to be built
add_dependencies(${LIBLOG} json11)

# Add post build events, if required
# add_custom_command(TARGET ${SERVER} POST_BUILD
# COMMAND cp ${PROJECT_SOURCE_DIR}/LICENSE ${CMAKE_BINARY_DIR}/src/${SERVER}/LICENSE
# )