/* -----------------------------------------------------------------------------
 * Rule_ConsigneeNameLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ConsigneeNameLine_hpp
#define Rule_ConsigneeNameLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ConsigneeNameLine : public Rule
{
public:
  Rule_ConsigneeNameLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ConsigneeNameLine(const Rule_ConsigneeNameLine& rule);

  Rule_ConsigneeNameLine& operator=(const Rule_ConsigneeNameLine& rule);

  const Rule_ConsigneeNameLine* clone(void) const;

  static const Rule_ConsigneeNameLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
