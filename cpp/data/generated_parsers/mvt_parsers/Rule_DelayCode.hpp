/* -----------------------------------------------------------------------------
 * Rule_DelayCode.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_DelayCode_hpp
#define Rule_DelayCode_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_DelayCode : public Rule
{
public:
  Rule_DelayCode(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_DelayCode(const Rule_DelayCode& rule);

  Rule_DelayCode& operator=(const Rule_DelayCode& rule);

  const Rule_DelayCode* clone(void) const;

  static const Rule_DelayCode* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
