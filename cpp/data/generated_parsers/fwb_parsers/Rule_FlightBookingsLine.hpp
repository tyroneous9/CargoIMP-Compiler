/* -----------------------------------------------------------------------------
 * Rule_FlightBookingsLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_FlightBookingsLine_hpp
#define Rule_FlightBookingsLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_FlightBookingsLine : public Rule
{
public:
  Rule_FlightBookingsLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_FlightBookingsLine(const Rule_FlightBookingsLine& rule);

  Rule_FlightBookingsLine& operator=(const Rule_FlightBookingsLine& rule);

  const Rule_FlightBookingsLine* clone(void) const;

  static const Rule_FlightBookingsLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
