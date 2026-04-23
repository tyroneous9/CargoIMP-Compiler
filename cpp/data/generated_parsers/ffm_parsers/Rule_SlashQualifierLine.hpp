/* -----------------------------------------------------------------------------
 * Rule_SlashQualifierLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 18:15:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_SlashQualifierLine_hpp
#define Rule_SlashQualifierLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_SlashQualifierLine : public Rule
{
public:
  Rule_SlashQualifierLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_SlashQualifierLine(const Rule_SlashQualifierLine& rule);

  Rule_SlashQualifierLine& operator=(const Rule_SlashQualifierLine& rule);

  const Rule_SlashQualifierLine* clone(void) const;

  static const Rule_SlashQualifierLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
