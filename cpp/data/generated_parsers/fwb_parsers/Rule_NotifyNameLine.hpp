/* -----------------------------------------------------------------------------
 * Rule_NotifyNameLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:21:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_NotifyNameLine_hpp
#define Rule_NotifyNameLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_NotifyNameLine : public Rule
{
public:
  Rule_NotifyNameLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_NotifyNameLine(const Rule_NotifyNameLine& rule);

  Rule_NotifyNameLine& operator=(const Rule_NotifyNameLine& rule);

  const Rule_NotifyNameLine* clone(void) const;

  static const Rule_NotifyNameLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
