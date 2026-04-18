/* -----------------------------------------------------------------------------
 * Rule_Day.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_Day_hpp
#define Rule_Day_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_Day : public Rule
{
public:
  Rule_Day(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_Day(const Rule_Day& rule);

  Rule_Day& operator=(const Rule_Day& rule);

  const Rule_Day* clone(void) const;

  static const Rule_Day* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
