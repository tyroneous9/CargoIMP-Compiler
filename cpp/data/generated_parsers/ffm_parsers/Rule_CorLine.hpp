/* -----------------------------------------------------------------------------
 * Rule_CorLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_CorLine_hpp
#define Rule_CorLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_CorLine : public Rule
{
public:
  Rule_CorLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_CorLine(const Rule_CorLine& rule);

  Rule_CorLine& operator=(const Rule_CorLine& rule);

  const Rule_CorLine* clone(void) const;

  static const Rule_CorLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
