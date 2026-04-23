/* -----------------------------------------------------------------------------
 * Rule_OtherChargesLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_OtherChargesLine_hpp
#define Rule_OtherChargesLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_OtherChargesLine : public Rule
{
public:
  Rule_OtherChargesLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_OtherChargesLine(const Rule_OtherChargesLine& rule);

  Rule_OtherChargesLine& operator=(const Rule_OtherChargesLine& rule);

  const Rule_OtherChargesLine* clone(void) const;

  static const Rule_OtherChargesLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
