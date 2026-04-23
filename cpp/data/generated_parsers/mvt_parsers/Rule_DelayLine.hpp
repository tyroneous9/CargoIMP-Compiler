/* -----------------------------------------------------------------------------
 * Rule_DelayLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_DelayLine_hpp
#define Rule_DelayLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_DelayLine : public Rule
{
public:
  Rule_DelayLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_DelayLine(const Rule_DelayLine& rule);

  Rule_DelayLine& operator=(const Rule_DelayLine& rule);

  const Rule_DelayLine* clone(void) const;

  static const Rule_DelayLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
