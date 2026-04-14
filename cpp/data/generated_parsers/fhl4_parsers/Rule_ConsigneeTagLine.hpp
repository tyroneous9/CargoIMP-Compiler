/* -----------------------------------------------------------------------------
 * Rule_ConsigneeTagLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ConsigneeTagLine_hpp
#define Rule_ConsigneeTagLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ConsigneeTagLine : public Rule
{
public:
  Rule_ConsigneeTagLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ConsigneeTagLine(const Rule_ConsigneeTagLine& rule);

  Rule_ConsigneeTagLine& operator=(const Rule_ConsigneeTagLine& rule);

  const Rule_ConsigneeTagLine* clone(void) const;

  static const Rule_ConsigneeTagLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
