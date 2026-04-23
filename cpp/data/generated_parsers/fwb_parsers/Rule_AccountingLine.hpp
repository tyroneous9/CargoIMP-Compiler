/* -----------------------------------------------------------------------------
 * Rule_AccountingLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_AccountingLine_hpp
#define Rule_AccountingLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_AccountingLine : public Rule
{
public:
  Rule_AccountingLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_AccountingLine(const Rule_AccountingLine& rule);

  Rule_AccountingLine& operator=(const Rule_AccountingLine& rule);

  const Rule_AccountingLine* clone(void) const;

  static const Rule_AccountingLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
