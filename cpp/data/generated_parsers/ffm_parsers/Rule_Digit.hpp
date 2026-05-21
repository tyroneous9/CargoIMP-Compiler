/* -----------------------------------------------------------------------------
 * Rule_Digit.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu May 21 16:34:36 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_Digit_hpp
#define Rule_Digit_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_Digit : public Rule
{
public:
  Rule_Digit(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_Digit(const Rule_Digit& rule);

  Rule_Digit& operator=(const Rule_Digit& rule);

  const Rule_Digit* clone(void) const;

  static const Rule_Digit* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
