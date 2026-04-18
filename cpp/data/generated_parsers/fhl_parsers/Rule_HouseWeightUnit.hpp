/* -----------------------------------------------------------------------------
 * Rule_HouseWeightUnit.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_HouseWeightUnit_hpp
#define Rule_HouseWeightUnit_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_HouseWeightUnit : public Rule
{
public:
  Rule_HouseWeightUnit(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_HouseWeightUnit(const Rule_HouseWeightUnit& rule);

  Rule_HouseWeightUnit& operator=(const Rule_HouseWeightUnit& rule);

  const Rule_HouseWeightUnit* clone(void) const;

  static const Rule_HouseWeightUnit* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
