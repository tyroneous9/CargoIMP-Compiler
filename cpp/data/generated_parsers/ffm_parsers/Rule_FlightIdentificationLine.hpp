/* -----------------------------------------------------------------------------
 * Rule_FlightIdentificationLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:40:11 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_FlightIdentificationLine_hpp
#define Rule_FlightIdentificationLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_FlightIdentificationLine : public Rule
{
public:
  Rule_FlightIdentificationLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_FlightIdentificationLine(const Rule_FlightIdentificationLine& rule);

  Rule_FlightIdentificationLine& operator=(const Rule_FlightIdentificationLine& rule);

  const Rule_FlightIdentificationLine* clone(void) const;

  static const Rule_FlightIdentificationLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
