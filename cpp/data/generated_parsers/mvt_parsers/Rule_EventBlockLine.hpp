/* -----------------------------------------------------------------------------
 * Rule_EventBlockLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_EventBlockLine_hpp
#define Rule_EventBlockLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_EventBlockLine : public Rule
{
public:
  Rule_EventBlockLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_EventBlockLine(const Rule_EventBlockLine& rule);

  Rule_EventBlockLine& operator=(const Rule_EventBlockLine& rule);

  const Rule_EventBlockLine* clone(void) const;

  static const Rule_EventBlockLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
