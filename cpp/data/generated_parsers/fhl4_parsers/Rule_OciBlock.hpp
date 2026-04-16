/* -----------------------------------------------------------------------------
 * Rule_OciBlock.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 15 00:18:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_OciBlock_hpp
#define Rule_OciBlock_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_OciBlock : public Rule
{
public:
  Rule_OciBlock(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_OciBlock(const Rule_OciBlock& rule);

  Rule_OciBlock& operator=(const Rule_OciBlock& rule);

  const Rule_OciBlock* clone(void) const;

  static const Rule_OciBlock* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
