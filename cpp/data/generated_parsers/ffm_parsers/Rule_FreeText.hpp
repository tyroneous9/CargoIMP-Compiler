/* -----------------------------------------------------------------------------
 * Rule_FreeText.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sun May 24 20:39:41 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_FreeText_hpp
#define Rule_FreeText_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_FreeText : public Rule
{
public:
  Rule_FreeText(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_FreeText(const Rule_FreeText& rule);

  Rule_FreeText& operator=(const Rule_FreeText& rule);

  const Rule_FreeText* clone(void) const;

  static const Rule_FreeText* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
