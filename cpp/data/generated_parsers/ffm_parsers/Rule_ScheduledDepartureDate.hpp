/* -----------------------------------------------------------------------------
 * Rule_ScheduledDepartureDate.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 18:15:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ScheduledDepartureDate_hpp
#define Rule_ScheduledDepartureDate_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ScheduledDepartureDate : public Rule
{
public:
  Rule_ScheduledDepartureDate(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ScheduledDepartureDate(const Rule_ScheduledDepartureDate& rule);

  Rule_ScheduledDepartureDate& operator=(const Rule_ScheduledDepartureDate& rule);

  const Rule_ScheduledDepartureDate* clone(void) const;

  static const Rule_ScheduledDepartureDate* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
