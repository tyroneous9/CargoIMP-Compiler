/* -----------------------------------------------------------------------------
 * Rule_HouseOriginAndDestination.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_HouseOriginAndDestination_hpp
#define Rule_HouseOriginAndDestination_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_HouseOriginAndDestination : public Rule
{
public:
  Rule_HouseOriginAndDestination(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_HouseOriginAndDestination(const Rule_HouseOriginAndDestination& rule);

  Rule_HouseOriginAndDestination& operator=(const Rule_HouseOriginAndDestination& rule);

  const Rule_HouseOriginAndDestination* clone(void) const;

  static const Rule_HouseOriginAndDestination* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
