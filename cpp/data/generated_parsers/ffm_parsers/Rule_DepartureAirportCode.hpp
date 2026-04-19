/* -----------------------------------------------------------------------------
 * Rule_DepartureAirportCode.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 22:09:18 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_DepartureAirportCode_hpp
#define Rule_DepartureAirportCode_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_DepartureAirportCode : public Rule
{
public:
  Rule_DepartureAirportCode(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_DepartureAirportCode(const Rule_DepartureAirportCode& rule);

  Rule_DepartureAirportCode& operator=(const Rule_DepartureAirportCode& rule);

  const Rule_DepartureAirportCode* clone(void) const;

  static const Rule_DepartureAirportCode* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
