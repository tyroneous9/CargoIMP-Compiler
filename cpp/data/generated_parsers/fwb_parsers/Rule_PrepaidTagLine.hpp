/* -----------------------------------------------------------------------------
 * Rule_PrepaidTagLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_PrepaidTagLine_hpp
#define Rule_PrepaidTagLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_PrepaidTagLine : public Rule
{
public:
  Rule_PrepaidTagLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_PrepaidTagLine(const Rule_PrepaidTagLine& rule);

  Rule_PrepaidTagLine& operator=(const Rule_PrepaidTagLine& rule);

  const Rule_PrepaidTagLine* clone(void) const;

  static const Rule_PrepaidTagLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
