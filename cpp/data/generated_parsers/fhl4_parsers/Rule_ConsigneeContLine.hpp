/* -----------------------------------------------------------------------------
 * Rule_ConsigneeContLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:36:00 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ConsigneeContLine_hpp
#define Rule_ConsigneeContLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ConsigneeContLine : public Rule
{
public:
  Rule_ConsigneeContLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ConsigneeContLine(const Rule_ConsigneeContLine& rule);

  Rule_ConsigneeContLine& operator=(const Rule_ConsigneeContLine& rule);

  const Rule_ConsigneeContLine* clone(void) const;

  static const Rule_ConsigneeContLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
