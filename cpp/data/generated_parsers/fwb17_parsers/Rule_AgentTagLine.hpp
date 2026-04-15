/* -----------------------------------------------------------------------------
 * Rule_AgentTagLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:21:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_AgentTagLine_hpp
#define Rule_AgentTagLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_AgentTagLine : public Rule
{
public:
  Rule_AgentTagLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_AgentTagLine(const Rule_AgentTagLine& rule);

  Rule_AgentTagLine& operator=(const Rule_AgentTagLine& rule);

  const Rule_AgentTagLine* clone(void) const;

  static const Rule_AgentTagLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
