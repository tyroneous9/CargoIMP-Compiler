/* -----------------------------------------------------------------------------
 * Rule_DescriptionContLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 15 00:18:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_DescriptionContLine_hpp
#define Rule_DescriptionContLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_DescriptionContLine : public Rule
{
public:
  Rule_DescriptionContLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_DescriptionContLine(const Rule_DescriptionContLine& rule);

  Rule_DescriptionContLine& operator=(const Rule_DescriptionContLine& rule);

  const Rule_DescriptionContLine* clone(void) const;

  static const Rule_DescriptionContLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
