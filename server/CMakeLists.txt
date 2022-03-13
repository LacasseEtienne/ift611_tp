cmake_minimum_required(VERSION 3.21)
project(server)

set(CMAKE_CXX_STANDARD 23)

# see https://cmake.org/cmake/help/latest/module/FindBoost.html
find_package(Boost REQUIRED)

add_executable(server
        ${BOOST_BEAST_FILES}
        main.cpp)

include_directories(${Boost_INCLUDE_DIR})

if(MINGW)
    target_link_libraries(server ws2_32)
    target_link_libraries(server wsock32)
endif()
