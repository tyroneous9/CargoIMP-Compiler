/* -----------------------------------------------------------------------------
 * Rule_HouseSlac.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_HouseSlac_hpp
#define Rule_HouseSlac_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_HouseSlac : public Rule
{
public:
  Rule_HouseSlac(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_HouseSlac(const Rule_HouseSlac& rule);

  Rule_HouseSlac& operator=(const Rule_HouseSlac& rule);

  const Rule_HouseSlac* clone(void) const;

  static const Rule_HouseSlac* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
