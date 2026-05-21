/* -----------------------------------------------------------------------------
 * Rule_ScheduledDepartureTime.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu May 21 16:34:36 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ScheduledDepartureTime_hpp
#define Rule_ScheduledDepartureTime_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ScheduledDepartureTime : public Rule
{
public:
  Rule_ScheduledDepartureTime(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ScheduledDepartureTime(const Rule_ScheduledDepartureTime& rule);

  Rule_ScheduledDepartureTime& operator=(const Rule_ScheduledDepartureTime& rule);

  const Rule_ScheduledDepartureTime* clone(void) const;

  static const Rule_ScheduledDepartureTime* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
