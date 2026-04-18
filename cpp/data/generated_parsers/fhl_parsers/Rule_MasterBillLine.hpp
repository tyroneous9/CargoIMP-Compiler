/* -----------------------------------------------------------------------------
 * Rule_MasterBillLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_MasterBillLine_hpp
#define Rule_MasterBillLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_MasterBillLine : public Rule
{
public:
  Rule_MasterBillLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_MasterBillLine(const Rule_MasterBillLine& rule);

  Rule_MasterBillLine& operator=(const Rule_MasterBillLine& rule);

  const Rule_MasterBillLine* clone(void) const;

  static const Rule_MasterBillLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
