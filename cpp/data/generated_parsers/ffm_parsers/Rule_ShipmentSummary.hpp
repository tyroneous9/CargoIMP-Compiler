/* -----------------------------------------------------------------------------
 * Rule_ShipmentSummary.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 20:34:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ShipmentSummary_hpp
#define Rule_ShipmentSummary_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ShipmentSummary : public Rule
{
public:
  Rule_ShipmentSummary(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ShipmentSummary(const Rule_ShipmentSummary& rule);

  Rule_ShipmentSummary& operator=(const Rule_ShipmentSummary& rule);

  const Rule_ShipmentSummary* clone(void) const;

  static const Rule_ShipmentSummary* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
