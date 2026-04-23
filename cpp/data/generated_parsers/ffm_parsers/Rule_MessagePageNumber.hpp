/* -----------------------------------------------------------------------------
 * Rule_MessagePageNumber.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_MessagePageNumber_hpp
#define Rule_MessagePageNumber_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_MessagePageNumber : public Rule
{
public:
  Rule_MessagePageNumber(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_MessagePageNumber(const Rule_MessagePageNumber& rule);

  Rule_MessagePageNumber& operator=(const Rule_MessagePageNumber& rule);

  const Rule_MessagePageNumber* clone(void) const;

  static const Rule_MessagePageNumber* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
