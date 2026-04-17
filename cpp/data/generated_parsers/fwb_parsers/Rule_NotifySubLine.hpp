/* -----------------------------------------------------------------------------
 * Rule_NotifySubLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:21:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_NotifySubLine_hpp
#define Rule_NotifySubLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_NotifySubLine : public Rule
{
public:
  Rule_NotifySubLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_NotifySubLine(const Rule_NotifySubLine& rule);

  Rule_NotifySubLine& operator=(const Rule_NotifySubLine& rule);

  const Rule_NotifySubLine* clone(void) const;

  static const Rule_NotifySubLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
