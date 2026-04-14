/* -----------------------------------------------------------------------------
 * Rule_ConsigneeAddressLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ConsigneeAddressLine_hpp
#define Rule_ConsigneeAddressLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ConsigneeAddressLine : public Rule
{
public:
  Rule_ConsigneeAddressLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ConsigneeAddressLine(const Rule_ConsigneeAddressLine& rule);

  Rule_ConsigneeAddressLine& operator=(const Rule_ConsigneeAddressLine& rule);

  const Rule_ConsigneeAddressLine* clone(void) const;

  static const Rule_ConsigneeAddressLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
