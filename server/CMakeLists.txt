cmake_minimum_required(VERSION 3.21)
project(server)

set(CMAKE_CXX_STANDARD 23)

add_executable(server main.cpp)

# see https://cmake.org/cmake/help/latest/module/FindBoost.html
find_package(Boost REQUIRED)

include_directories(${Boost_INCLUDE_DIR})