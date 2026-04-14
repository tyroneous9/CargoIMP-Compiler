/* -----------------------------------------------------------------------------
 * Rule_FWB17.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_FWB17_hpp
#define Rule_FWB17_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_FWB17 : public Rule
{
public:
  Rule_FWB17(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_FWB17(const Rule_FWB17& rule);

  Rule_FWB17& operator=(const Rule_FWB17& rule);

  const Rule_FWB17* clone(void) const;

  static const Rule_FWB17* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
