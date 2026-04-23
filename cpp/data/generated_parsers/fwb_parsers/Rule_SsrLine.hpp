/* -----------------------------------------------------------------------------
 * Rule_SsrLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_SsrLine_hpp
#define Rule_SsrLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_SsrLine : public Rule
{
public:
  Rule_SsrLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_SsrLine(const Rule_SsrLine& rule);

  Rule_SsrLine& operator=(const Rule_SsrLine& rule);

  const Rule_SsrLine* clone(void) const;

  static const Rule_SsrLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
