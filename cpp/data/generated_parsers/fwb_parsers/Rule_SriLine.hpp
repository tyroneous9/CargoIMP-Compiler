/* -----------------------------------------------------------------------------
 * Rule_SriLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_SriLine_hpp
#define Rule_SriLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_SriLine : public Rule
{
public:
  Rule_SriLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_SriLine(const Rule_SriLine& rule);

  Rule_SriLine& operator=(const Rule_SriLine& rule);

  const Rule_SriLine* clone(void) const;

  static const Rule_SriLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
