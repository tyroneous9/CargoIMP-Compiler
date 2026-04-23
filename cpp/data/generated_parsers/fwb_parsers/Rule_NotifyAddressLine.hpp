/* -----------------------------------------------------------------------------
 * Rule_NotifyAddressLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_NotifyAddressLine_hpp
#define Rule_NotifyAddressLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_NotifyAddressLine : public Rule
{
public:
  Rule_NotifyAddressLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_NotifyAddressLine(const Rule_NotifyAddressLine& rule);

  Rule_NotifyAddressLine& operator=(const Rule_NotifyAddressLine& rule);

  const Rule_NotifyAddressLine* clone(void) const;

  static const Rule_NotifyAddressLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
