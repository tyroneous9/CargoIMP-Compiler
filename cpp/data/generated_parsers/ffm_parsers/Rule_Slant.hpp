/* -----------------------------------------------------------------------------
 * Rule_Slant.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 22:09:18 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_Slant_hpp
#define Rule_Slant_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_Slant : public Rule
{
public:
  Rule_Slant(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_Slant(const Rule_Slant& rule);

  Rule_Slant& operator=(const Rule_Slant& rule);

  const Rule_Slant* clone(void) const;

  static const Rule_Slant* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
