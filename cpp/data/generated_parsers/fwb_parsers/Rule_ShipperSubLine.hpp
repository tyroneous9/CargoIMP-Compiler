/* -----------------------------------------------------------------------------
 * Rule_ShipperSubLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ShipperSubLine_hpp
#define Rule_ShipperSubLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ShipperSubLine : public Rule
{
public:
  Rule_ShipperSubLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ShipperSubLine(const Rule_ShipperSubLine& rule);

  Rule_ShipperSubLine& operator=(const Rule_ShipperSubLine& rule);

  const Rule_ShipperSubLine* clone(void) const;

  static const Rule_ShipperSubLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
