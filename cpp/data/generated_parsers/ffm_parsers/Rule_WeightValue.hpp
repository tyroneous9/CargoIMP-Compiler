/* -----------------------------------------------------------------------------
 * Rule_WeightValue.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 22:09:18 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_WeightValue_hpp
#define Rule_WeightValue_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_WeightValue : public Rule
{
public:
  Rule_WeightValue(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_WeightValue(const Rule_WeightValue& rule);

  Rule_WeightValue& operator=(const Rule_WeightValue& rule);

  const Rule_WeightValue* clone(void) const;

  static const Rule_WeightValue* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
