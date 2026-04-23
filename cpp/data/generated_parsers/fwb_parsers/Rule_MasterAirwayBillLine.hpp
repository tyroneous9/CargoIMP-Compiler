/* -----------------------------------------------------------------------------
 * Rule_MasterAirwayBillLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_MasterAirwayBillLine_hpp
#define Rule_MasterAirwayBillLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_MasterAirwayBillLine : public Rule
{
public:
  Rule_MasterAirwayBillLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_MasterAirwayBillLine(const Rule_MasterAirwayBillLine& rule);

  Rule_MasterAirwayBillLine& operator=(const Rule_MasterAirwayBillLine& rule);

  const Rule_MasterAirwayBillLine* clone(void) const;

  static const Rule_MasterAirwayBillLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
