/* -----------------------------------------------------------------------------
 * Rule_SphLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_SphLine_hpp
#define Rule_SphLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_SphLine : public Rule
{
public:
  Rule_SphLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_SphLine(const Rule_SphLine& rule);

  Rule_SphLine& operator=(const Rule_SphLine& rule);

  const Rule_SphLine* clone(void) const;

  static const Rule_SphLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
