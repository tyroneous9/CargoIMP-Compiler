/* -----------------------------------------------------------------------------
 * Rule_TransitArrivalLineNoNIL.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu May 21 16:34:36 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_TransitArrivalLineNoNIL_hpp
#define Rule_TransitArrivalLineNoNIL_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_TransitArrivalLineNoNIL : public Rule
{
public:
  Rule_TransitArrivalLineNoNIL(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_TransitArrivalLineNoNIL(const Rule_TransitArrivalLineNoNIL& rule);

  Rule_TransitArrivalLineNoNIL& operator=(const Rule_TransitArrivalLineNoNIL& rule);

  const Rule_TransitArrivalLineNoNIL* clone(void) const;

  static const Rule_TransitArrivalLineNoNIL* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
