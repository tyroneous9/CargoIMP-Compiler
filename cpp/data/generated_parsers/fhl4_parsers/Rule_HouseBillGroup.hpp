/* -----------------------------------------------------------------------------
 * Rule_HouseBillGroup.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 15 00:18:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_HouseBillGroup_hpp
#define Rule_HouseBillGroup_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_HouseBillGroup : public Rule
{
public:
  Rule_HouseBillGroup(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_HouseBillGroup(const Rule_HouseBillGroup& rule);

  Rule_HouseBillGroup& operator=(const Rule_HouseBillGroup& rule);

  const Rule_HouseBillGroup* clone(void) const;

  static const Rule_HouseBillGroup* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
