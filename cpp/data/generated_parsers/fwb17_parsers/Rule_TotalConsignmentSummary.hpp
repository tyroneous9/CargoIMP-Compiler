/* -----------------------------------------------------------------------------
 * Rule_TotalConsignmentSummary.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:21:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_TotalConsignmentSummary_hpp
#define Rule_TotalConsignmentSummary_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_TotalConsignmentSummary : public Rule
{
public:
  Rule_TotalConsignmentSummary(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_TotalConsignmentSummary(const Rule_TotalConsignmentSummary& rule);

  Rule_TotalConsignmentSummary& operator=(const Rule_TotalConsignmentSummary& rule);

  const Rule_TotalConsignmentSummary* clone(void) const;

  static const Rule_TotalConsignmentSummary* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
