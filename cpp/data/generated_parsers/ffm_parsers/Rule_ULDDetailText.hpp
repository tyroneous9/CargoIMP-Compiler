/* -----------------------------------------------------------------------------
 * Rule_ULDDetailText.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu May 21 16:34:36 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ULDDetailText_hpp
#define Rule_ULDDetailText_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ULDDetailText : public Rule
{
public:
  Rule_ULDDetailText(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ULDDetailText(const Rule_ULDDetailText& rule);

  Rule_ULDDetailText& operator=(const Rule_ULDDetailText& rule);

  const Rule_ULDDetailText* clone(void) const;

  static const Rule_ULDDetailText* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
