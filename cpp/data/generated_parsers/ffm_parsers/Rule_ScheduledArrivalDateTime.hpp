/* -----------------------------------------------------------------------------
 * Rule_ScheduledArrivalDateTime.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu May 21 16:34:36 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ScheduledArrivalDateTime_hpp
#define Rule_ScheduledArrivalDateTime_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ScheduledArrivalDateTime : public Rule
{
public:
  Rule_ScheduledArrivalDateTime(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ScheduledArrivalDateTime(const Rule_ScheduledArrivalDateTime& rule);

  Rule_ScheduledArrivalDateTime& operator=(const Rule_ScheduledArrivalDateTime& rule);

  const Rule_ScheduledArrivalDateTime* clone(void) const;

  static const Rule_ScheduledArrivalDateTime* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
