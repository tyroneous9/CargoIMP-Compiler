/* -----------------------------------------------------------------------------
 * Rule_ShipperBlock.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ShipperBlock_hpp
#define Rule_ShipperBlock_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ShipperBlock : public Rule
{
public:
  Rule_ShipperBlock(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ShipperBlock(const Rule_ShipperBlock& rule);

  Rule_ShipperBlock& operator=(const Rule_ShipperBlock& rule);

  const Rule_ShipperBlock* clone(void) const;

  static const Rule_ShipperBlock* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
