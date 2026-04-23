/* -----------------------------------------------------------------------------
 * Rule_ScheduledOnwardDepartureTime.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ScheduledOnwardDepartureTime_hpp
#define Rule_ScheduledOnwardDepartureTime_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ScheduledOnwardDepartureTime : public Rule
{
public:
  Rule_ScheduledOnwardDepartureTime(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ScheduledOnwardDepartureTime(const Rule_ScheduledOnwardDepartureTime& rule);

  Rule_ScheduledOnwardDepartureTime& operator=(const Rule_ScheduledOnwardDepartureTime& rule);

  const Rule_ScheduledOnwardDepartureTime* clone(void) const;

  static const Rule_ScheduledOnwardDepartureTime* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
