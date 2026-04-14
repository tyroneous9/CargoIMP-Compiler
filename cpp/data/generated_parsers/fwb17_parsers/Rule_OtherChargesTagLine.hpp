/* -----------------------------------------------------------------------------
 * Rule_OtherChargesTagLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_OtherChargesTagLine_hpp
#define Rule_OtherChargesTagLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_OtherChargesTagLine : public Rule
{
public:
  Rule_OtherChargesTagLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_OtherChargesTagLine(const Rule_OtherChargesTagLine& rule);

  Rule_OtherChargesTagLine& operator=(const Rule_OtherChargesTagLine& rule);

  const Rule_OtherChargesTagLine* clone(void) const;

  static const Rule_OtherChargesTagLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
