/* -----------------------------------------------------------------------------
 * Rule_TotalWeight.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_TotalWeight_hpp
#define Rule_TotalWeight_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_TotalWeight : public Rule
{
public:
  Rule_TotalWeight(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_TotalWeight(const Rule_TotalWeight& rule);

  Rule_TotalWeight& operator=(const Rule_TotalWeight& rule);

  const Rule_TotalWeight* clone(void) const;

  static const Rule_TotalWeight* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
