/* -----------------------------------------------------------------------------
 * Rule_SiLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_SiLine_hpp
#define Rule_SiLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_SiLine : public Rule
{
public:
  Rule_SiLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_SiLine(const Rule_SiLine& rule);

  Rule_SiLine& operator=(const Rule_SiLine& rule);

  const Rule_SiLine* clone(void) const;

  static const Rule_SiLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
