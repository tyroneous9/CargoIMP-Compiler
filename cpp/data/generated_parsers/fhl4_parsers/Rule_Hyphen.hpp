/* -----------------------------------------------------------------------------
 * Rule_Hyphen.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:36:00 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_Hyphen_hpp
#define Rule_Hyphen_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_Hyphen : public Rule
{
public:
  Rule_Hyphen(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_Hyphen(const Rule_Hyphen& rule);

  Rule_Hyphen& operator=(const Rule_Hyphen& rule);

  const Rule_Hyphen* clone(void) const;

  static const Rule_Hyphen* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
