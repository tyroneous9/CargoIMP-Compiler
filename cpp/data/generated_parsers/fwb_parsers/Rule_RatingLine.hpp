/* -----------------------------------------------------------------------------
 * Rule_RatingLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_RatingLine_hpp
#define Rule_RatingLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_RatingLine : public Rule
{
public:
  Rule_RatingLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_RatingLine(const Rule_RatingLine& rule);

  Rule_RatingLine& operator=(const Rule_RatingLine& rule);

  const Rule_RatingLine* clone(void) const;

  static const Rule_RatingLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
