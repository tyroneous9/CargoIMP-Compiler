/* -----------------------------------------------------------------------------
 * Rule_RoutingLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_RoutingLine_hpp
#define Rule_RoutingLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_RoutingLine : public Rule
{
public:
  Rule_RoutingLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_RoutingLine(const Rule_RoutingLine& rule);

  Rule_RoutingLine& operator=(const Rule_RoutingLine& rule);

  const Rule_RoutingLine* clone(void) const;

  static const Rule_RoutingLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
