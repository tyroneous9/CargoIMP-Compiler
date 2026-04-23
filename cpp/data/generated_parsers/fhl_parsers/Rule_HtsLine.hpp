/* -----------------------------------------------------------------------------
 * Rule_HtsLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_HtsLine_hpp
#define Rule_HtsLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_HtsLine : public Rule
{
public:
  Rule_HtsLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_HtsLine(const Rule_HtsLine& rule);

  Rule_HtsLine& operator=(const Rule_HtsLine& rule);

  const Rule_HtsLine* clone(void) const;

  static const Rule_HtsLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
