/* -----------------------------------------------------------------------------
 * Rule_FHL4.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_FHL4_hpp
#define Rule_FHL4_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_FHL4 : public Rule
{
public:
  Rule_FHL4(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_FHL4(const Rule_FHL4& rule);

  Rule_FHL4& operator=(const Rule_FHL4& rule);

  const Rule_FHL4* clone(void) const;

  static const Rule_FHL4* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
