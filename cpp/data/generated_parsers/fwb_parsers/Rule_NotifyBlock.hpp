/* -----------------------------------------------------------------------------
 * Rule_NotifyBlock.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_NotifyBlock_hpp
#define Rule_NotifyBlock_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_NotifyBlock : public Rule
{
public:
  Rule_NotifyBlock(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_NotifyBlock(const Rule_NotifyBlock& rule);

  Rule_NotifyBlock& operator=(const Rule_NotifyBlock& rule);

  const Rule_NotifyBlock* clone(void) const;

  static const Rule_NotifyBlock* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
