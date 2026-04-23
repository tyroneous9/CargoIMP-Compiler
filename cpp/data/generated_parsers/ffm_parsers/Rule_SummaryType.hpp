/* -----------------------------------------------------------------------------
 * Rule_SummaryType.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_SummaryType_hpp
#define Rule_SummaryType_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_SummaryType : public Rule
{
public:
  Rule_SummaryType(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_SummaryType(const Rule_SummaryType& rule);

  Rule_SummaryType& operator=(const Rule_SummaryType& rule);

  const Rule_SummaryType* clone(void) const;

  static const Rule_SummaryType* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
