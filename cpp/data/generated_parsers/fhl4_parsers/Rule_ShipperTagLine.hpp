/* -----------------------------------------------------------------------------
 * Rule_ShipperTagLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ShipperTagLine_hpp
#define Rule_ShipperTagLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ShipperTagLine : public Rule
{
public:
  Rule_ShipperTagLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ShipperTagLine(const Rule_ShipperTagLine& rule);

  Rule_ShipperTagLine& operator=(const Rule_ShipperTagLine& rule);

  const Rule_ShipperTagLine* clone(void) const;

  static const Rule_ShipperTagLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
