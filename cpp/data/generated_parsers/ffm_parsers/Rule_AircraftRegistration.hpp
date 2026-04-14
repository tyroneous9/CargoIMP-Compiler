/* -----------------------------------------------------------------------------
 * Rule_AircraftRegistration.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_AircraftRegistration_hpp
#define Rule_AircraftRegistration_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_AircraftRegistration : public Rule
{
public:
  Rule_AircraftRegistration(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_AircraftRegistration(const Rule_AircraftRegistration& rule);

  Rule_AircraftRegistration& operator=(const Rule_AircraftRegistration& rule);

  const Rule_AircraftRegistration* clone(void) const;

  static const Rule_AircraftRegistration* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
