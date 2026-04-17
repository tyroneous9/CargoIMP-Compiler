/* -----------------------------------------------------------------------------
 * Rule_Upper.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 22:01:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_Upper_hpp
#define Rule_Upper_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_Upper : public Rule
{
public:
  Rule_Upper(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_Upper(const Rule_Upper& rule);

  Rule_Upper& operator=(const Rule_Upper& rule);

  const Rule_Upper* clone(void) const;

  static const Rule_Upper* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
