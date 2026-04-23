/* -----------------------------------------------------------------------------
 * Terminal_NumericValue.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <string>
using std::string;

#include <vector>
using std::vector;

#include <regex>
using std::regex;

#include "Terminal_NumericValue.hpp"
#include "Visitor.hpp"
#include "ParserContext.hpp"

Terminal_NumericValue::Terminal_NumericValue(
  const string& spelling, 
  const vector<const Rule*>& rules) : Rule(spelling, rules)
{
}

const Terminal_NumericValue* Terminal_NumericValue::clone(void) const
{
  return new Terminal_NumericValue(this->spelling, this->rules);
}

void* Terminal_NumericValue::accept(Visitor& visitor) const
{
  return visitor.visit(this);
}

const Terminal_NumericValue* Terminal_NumericValue::parse(
  ParserContext& context,
  const string& spelling,
  const string& pattern,
  int length)
{
  context.push("NumericValue", spelling + "," + pattern);

  bool parsed = false;

  Terminal_NumericValue* numericValue = NULL;

  try
  {
    if (context.index + length <= context.text.length())
    {
      string value = context.text.substr(context.index, length);

      regex rx(pattern);
      parsed = regex_match(value, rx);

      if (parsed)
      {
        context.index += length;
        numericValue = new Terminal_NumericValue(value, vector<const Rule*>());
      }
    }
  }
  catch (...) {}

  context.pop("NumericValue", parsed);

  return numericValue;
}

/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
