/* -----------------------------------------------------------------------------
 * Rule_HouseWaybillNumber.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:36:00 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_HouseWaybillNumber_hpp
#define Rule_HouseWaybillNumber_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_HouseWaybillNumber : public Rule
{
public:
  Rule_HouseWaybillNumber(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_HouseWaybillNumber(const Rule_HouseWaybillNumber& rule);

  Rule_HouseWaybillNumber& operator=(const Rule_HouseWaybillNumber& rule);

  const Rule_HouseWaybillNumber* clone(void) const;

  static const Rule_HouseWaybillNumber* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
