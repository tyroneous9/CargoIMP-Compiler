/* -----------------------------------------------------------------------------
 * Rule_Month.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 20:34:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_Month_hpp
#define Rule_Month_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_Month : public Rule
{
public:
  Rule_Month(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_Month(const Rule_Month& rule);

  Rule_Month& operator=(const Rule_Month& rule);

  const Rule_Month* clone(void) const;

  static const Rule_Month* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
