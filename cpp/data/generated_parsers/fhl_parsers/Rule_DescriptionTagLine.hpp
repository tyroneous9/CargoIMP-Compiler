/* -----------------------------------------------------------------------------
 * Rule_DescriptionTagLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 22:01:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_DescriptionTagLine_hpp
#define Rule_DescriptionTagLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_DescriptionTagLine : public Rule
{
public:
  Rule_DescriptionTagLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_DescriptionTagLine(const Rule_DescriptionTagLine& rule);

  Rule_DescriptionTagLine& operator=(const Rule_DescriptionTagLine& rule);

  const Rule_DescriptionTagLine* clone(void) const;

  static const Rule_DescriptionTagLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
