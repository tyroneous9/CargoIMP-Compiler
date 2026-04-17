/* -----------------------------------------------------------------------------
 * Rule_WeightUnit.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 20:34:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_WeightUnit_hpp
#define Rule_WeightUnit_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_WeightUnit : public Rule
{
public:
  Rule_WeightUnit(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_WeightUnit(const Rule_WeightUnit& rule);

  Rule_WeightUnit& operator=(const Rule_WeightUnit& rule);

  const Rule_WeightUnit* clone(void) const;

  static const Rule_WeightUnit* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
