/* -----------------------------------------------------------------------------
 * Rule_PaxLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_PaxLine_hpp
#define Rule_PaxLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_PaxLine : public Rule
{
public:
  Rule_PaxLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_PaxLine(const Rule_PaxLine& rule);

  Rule_PaxLine& operator=(const Rule_PaxLine& rule);

  const Rule_PaxLine* clone(void) const;

  static const Rule_PaxLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
