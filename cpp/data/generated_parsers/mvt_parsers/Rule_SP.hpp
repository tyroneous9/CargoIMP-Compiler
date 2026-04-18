/* -----------------------------------------------------------------------------
 * Rule_SP.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_SP_hpp
#define Rule_SP_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_SP : public Rule
{
public:
  Rule_SP(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_SP(const Rule_SP& rule);

  Rule_SP& operator=(const Rule_SP& rule);

  const Rule_SP* clone(void) const;

  static const Rule_SP* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
