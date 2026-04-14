/* -----------------------------------------------------------------------------
 * Rule_RouteLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_RouteLine_hpp
#define Rule_RouteLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_RouteLine : public Rule
{
public:
  Rule_RouteLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_RouteLine(const Rule_RouteLine& rule);

  Rule_RouteLine& operator=(const Rule_RouteLine& rule);

  const Rule_RouteLine* clone(void) const;

  static const Rule_RouteLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
