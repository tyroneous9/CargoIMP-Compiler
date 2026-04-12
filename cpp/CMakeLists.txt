cmake_minimum_required(VERSION 3.20)
project(NCAParser LANGUAGES CXX)
add_executable(NCAParser 
  src/parser_generator.cpp
)
target_compile_features(NCAParser PRIVATE cxx_std_17)
target_include_directories(NCAParser PRIVATE include)

