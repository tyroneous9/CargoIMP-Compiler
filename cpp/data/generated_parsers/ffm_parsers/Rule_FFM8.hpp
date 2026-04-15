/* -----------------------------------------------------------------------------
 * Rule_FFM8.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:40:11 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_FFM8_hpp
#define Rule_FFM8_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_FFM8 : public Rule
{
public:
  Rule_FFM8(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_FFM8(const Rule_FFM8& rule);

  Rule_FFM8& operator=(const Rule_FFM8& rule);

  const Rule_FFM8* clone(void) const;

  static const Rule_FFM8* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
