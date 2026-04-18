/* -----------------------------------------------------------------------------
 * Rule_ShipperNameLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ShipperNameLine_hpp
#define Rule_ShipperNameLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ShipperNameLine : public Rule
{
public:
  Rule_ShipperNameLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ShipperNameLine(const Rule_ShipperNameLine& rule);

  Rule_ShipperNameLine& operator=(const Rule_ShipperNameLine& rule);

  const Rule_ShipperNameLine* clone(void) const;

  static const Rule_ShipperNameLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
