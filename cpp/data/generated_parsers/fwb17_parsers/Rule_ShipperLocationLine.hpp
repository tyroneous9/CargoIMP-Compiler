/* -----------------------------------------------------------------------------
 * Rule_ShipperLocationLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ShipperLocationLine_hpp
#define Rule_ShipperLocationLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ShipperLocationLine : public Rule
{
public:
  Rule_ShipperLocationLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ShipperLocationLine(const Rule_ShipperLocationLine& rule);

  Rule_ShipperLocationLine& operator=(const Rule_ShipperLocationLine& rule);

  const Rule_ShipperLocationLine* clone(void) const;

  static const Rule_ShipperLocationLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
