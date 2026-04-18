/* -----------------------------------------------------------------------------
 * Rule_ArdLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ArdLine_hpp
#define Rule_ArdLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ArdLine : public Rule
{
public:
  Rule_ArdLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ArdLine(const Rule_ArdLine& rule);

  Rule_ArdLine& operator=(const Rule_ArdLine& rule);

  const Rule_ArdLine* clone(void) const;

  static const Rule_ArdLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
