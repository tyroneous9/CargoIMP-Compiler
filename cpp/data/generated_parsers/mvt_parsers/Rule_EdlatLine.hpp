/* -----------------------------------------------------------------------------
 * Rule_EdlatLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_EdlatLine_hpp
#define Rule_EdlatLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_EdlatLine : public Rule
{
public:
  Rule_EdlatLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_EdlatLine(const Rule_EdlatLine& rule);

  Rule_EdlatLine& operator=(const Rule_EdlatLine& rule);

  const Rule_EdlatLine* clone(void) const;

  static const Rule_EdlatLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
