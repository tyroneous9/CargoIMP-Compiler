/* -----------------------------------------------------------------------------
 * Rule_ArrivalInformationLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sun May 24 20:39:41 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ArrivalInformationLine_hpp
#define Rule_ArrivalInformationLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ArrivalInformationLine : public Rule
{
public:
  Rule_ArrivalInformationLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ArrivalInformationLine(const Rule_ArrivalInformationLine& rule);

  Rule_ArrivalInformationLine& operator=(const Rule_ArrivalInformationLine& rule);

  const Rule_ArrivalInformationLine* clone(void) const;

  static const Rule_ArrivalInformationLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
