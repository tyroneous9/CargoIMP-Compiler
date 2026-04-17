/* -----------------------------------------------------------------------------
 * Rule_MasterOriginAndDestination.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 22:01:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_MasterOriginAndDestination_hpp
#define Rule_MasterOriginAndDestination_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_MasterOriginAndDestination : public Rule
{
public:
  Rule_MasterOriginAndDestination(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_MasterOriginAndDestination(const Rule_MasterOriginAndDestination& rule);

  Rule_MasterOriginAndDestination& operator=(const Rule_MasterOriginAndDestination& rule);

  const Rule_MasterOriginAndDestination* clone(void) const;

  static const Rule_MasterOriginAndDestination* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
