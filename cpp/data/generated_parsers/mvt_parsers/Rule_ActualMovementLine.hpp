/* -----------------------------------------------------------------------------
 * Rule_ActualMovementLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ActualMovementLine_hpp
#define Rule_ActualMovementLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ActualMovementLine : public Rule
{
public:
  Rule_ActualMovementLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ActualMovementLine(const Rule_ActualMovementLine& rule);

  Rule_ActualMovementLine& operator=(const Rule_ActualMovementLine& rule);

  const Rule_ActualMovementLine* clone(void) const;

  static const Rule_ActualMovementLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
