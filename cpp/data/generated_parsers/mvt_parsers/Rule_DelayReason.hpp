/* -----------------------------------------------------------------------------
 * Rule_DelayReason.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_DelayReason_hpp
#define Rule_DelayReason_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_DelayReason : public Rule
{
public:
  Rule_DelayReason(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_DelayReason(const Rule_DelayReason& rule);

  Rule_DelayReason& operator=(const Rule_DelayReason& rule);

  const Rule_DelayReason* clone(void) const;

  static const Rule_DelayReason* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
