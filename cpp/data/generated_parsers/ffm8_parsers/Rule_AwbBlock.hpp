/* -----------------------------------------------------------------------------
 * Rule_AwbBlock.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 15 00:18:58 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_AwbBlock_hpp
#define Rule_AwbBlock_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_AwbBlock : public Rule
{
public:
  Rule_AwbBlock(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_AwbBlock(const Rule_AwbBlock& rule);

  Rule_AwbBlock& operator=(const Rule_AwbBlock& rule);

  const Rule_AwbBlock* clone(void) const;

  static const Rule_AwbBlock* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
