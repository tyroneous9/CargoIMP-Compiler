/* -----------------------------------------------------------------------------
 * Rule_EstimatedArrivalAirport.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_EstimatedArrivalAirport_hpp
#define Rule_EstimatedArrivalAirport_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_EstimatedArrivalAirport : public Rule
{
public:
  Rule_EstimatedArrivalAirport(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_EstimatedArrivalAirport(const Rule_EstimatedArrivalAirport& rule);

  Rule_EstimatedArrivalAirport& operator=(const Rule_EstimatedArrivalAirport& rule);

  const Rule_EstimatedArrivalAirport* clone(void) const;

  static const Rule_EstimatedArrivalAirport* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
