/* -----------------------------------------------------------------------------
 * Rule_TrailerLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu May 21 16:34:36 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_TrailerLine_hpp
#define Rule_TrailerLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_TrailerLine : public Rule
{
public:
  Rule_TrailerLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_TrailerLine(const Rule_TrailerLine& rule);

  Rule_TrailerLine& operator=(const Rule_TrailerLine& rule);

  const Rule_TrailerLine* clone(void) const;

  static const Rule_TrailerLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
