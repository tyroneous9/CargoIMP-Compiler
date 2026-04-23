/* -----------------------------------------------------------------------------
 * Rule_AccountingContLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_AccountingContLine_hpp
#define Rule_AccountingContLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_AccountingContLine : public Rule
{
public:
  Rule_AccountingContLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_AccountingContLine(const Rule_AccountingContLine& rule);

  Rule_AccountingContLine& operator=(const Rule_AccountingContLine& rule);

  const Rule_AccountingContLine* clone(void) const;

  static const Rule_AccountingContLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
