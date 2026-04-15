/* -----------------------------------------------------------------------------
 * Rule_AirWaybillLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:40:11 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_AirWaybillLine_hpp
#define Rule_AirWaybillLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_AirWaybillLine : public Rule
{
public:
  Rule_AirWaybillLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_AirWaybillLine(const Rule_AirWaybillLine& rule);

  Rule_AirWaybillLine& operator=(const Rule_AirWaybillLine& rule);

  const Rule_AirWaybillLine* clone(void) const;

  static const Rule_AirWaybillLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
