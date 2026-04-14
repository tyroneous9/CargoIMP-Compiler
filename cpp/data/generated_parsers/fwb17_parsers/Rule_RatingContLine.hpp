/* -----------------------------------------------------------------------------
 * Rule_RatingContLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_RatingContLine_hpp
#define Rule_RatingContLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_RatingContLine : public Rule
{
public:
  Rule_RatingContLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_RatingContLine(const Rule_RatingContLine& rule);

  Rule_RatingContLine& operator=(const Rule_RatingContLine& rule);

  const Rule_RatingContLine* clone(void) const;

  static const Rule_RatingContLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
