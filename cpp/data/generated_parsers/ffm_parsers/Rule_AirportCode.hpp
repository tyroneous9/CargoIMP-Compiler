/* -----------------------------------------------------------------------------
 * Rule_AirportCode.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sun May 24 20:39:41 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_AirportCode_hpp
#define Rule_AirportCode_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_AirportCode : public Rule
{
public:
  Rule_AirportCode(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_AirportCode(const Rule_AirportCode& rule);

  Rule_AirportCode& operator=(const Rule_AirportCode& rule);

  const Rule_AirportCode* clone(void) const;

  static const Rule_AirportCode* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
