/* -----------------------------------------------------------------------------
 * Rule_MasterAirwayBillNumber.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_MasterAirwayBillNumber_hpp
#define Rule_MasterAirwayBillNumber_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_MasterAirwayBillNumber : public Rule
{
public:
  Rule_MasterAirwayBillNumber(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_MasterAirwayBillNumber(const Rule_MasterAirwayBillNumber& rule);

  Rule_MasterAirwayBillNumber& operator=(const Rule_MasterAirwayBillNumber& rule);

  const Rule_MasterAirwayBillNumber* clone(void) const;

  static const Rule_MasterAirwayBillNumber* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
