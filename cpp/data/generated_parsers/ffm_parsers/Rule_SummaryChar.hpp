/* -----------------------------------------------------------------------------
 * Rule_SummaryChar.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 18:15:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_SummaryChar_hpp
#define Rule_SummaryChar_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_SummaryChar : public Rule
{
public:
  Rule_SummaryChar(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_SummaryChar(const Rule_SummaryChar& rule);

  Rule_SummaryChar& operator=(const Rule_SummaryChar& rule);

  const Rule_SummaryChar* clone(void) const;

  static const Rule_SummaryChar* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
