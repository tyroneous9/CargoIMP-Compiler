/* -----------------------------------------------------------------------------
 * Rule_Dot.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 22:09:18 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_Dot_hpp
#define Rule_Dot_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_Dot : public Rule
{
public:
  Rule_Dot(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_Dot(const Rule_Dot& rule);

  Rule_Dot& operator=(const Rule_Dot& rule);

  const Rule_Dot* clone(void) const;

  static const Rule_Dot* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
