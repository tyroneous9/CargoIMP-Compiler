/* -----------------------------------------------------------------------------
 * Rule_EstimatedArrivalTime.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_EstimatedArrivalTime_hpp
#define Rule_EstimatedArrivalTime_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_EstimatedArrivalTime : public Rule
{
public:
  Rule_EstimatedArrivalTime(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_EstimatedArrivalTime(const Rule_EstimatedArrivalTime& rule);

  Rule_EstimatedArrivalTime& operator=(const Rule_EstimatedArrivalTime& rule);

  const Rule_EstimatedArrivalTime* clone(void) const;

  static const Rule_EstimatedArrivalTime* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
