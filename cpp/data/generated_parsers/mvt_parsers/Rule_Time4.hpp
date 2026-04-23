/* -----------------------------------------------------------------------------
 * Rule_Time4.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_Time4_hpp
#define Rule_Time4_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_Time4 : public Rule
{
public:
  Rule_Time4(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_Time4(const Rule_Time4& rule);

  Rule_Time4& operator=(const Rule_Time4& rule);

  const Rule_Time4* clone(void) const;

  static const Rule_Time4* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
