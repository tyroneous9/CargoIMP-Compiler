/* -----------------------------------------------------------------------------
 * Rule_LineChar.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_LineChar_hpp
#define Rule_LineChar_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_LineChar : public Rule
{
public:
  Rule_LineChar(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_LineChar(const Rule_LineChar& rule);

  Rule_LineChar& operator=(const Rule_LineChar& rule);

  const Rule_LineChar* clone(void) const;

  static const Rule_LineChar* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
