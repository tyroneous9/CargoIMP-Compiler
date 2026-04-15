/* -----------------------------------------------------------------------------
 * Rule_ConsigneeBlock.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:36:00 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ConsigneeBlock_hpp
#define Rule_ConsigneeBlock_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ConsigneeBlock : public Rule
{
public:
  Rule_ConsigneeBlock(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ConsigneeBlock(const Rule_ConsigneeBlock& rule);

  Rule_ConsigneeBlock& operator=(const Rule_ConsigneeBlock& rule);

  const Rule_ConsigneeBlock* clone(void) const;

  static const Rule_ConsigneeBlock* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
