/* -----------------------------------------------------------------------------
 * Rule_HtsContLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_HtsContLine_hpp
#define Rule_HtsContLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_HtsContLine : public Rule
{
public:
  Rule_HtsContLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_HtsContLine(const Rule_HtsContLine& rule);

  Rule_HtsContLine& operator=(const Rule_HtsContLine& rule);

  const Rule_HtsContLine* clone(void) const;

  static const Rule_HtsContLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
