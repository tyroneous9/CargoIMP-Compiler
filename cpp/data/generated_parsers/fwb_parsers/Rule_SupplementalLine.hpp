/* -----------------------------------------------------------------------------
 * Rule_SupplementalLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:21:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_SupplementalLine_hpp
#define Rule_SupplementalLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_SupplementalLine : public Rule
{
public:
  Rule_SupplementalLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_SupplementalLine(const Rule_SupplementalLine& rule);

  Rule_SupplementalLine& operator=(const Rule_SupplementalLine& rule);

  const Rule_SupplementalLine* clone(void) const;

  static const Rule_SupplementalLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
