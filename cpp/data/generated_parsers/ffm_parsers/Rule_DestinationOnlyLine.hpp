/* -----------------------------------------------------------------------------
 * Rule_DestinationOnlyLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 18:15:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_DestinationOnlyLine_hpp
#define Rule_DestinationOnlyLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_DestinationOnlyLine : public Rule
{
public:
  Rule_DestinationOnlyLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_DestinationOnlyLine(const Rule_DestinationOnlyLine& rule);

  Rule_DestinationOnlyLine& operator=(const Rule_DestinationOnlyLine& rule);

  const Rule_DestinationOnlyLine* clone(void) const;

  static const Rule_DestinationOnlyLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
