/* -----------------------------------------------------------------------------
 * Rule_ConsigneeSubLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ConsigneeSubLine_hpp
#define Rule_ConsigneeSubLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ConsigneeSubLine : public Rule
{
public:
  Rule_ConsigneeSubLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ConsigneeSubLine(const Rule_ConsigneeSubLine& rule);

  Rule_ConsigneeSubLine& operator=(const Rule_ConsigneeSubLine& rule);

  const Rule_ConsigneeSubLine* clone(void) const;

  static const Rule_ConsigneeSubLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
