/* -----------------------------------------------------------------------------
 * Rule_OciLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:36:00 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_OciLine_hpp
#define Rule_OciLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_OciLine : public Rule
{
public:
  Rule_OciLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_OciLine(const Rule_OciLine& rule);

  Rule_OciLine& operator=(const Rule_OciLine& rule);

  const Rule_OciLine* clone(void) const;

  static const Rule_OciLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
