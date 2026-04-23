/* -----------------------------------------------------------------------------
 * Rule_SsrTagLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_SsrTagLine_hpp
#define Rule_SsrTagLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_SsrTagLine : public Rule
{
public:
  Rule_SsrTagLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_SsrTagLine(const Rule_SsrTagLine& rule);

  Rule_SsrTagLine& operator=(const Rule_SsrTagLine& rule);

  const Rule_SsrTagLine* clone(void) const;

  static const Rule_SsrTagLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
