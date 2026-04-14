/* -----------------------------------------------------------------------------
 * Rule_AgentContLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_AgentContLine_hpp
#define Rule_AgentContLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_AgentContLine : public Rule
{
public:
  Rule_AgentContLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_AgentContLine(const Rule_AgentContLine& rule);

  Rule_AgentContLine& operator=(const Rule_AgentContLine& rule);

  const Rule_AgentContLine* clone(void) const;

  static const Rule_AgentContLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
