/* -----------------------------------------------------------------------------
 * Rule_OriginAndDestination.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 15 00:18:58 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_OriginAndDestination_hpp
#define Rule_OriginAndDestination_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_OriginAndDestination : public Rule
{
public:
  Rule_OriginAndDestination(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_OriginAndDestination(const Rule_OriginAndDestination& rule);

  Rule_OriginAndDestination& operator=(const Rule_OriginAndDestination& rule);

  const Rule_OriginAndDestination* clone(void) const;

  static const Rule_OriginAndDestination* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
