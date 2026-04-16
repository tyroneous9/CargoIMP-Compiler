/* -----------------------------------------------------------------------------
 * Rule_DescriptionBlock.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 15 00:18:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_DescriptionBlock_hpp
#define Rule_DescriptionBlock_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_DescriptionBlock : public Rule
{
public:
  Rule_DescriptionBlock(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_DescriptionBlock(const Rule_DescriptionBlock& rule);

  Rule_DescriptionBlock& operator=(const Rule_DescriptionBlock& rule);

  const Rule_DescriptionBlock* clone(void) const;

  static const Rule_DescriptionBlock* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
