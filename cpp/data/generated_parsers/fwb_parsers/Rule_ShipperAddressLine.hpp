/* -----------------------------------------------------------------------------
 * Rule_ShipperAddressLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ShipperAddressLine_hpp
#define Rule_ShipperAddressLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ShipperAddressLine : public Rule
{
public:
  Rule_ShipperAddressLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ShipperAddressLine(const Rule_ShipperAddressLine& rule);

  Rule_ShipperAddressLine& operator=(const Rule_ShipperAddressLine& rule);

  const Rule_ShipperAddressLine* clone(void) const;

  static const Rule_ShipperAddressLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
