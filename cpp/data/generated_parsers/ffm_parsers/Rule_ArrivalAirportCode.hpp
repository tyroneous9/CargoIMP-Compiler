/* -----------------------------------------------------------------------------
 * Rule_ArrivalAirportCode.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 18:15:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ArrivalAirportCode_hpp
#define Rule_ArrivalAirportCode_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ArrivalAirportCode : public Rule
{
public:
  Rule_ArrivalAirportCode(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ArrivalAirportCode(const Rule_ArrivalAirportCode& rule);

  Rule_ArrivalAirportCode& operator=(const Rule_ArrivalAirportCode& rule);

  const Rule_ArrivalAirportCode* clone(void) const;

  static const Rule_ArrivalAirportCode* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
