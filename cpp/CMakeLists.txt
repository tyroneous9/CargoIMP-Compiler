# Usage: 
# Configure: cmake -S src_dir -B build_dir
# Build: cmake --build build_dir

cmake_minimum_required(VERSION 3.20)
project(CargoIMP-Compiler LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)

# Discover all parser grammar subdirectories (e.g., fwb_parsers, fhl_parsers, ffm_parsers)
file(GLOB PARSER_SUBDIRS "data/generated_parsers/*")
list(FILTER PARSER_SUBDIRS INCLUDE REGEX "_parsers$")

if(NOT PARSER_SUBDIRS)
  message(FATAL_ERROR "No parser subdirectories found in data/generated_parsers/")
endif()

# Build one isolated executable per grammar directory.
# This avoids cross-grammar symbol collisions from generated code.
set(PARSER_TARGETS "")

foreach(PARSER_DIR ${PARSER_SUBDIRS})
  get_filename_component(PARSER_NAME ${PARSER_DIR} NAME)
  set(PARSER_TARGET "parser_${PARSER_NAME}")
  
  # Build from generated sources including ParserMain.cpp (CLI entrypoint).
  file(GLOB PARSER_SOURCES "${PARSER_DIR}/*.cpp")
  add_executable(${PARSER_TARGET} ${PARSER_SOURCES})
  target_compile_features(${PARSER_TARGET} PRIVATE cxx_std_17)
  target_include_directories(${PARSER_TARGET} PRIVATE ${PARSER_DIR})

  list(APPEND PARSER_TARGETS ${PARSER_TARGET})
endforeach()

# Stable custom app target for FWB JSON extraction.
# Custom code lives in src/, generated code stays under data/generated_parsers/.
set(FWB_DIR "${CMAKE_CURRENT_SOURCE_DIR}/data/generated_parsers/fwb_parsers")
if(EXISTS "${FWB_DIR}")
  file(GLOB FWB_GENERATED_SOURCES "${FWB_DIR}/*.cpp")
  list(FILTER FWB_GENERATED_SOURCES EXCLUDE REGEX "ParserMain\\.cpp$")
  list(FILTER FWB_GENERATED_SOURCES EXCLUDE REGEX "JsonExtractor\\.cpp$")

  add_executable(parser_fwb_json
    src/fwb_json_main.cpp
    src/fwb_json_extractor.cpp
    ${FWB_GENERATED_SOURCES}
  )
  target_compile_features(parser_fwb_json PRIVATE cxx_std_17)
  target_include_directories(parser_fwb_json PRIVATE
    ${FWB_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/src
  )

  list(APPEND PARSER_TARGETS parser_fwb_json)
endif()

# Stable custom app target for FHL JSON extraction.
# Custom code lives in src/, generated code stays under data/generated_parsers/.
set(FHL_DIR "${CMAKE_CURRENT_SOURCE_DIR}/data/generated_parsers/fhl_parsers")
if(EXISTS "${FHL_DIR}")
  file(GLOB FHL_GENERATED_SOURCES "${FHL_DIR}/*.cpp")
  list(FILTER FHL_GENERATED_SOURCES EXCLUDE REGEX "ParserMain\\.cpp$")
  list(FILTER FHL_GENERATED_SOURCES EXCLUDE REGEX "JsonExtractor\\.cpp$")

  add_executable(parser_fhl_json
    src/fhl_json_main.cpp
    src/fhl_json_extractor.cpp
    ${FHL_GENERATED_SOURCES}
  )
  target_compile_features(parser_fhl_json PRIVATE cxx_std_17)
  target_include_directories(parser_fhl_json PRIVATE
    ${FHL_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/src
  )

  list(APPEND PARSER_TARGETS parser_fhl_json)
endif()

# Stable custom app target for FFM JSON extraction.
# Custom code lives in src/, generated code stays under data/generated_parsers/.
set(FFM_DIR "${CMAKE_CURRENT_SOURCE_DIR}/data/generated_parsers/ffm_parsers")
if(EXISTS "${FFM_DIR}")
  file(GLOB FFM_GENERATED_SOURCES "${FFM_DIR}/*.cpp")
  list(FILTER FFM_GENERATED_SOURCES EXCLUDE REGEX "ParserMain\\.cpp$")
  list(FILTER FFM_GENERATED_SOURCES EXCLUDE REGEX "JsonExtractor\\.cpp$")

  add_executable(parser_ffm_json
    src/ffm_json_main.cpp
    src/ffm_json_extractor.cpp
    ${FFM_GENERATED_SOURCES}
  )
  target_compile_features(parser_ffm_json PRIVATE cxx_std_17)
  target_include_directories(parser_ffm_json PRIVATE
    ${FFM_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/src
  )

  list(APPEND PARSER_TARGETS parser_ffm_json)
endif()

# Stable custom app target for MVT JSON extraction.
# Custom code lives in src/, generated code stays under data/generated_parsers/.
set(MVT_DIR "${CMAKE_CURRENT_SOURCE_DIR}/data/generated_parsers/mvt_parsers")
if(EXISTS "${MVT_DIR}")
  file(GLOB MVT_GENERATED_SOURCES "${MVT_DIR}/*.cpp")
  list(FILTER MVT_GENERATED_SOURCES EXCLUDE REGEX "ParserMain\\.cpp$")
  list(FILTER MVT_GENERATED_SOURCES EXCLUDE REGEX "JsonExtractor\\.cpp$")

  add_executable(parser_mvt_json
    src/mvt_json_main.cpp
    src/mvt_json_extractor.cpp
    ${MVT_GENERATED_SOURCES}
  )
  target_compile_features(parser_mvt_json PRIVATE cxx_std_17)
  target_include_directories(parser_mvt_json PRIVATE
    ${MVT_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/src
  )

  list(APPEND PARSER_TARGETS parser_mvt_json)
endif()

# Print configuration info
message(STATUS "Found parser directories: ${PARSER_SUBDIRS}")
message(STATUS "Parser executables created: ${PARSER_TARGETS}")

