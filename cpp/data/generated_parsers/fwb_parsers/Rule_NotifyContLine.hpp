/* -----------------------------------------------------------------------------
 * Rule_NotifyContLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_NotifyContLine_hpp
#define Rule_NotifyContLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_NotifyContLine : public Rule
{
public:
  Rule_NotifyContLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_NotifyContLine(const Rule_NotifyContLine& rule);

  Rule_NotifyContLine& operator=(const Rule_NotifyContLine& rule);

  const Rule_NotifyContLine* clone(void) const;

  static const Rule_NotifyContLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
