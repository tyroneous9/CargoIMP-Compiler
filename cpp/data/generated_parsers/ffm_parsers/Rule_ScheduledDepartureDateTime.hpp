/* -----------------------------------------------------------------------------
 * Rule_ScheduledDepartureDateTime.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu May 21 16:34:36 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ScheduledDepartureDateTime_hpp
#define Rule_ScheduledDepartureDateTime_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ScheduledDepartureDateTime : public Rule
{
public:
  Rule_ScheduledDepartureDateTime(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ScheduledDepartureDateTime(const Rule_ScheduledDepartureDateTime& rule);

  Rule_ScheduledDepartureDateTime& operator=(const Rule_ScheduledDepartureDateTime& rule);

  const Rule_ScheduledDepartureDateTime* clone(void) const;

  static const Rule_ScheduledDepartureDateTime* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
