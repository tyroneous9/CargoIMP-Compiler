/* -----------------------------------------------------------------------------
 * Rule_IssuanceDate.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_IssuanceDate_hpp
#define Rule_IssuanceDate_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_IssuanceDate : public Rule
{
public:
  Rule_IssuanceDate(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_IssuanceDate(const Rule_IssuanceDate& rule);

  Rule_IssuanceDate& operator=(const Rule_IssuanceDate& rule);

  const Rule_IssuanceDate* clone(void) const;

  static const Rule_IssuanceDate* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
