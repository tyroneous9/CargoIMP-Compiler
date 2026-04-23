/* -----------------------------------------------------------------------------
 * Rule_OsiBlock.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_OsiBlock_hpp
#define Rule_OsiBlock_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_OsiBlock : public Rule
{
public:
  Rule_OsiBlock(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_OsiBlock(const Rule_OsiBlock& rule);

  Rule_OsiBlock& operator=(const Rule_OsiBlock& rule);

  const Rule_OsiBlock* clone(void) const;

  static const Rule_OsiBlock* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
