/* -----------------------------------------------------------------------------
 * Rule_ActualDepartureEstimatedArrivalLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ActualDepartureEstimatedArrivalLine_hpp
#define Rule_ActualDepartureEstimatedArrivalLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ActualDepartureEstimatedArrivalLine : public Rule
{
public:
  Rule_ActualDepartureEstimatedArrivalLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ActualDepartureEstimatedArrivalLine(const Rule_ActualDepartureEstimatedArrivalLine& rule);

  Rule_ActualDepartureEstimatedArrivalLine& operator=(const Rule_ActualDepartureEstimatedArrivalLine& rule);

  const Rule_ActualDepartureEstimatedArrivalLine* clone(void) const;

  static const Rule_ActualDepartureEstimatedArrivalLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
