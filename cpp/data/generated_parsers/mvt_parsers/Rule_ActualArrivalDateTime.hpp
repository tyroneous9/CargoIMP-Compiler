/* -----------------------------------------------------------------------------
 * Rule_ActualArrivalDateTime.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ActualArrivalDateTime_hpp
#define Rule_ActualArrivalDateTime_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ActualArrivalDateTime : public Rule
{
public:
  Rule_ActualArrivalDateTime(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ActualArrivalDateTime(const Rule_ActualArrivalDateTime& rule);

  Rule_ActualArrivalDateTime& operator=(const Rule_ActualArrivalDateTime& rule);

  const Rule_ActualArrivalDateTime* clone(void) const;

  static const Rule_ActualArrivalDateTime* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
