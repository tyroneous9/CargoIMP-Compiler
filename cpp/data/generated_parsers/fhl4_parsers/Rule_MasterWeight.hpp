/* -----------------------------------------------------------------------------
 * Rule_MasterWeight.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:36:00 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_MasterWeight_hpp
#define Rule_MasterWeight_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_MasterWeight : public Rule
{
public:
  Rule_MasterWeight(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_MasterWeight(const Rule_MasterWeight& rule);

  Rule_MasterWeight& operator=(const Rule_MasterWeight& rule);

  const Rule_MasterWeight* clone(void) const;

  static const Rule_MasterWeight* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
