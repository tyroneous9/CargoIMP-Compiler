/* -----------------------------------------------------------------------------
 * Rule_CarrierFlightNumber.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_CarrierFlightNumber_hpp
#define Rule_CarrierFlightNumber_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_CarrierFlightNumber : public Rule
{
public:
  Rule_CarrierFlightNumber(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_CarrierFlightNumber(const Rule_CarrierFlightNumber& rule);

  Rule_CarrierFlightNumber& operator=(const Rule_CarrierFlightNumber& rule);

  const Rule_CarrierFlightNumber* clone(void) const;

  static const Rule_CarrierFlightNumber* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
