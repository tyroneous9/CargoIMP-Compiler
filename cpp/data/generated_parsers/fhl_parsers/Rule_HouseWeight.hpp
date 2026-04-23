/* -----------------------------------------------------------------------------
 * Rule_HouseWeight.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_HouseWeight_hpp
#define Rule_HouseWeight_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_HouseWeight : public Rule
{
public:
  Rule_HouseWeight(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_HouseWeight(const Rule_HouseWeight& rule);

  Rule_HouseWeight& operator=(const Rule_HouseWeight& rule);

  const Rule_HouseWeight* clone(void) const;

  static const Rule_HouseWeight* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
