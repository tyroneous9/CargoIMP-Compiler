/* -----------------------------------------------------------------------------
 * Rule_EventLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_EventLine_hpp
#define Rule_EventLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_EventLine : public Rule
{
public:
  Rule_EventLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_EventLine(const Rule_EventLine& rule);

  Rule_EventLine& operator=(const Rule_EventLine& rule);

  const Rule_EventLine* clone(void) const;

  static const Rule_EventLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
