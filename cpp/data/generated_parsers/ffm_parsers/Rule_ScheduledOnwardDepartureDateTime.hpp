/* -----------------------------------------------------------------------------
 * Rule_ScheduledOnwardDepartureDateTime.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sun May 24 20:39:41 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ScheduledOnwardDepartureDateTime_hpp
#define Rule_ScheduledOnwardDepartureDateTime_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ScheduledOnwardDepartureDateTime : public Rule
{
public:
  Rule_ScheduledOnwardDepartureDateTime(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ScheduledOnwardDepartureDateTime(const Rule_ScheduledOnwardDepartureDateTime& rule);

  Rule_ScheduledOnwardDepartureDateTime& operator=(const Rule_ScheduledOnwardDepartureDateTime& rule);

  const Rule_ScheduledOnwardDepartureDateTime* clone(void) const;

  static const Rule_ScheduledOnwardDepartureDateTime* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
