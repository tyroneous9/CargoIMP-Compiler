/* -----------------------------------------------------------------------------
 * Rule_ScheduledArrivalDate.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 18:15:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ScheduledArrivalDate_hpp
#define Rule_ScheduledArrivalDate_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ScheduledArrivalDate : public Rule
{
public:
  Rule_ScheduledArrivalDate(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ScheduledArrivalDate(const Rule_ScheduledArrivalDate& rule);

  Rule_ScheduledArrivalDate& operator=(const Rule_ScheduledArrivalDate& rule);

  const Rule_ScheduledArrivalDate* clone(void) const;

  static const Rule_ScheduledArrivalDate* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
