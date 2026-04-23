/* -----------------------------------------------------------------------------
 * Rule_UldSection.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_UldSection_hpp
#define Rule_UldSection_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_UldSection : public Rule
{
public:
  Rule_UldSection(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_UldSection(const Rule_UldSection& rule);

  Rule_UldSection& operator=(const Rule_UldSection& rule);

  const Rule_UldSection* clone(void) const;

  static const Rule_UldSection* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
