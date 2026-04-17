/* -----------------------------------------------------------------------------
 * Rule_AccountingTagLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:21:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_AccountingTagLine_hpp
#define Rule_AccountingTagLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_AccountingTagLine : public Rule
{
public:
  Rule_AccountingTagLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_AccountingTagLine(const Rule_AccountingTagLine& rule);

  Rule_AccountingTagLine& operator=(const Rule_AccountingTagLine& rule);

  const Rule_AccountingTagLine* clone(void) const;

  static const Rule_AccountingTagLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
