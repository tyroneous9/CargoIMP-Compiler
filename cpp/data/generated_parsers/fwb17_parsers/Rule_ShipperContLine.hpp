/* -----------------------------------------------------------------------------
 * Rule_ShipperContLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:21:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ShipperContLine_hpp
#define Rule_ShipperContLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ShipperContLine : public Rule
{
public:
  Rule_ShipperContLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ShipperContLine(const Rule_ShipperContLine& rule);

  Rule_ShipperContLine& operator=(const Rule_ShipperContLine& rule);

  const Rule_ShipperContLine* clone(void) const;

  static const Rule_ShipperContLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
