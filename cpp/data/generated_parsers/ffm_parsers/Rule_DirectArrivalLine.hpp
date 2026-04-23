/* -----------------------------------------------------------------------------
 * Rule_DirectArrivalLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 18:15:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_DirectArrivalLine_hpp
#define Rule_DirectArrivalLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_DirectArrivalLine : public Rule
{
public:
  Rule_DirectArrivalLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_DirectArrivalLine(const Rule_DirectArrivalLine& rule);

  Rule_DirectArrivalLine& operator=(const Rule_DirectArrivalLine& rule);

  const Rule_DirectArrivalLine* clone(void) const;

  static const Rule_DirectArrivalLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
