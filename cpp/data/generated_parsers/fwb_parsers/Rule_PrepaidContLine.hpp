/* -----------------------------------------------------------------------------
 * Rule_PrepaidContLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_PrepaidContLine_hpp
#define Rule_PrepaidContLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_PrepaidContLine : public Rule
{
public:
  Rule_PrepaidContLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_PrepaidContLine(const Rule_PrepaidContLine& rule);

  Rule_PrepaidContLine& operator=(const Rule_PrepaidContLine& rule);

  const Rule_PrepaidContLine* clone(void) const;

  static const Rule_PrepaidContLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
