/* -----------------------------------------------------------------------------
 * Rule_AirlinePrefix.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:40:11 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_AirlinePrefix_hpp
#define Rule_AirlinePrefix_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_AirlinePrefix : public Rule
{
public:
  Rule_AirlinePrefix(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_AirlinePrefix(const Rule_AirlinePrefix& rule);

  Rule_AirlinePrefix& operator=(const Rule_AirlinePrefix& rule);

  const Rule_AirlinePrefix* clone(void) const;

  static const Rule_AirlinePrefix* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
