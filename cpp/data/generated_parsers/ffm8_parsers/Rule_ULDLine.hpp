/* -----------------------------------------------------------------------------
 * Rule_ULDLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 15 00:18:58 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ULDLine_hpp
#define Rule_ULDLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ULDLine : public Rule
{
public:
  Rule_ULDLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ULDLine(const Rule_ULDLine& rule);

  Rule_ULDLine& operator=(const Rule_ULDLine& rule);

  const Rule_ULDLine* clone(void) const;

  static const Rule_ULDLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
