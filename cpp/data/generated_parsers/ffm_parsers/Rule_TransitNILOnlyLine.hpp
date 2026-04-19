/* -----------------------------------------------------------------------------
 * Rule_TransitNILOnlyLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 22:09:18 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_TransitNILOnlyLine_hpp
#define Rule_TransitNILOnlyLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_TransitNILOnlyLine : public Rule
{
public:
  Rule_TransitNILOnlyLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_TransitNILOnlyLine(const Rule_TransitNILOnlyLine& rule);

  Rule_TransitNILOnlyLine& operator=(const Rule_TransitNILOnlyLine& rule);

  const Rule_TransitNILOnlyLine* clone(void) const;

  static const Rule_TransitNILOnlyLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
