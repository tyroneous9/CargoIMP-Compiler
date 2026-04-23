/* -----------------------------------------------------------------------------
 * Rule_ScheduledArrivalTime.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 18:15:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ScheduledArrivalTime_hpp
#define Rule_ScheduledArrivalTime_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ScheduledArrivalTime : public Rule
{
public:
  Rule_ScheduledArrivalTime(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ScheduledArrivalTime(const Rule_ScheduledArrivalTime& rule);

  Rule_ScheduledArrivalTime& operator=(const Rule_ScheduledArrivalTime& rule);

  const Rule_ScheduledArrivalTime* clone(void) const;

  static const Rule_ScheduledArrivalTime* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
