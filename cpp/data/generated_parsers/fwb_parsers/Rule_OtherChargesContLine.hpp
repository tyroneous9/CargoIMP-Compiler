/* -----------------------------------------------------------------------------
 * Rule_OtherChargesContLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:21:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_OtherChargesContLine_hpp
#define Rule_OtherChargesContLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_OtherChargesContLine : public Rule
{
public:
  Rule_OtherChargesContLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_OtherChargesContLine(const Rule_OtherChargesContLine& rule);

  Rule_OtherChargesContLine& operator=(const Rule_OtherChargesContLine& rule);

  const Rule_OtherChargesContLine* clone(void) const;

  static const Rule_OtherChargesContLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
