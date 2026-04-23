/* -----------------------------------------------------------------------------
 * Rule_IssuanceLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_IssuanceLine_hpp
#define Rule_IssuanceLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_IssuanceLine : public Rule
{
public:
  Rule_IssuanceLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_IssuanceLine(const Rule_IssuanceLine& rule);

  Rule_IssuanceLine& operator=(const Rule_IssuanceLine& rule);

  const Rule_IssuanceLine* clone(void) const;

  static const Rule_IssuanceLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
