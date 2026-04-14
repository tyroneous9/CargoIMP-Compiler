/* -----------------------------------------------------------------------------
 * Rule_ULDChar.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ULDChar_hpp
#define Rule_ULDChar_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ULDChar : public Rule
{
public:
  Rule_ULDChar(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ULDChar(const Rule_ULDChar& rule);

  Rule_ULDChar& operator=(const Rule_ULDChar& rule);

  const Rule_ULDChar* clone(void) const;

  static const Rule_ULDChar* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
