/* -----------------------------------------------------------------------------
 * Parser.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 22:01:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Parser_hpp
#define Parser_hpp

#include <string>
#include <iostream>

class Rule;

class Parser
{
public:
  static const Rule* parse(const std::string& rulename, const std::string& text);
  static const Rule* parse(const std::string& rulename, std::istream& in);

  static const Rule* parse(const std::string& rulename, const std::string& text, bool trace);
  static const Rule* parse(const std::string& rulename, std::istream& in, bool trace);
};

#endif

/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
