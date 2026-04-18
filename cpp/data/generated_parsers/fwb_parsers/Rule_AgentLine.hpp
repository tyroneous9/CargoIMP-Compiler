/* -----------------------------------------------------------------------------
 * Rule_AgentLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_AgentLine_hpp
#define Rule_AgentLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_AgentLine : public Rule
{
public:
  Rule_AgentLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_AgentLine(const Rule_AgentLine& rule);

  Rule_AgentLine& operator=(const Rule_AgentLine& rule);

  const Rule_AgentLine* clone(void) const;

  static const Rule_AgentLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
