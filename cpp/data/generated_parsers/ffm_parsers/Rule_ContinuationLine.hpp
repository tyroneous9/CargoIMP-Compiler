/* -----------------------------------------------------------------------------
 * Rule_ContinuationLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 20:34:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ContinuationLine_hpp
#define Rule_ContinuationLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ContinuationLine : public Rule
{
public:
  Rule_ContinuationLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ContinuationLine(const Rule_ContinuationLine& rule);

  Rule_ContinuationLine& operator=(const Rule_ContinuationLine& rule);

  const Rule_ContinuationLine* clone(void) const;

  static const Rule_ContinuationLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
