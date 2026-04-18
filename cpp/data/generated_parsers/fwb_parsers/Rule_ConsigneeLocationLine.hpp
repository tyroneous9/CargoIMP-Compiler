/* -----------------------------------------------------------------------------
 * Rule_ConsigneeLocationLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ConsigneeLocationLine_hpp
#define Rule_ConsigneeLocationLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ConsigneeLocationLine : public Rule
{
public:
  Rule_ConsigneeLocationLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ConsigneeLocationLine(const Rule_ConsigneeLocationLine& rule);

  Rule_ConsigneeLocationLine& operator=(const Rule_ConsigneeLocationLine& rule);

  const Rule_ConsigneeLocationLine* clone(void) const;

  static const Rule_ConsigneeLocationLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
