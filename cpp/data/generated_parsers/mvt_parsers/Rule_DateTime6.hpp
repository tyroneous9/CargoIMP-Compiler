/* -----------------------------------------------------------------------------
 * Rule_DateTime6.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_DateTime6_hpp
#define Rule_DateTime6_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_DateTime6 : public Rule
{
public:
  Rule_DateTime6(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_DateTime6(const Rule_DateTime6& rule);

  Rule_DateTime6& operator=(const Rule_DateTime6& rule);

  const Rule_DateTime6* clone(void) const;

  static const Rule_DateTime6* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
