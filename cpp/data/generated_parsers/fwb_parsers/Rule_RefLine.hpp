/* -----------------------------------------------------------------------------
 * Rule_RefLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_RefLine_hpp
#define Rule_RefLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_RefLine : public Rule
{
public:
  Rule_RefLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_RefLine(const Rule_RefLine& rule);

  Rule_RefLine& operator=(const Rule_RefLine& rule);

  const Rule_RefLine* clone(void) const;

  static const Rule_RefLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
