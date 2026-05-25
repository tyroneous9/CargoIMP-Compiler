/* -----------------------------------------------------------------------------
 * Rule_HouseBillBlock.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sun May 24 20:39:41 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_HouseBillBlock_hpp
#define Rule_HouseBillBlock_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_HouseBillBlock : public Rule
{
public:
  Rule_HouseBillBlock(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_HouseBillBlock(const Rule_HouseBillBlock& rule);

  Rule_HouseBillBlock& operator=(const Rule_HouseBillBlock& rule);

  const Rule_HouseBillBlock* clone(void) const;

  static const Rule_HouseBillBlock* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
