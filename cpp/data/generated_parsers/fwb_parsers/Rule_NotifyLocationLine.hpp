/* -----------------------------------------------------------------------------
 * Rule_NotifyLocationLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_NotifyLocationLine_hpp
#define Rule_NotifyLocationLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_NotifyLocationLine : public Rule
{
public:
  Rule_NotifyLocationLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_NotifyLocationLine(const Rule_NotifyLocationLine& rule);

  Rule_NotifyLocationLine& operator=(const Rule_NotifyLocationLine& rule);

  const Rule_NotifyLocationLine* clone(void) const;

  static const Rule_NotifyLocationLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
