/* -----------------------------------------------------------------------------
 * Rule_MasterWeightUnit.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_MasterWeightUnit_hpp
#define Rule_MasterWeightUnit_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_MasterWeightUnit : public Rule
{
public:
  Rule_MasterWeightUnit(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_MasterWeightUnit(const Rule_MasterWeightUnit& rule);

  Rule_MasterWeightUnit& operator=(const Rule_MasterWeightUnit& rule);

  const Rule_MasterWeightUnit* clone(void) const;

  static const Rule_MasterWeightUnit* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
