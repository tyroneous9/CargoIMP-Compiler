/* -----------------------------------------------------------------------------
 * Rule_AlphaNum.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 20:34:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_AlphaNum_hpp
#define Rule_AlphaNum_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_AlphaNum : public Rule
{
public:
  Rule_AlphaNum(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_AlphaNum(const Rule_AlphaNum& rule);

  Rule_AlphaNum& operator=(const Rule_AlphaNum& rule);

  const Rule_AlphaNum* clone(void) const;

  static const Rule_AlphaNum* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
