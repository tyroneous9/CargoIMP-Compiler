/* -----------------------------------------------------------------------------
 * Rule_SciLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 20:34:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_SciLine_hpp
#define Rule_SciLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_SciLine : public Rule
{
public:
  Rule_SciLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_SciLine(const Rule_SciLine& rule);

  Rule_SciLine& operator=(const Rule_SciLine& rule);

  const Rule_SciLine* clone(void) const;

  static const Rule_SciLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
