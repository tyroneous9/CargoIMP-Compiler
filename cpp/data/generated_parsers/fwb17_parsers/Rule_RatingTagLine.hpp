/* -----------------------------------------------------------------------------
 * Rule_RatingTagLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:21:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_RatingTagLine_hpp
#define Rule_RatingTagLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_RatingTagLine : public Rule
{
public:
  Rule_RatingTagLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_RatingTagLine(const Rule_RatingTagLine& rule);

  Rule_RatingTagLine& operator=(const Rule_RatingTagLine& rule);

  const Rule_RatingTagLine* clone(void) const;

  static const Rule_RatingTagLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
