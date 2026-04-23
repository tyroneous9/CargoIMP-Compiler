/* -----------------------------------------------------------------------------
 * Rule_EstimatedArrivalOnlyLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_EstimatedArrivalOnlyLine_hpp
#define Rule_EstimatedArrivalOnlyLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_EstimatedArrivalOnlyLine : public Rule
{
public:
  Rule_EstimatedArrivalOnlyLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_EstimatedArrivalOnlyLine(const Rule_EstimatedArrivalOnlyLine& rule);

  Rule_EstimatedArrivalOnlyLine& operator=(const Rule_EstimatedArrivalOnlyLine& rule);

  const Rule_EstimatedArrivalOnlyLine* clone(void) const;

  static const Rule_EstimatedArrivalOnlyLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
