/* -----------------------------------------------------------------------------
 * Rule_PrepaidLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_PrepaidLine_hpp
#define Rule_PrepaidLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_PrepaidLine : public Rule
{
public:
  Rule_PrepaidLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_PrepaidLine(const Rule_PrepaidLine& rule);

  Rule_PrepaidLine& operator=(const Rule_PrepaidLine& rule);

  const Rule_PrepaidLine* clone(void) const;

  static const Rule_PrepaidLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
