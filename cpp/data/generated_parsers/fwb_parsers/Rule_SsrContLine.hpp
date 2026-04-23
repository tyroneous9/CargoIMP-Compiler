/* -----------------------------------------------------------------------------
 * Rule_SsrContLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_SsrContLine_hpp
#define Rule_SsrContLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_SsrContLine : public Rule
{
public:
  Rule_SsrContLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_SsrContLine(const Rule_SsrContLine& rule);

  Rule_SsrContLine& operator=(const Rule_SsrContLine& rule);

  const Rule_SsrContLine* clone(void) const;

  static const Rule_SsrContLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
