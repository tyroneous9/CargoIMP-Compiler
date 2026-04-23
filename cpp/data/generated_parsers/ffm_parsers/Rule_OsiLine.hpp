/* -----------------------------------------------------------------------------
 * Rule_OsiLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 18:15:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_OsiLine_hpp
#define Rule_OsiLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_OsiLine : public Rule
{
public:
  Rule_OsiLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_OsiLine(const Rule_OsiLine& rule);

  Rule_OsiLine& operator=(const Rule_OsiLine& rule);

  const Rule_OsiLine* clone(void) const;

  static const Rule_OsiLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
