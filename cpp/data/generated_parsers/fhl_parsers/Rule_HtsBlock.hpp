/* -----------------------------------------------------------------------------
 * Rule_HtsBlock.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 22:01:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_HtsBlock_hpp
#define Rule_HtsBlock_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_HtsBlock : public Rule
{
public:
  Rule_HtsBlock(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_HtsBlock(const Rule_HtsBlock& rule);

  Rule_HtsBlock& operator=(const Rule_HtsBlock& rule);

  const Rule_HtsBlock* clone(void) const;

  static const Rule_HtsBlock* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
