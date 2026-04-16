/* -----------------------------------------------------------------------------
 * Rule_EOL.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 15 00:18:58 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_EOL_hpp
#define Rule_EOL_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_EOL : public Rule
{
public:
  Rule_EOL(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_EOL(const Rule_EOL& rule);

  Rule_EOL& operator=(const Rule_EOL& rule);

  const Rule_EOL* clone(void) const;

  static const Rule_EOL* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
