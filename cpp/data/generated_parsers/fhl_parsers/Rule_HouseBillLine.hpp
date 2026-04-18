/* -----------------------------------------------------------------------------
 * Rule_HouseBillLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_HouseBillLine_hpp
#define Rule_HouseBillLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_HouseBillLine : public Rule
{
public:
  Rule_HouseBillLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_HouseBillLine(const Rule_HouseBillLine& rule);

  Rule_HouseBillLine& operator=(const Rule_HouseBillLine& rule);

  const Rule_HouseBillLine* clone(void) const;

  static const Rule_HouseBillLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
