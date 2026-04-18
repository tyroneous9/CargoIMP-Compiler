/* -----------------------------------------------------------------------------
 * Rule_SupplementLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_SupplementLine_hpp
#define Rule_SupplementLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_SupplementLine : public Rule
{
public:
  Rule_SupplementLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_SupplementLine(const Rule_SupplementLine& rule);

  Rule_SupplementLine& operator=(const Rule_SupplementLine& rule);

  const Rule_SupplementLine* clone(void) const;

  static const Rule_SupplementLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
