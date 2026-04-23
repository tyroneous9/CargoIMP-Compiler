/* -----------------------------------------------------------------------------
 * Rule_EventDepartureLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_EventDepartureLine_hpp
#define Rule_EventDepartureLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_EventDepartureLine : public Rule
{
public:
  Rule_EventDepartureLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_EventDepartureLine(const Rule_EventDepartureLine& rule);

  Rule_EventDepartureLine& operator=(const Rule_EventDepartureLine& rule);

  const Rule_EventDepartureLine* clone(void) const;

  static const Rule_EventDepartureLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
