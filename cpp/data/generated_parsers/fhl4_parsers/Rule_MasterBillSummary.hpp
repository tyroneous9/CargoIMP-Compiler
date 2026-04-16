/* -----------------------------------------------------------------------------
 * Rule_MasterBillSummary.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 15 00:18:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_MasterBillSummary_hpp
#define Rule_MasterBillSummary_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_MasterBillSummary : public Rule
{
public:
  Rule_MasterBillSummary(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_MasterBillSummary(const Rule_MasterBillSummary& rule);

  Rule_MasterBillSummary& operator=(const Rule_MasterBillSummary& rule);

  const Rule_MasterBillSummary* clone(void) const;

  static const Rule_MasterBillSummary* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
