#ifndef PARSER_ERROR_LOGGER_HPP
#define PARSER_ERROR_LOGGER_HPP

#include <ctime>
#include <cstdlib>
#include <fstream>
#include <string>

namespace parser_logging
{
inline std::string currentTimestampUtc()
{
  std::time_t now = std::time(NULL);
  std::tm tm_utc;
#if defined(_WIN32)
  gmtime_s(&tm_utc, &now);
#else
  gmtime_r(&now, &tm_utc);
#endif
  char buffer[32];
  std::strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &tm_utc);
  return std::string(buffer);
}

inline std::string logPath()
{
  const char* customPath = std::getenv("NCA_PARSER_LOG_FILE");
  if (customPath != NULL && customPath[0] != '\0')
    return std::string(customPath);

  return "/tmp/nca_parser_errors.log";
}

inline void logError(const std::string& parserName, const std::string& message)
{
  const std::string formatted =
      "[" + currentTimestampUtc() + "] [" + parserName + "] " + message;

  std::ofstream out(logPath().c_str(), std::ios::out | std::ios::app);
  if (out.is_open())
    out << formatted << std::endl;
}
} // namespace parser_logging

#endif
