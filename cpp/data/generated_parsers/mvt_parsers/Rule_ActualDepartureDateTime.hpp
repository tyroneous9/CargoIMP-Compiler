/* -----------------------------------------------------------------------------
 * Rule_ActualDepartureDateTime.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ActualDepartureDateTime_hpp
#define Rule_ActualDepartureDateTime_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ActualDepartureDateTime : public Rule
{
public:
  Rule_ActualDepartureDateTime(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ActualDepartureDateTime(const Rule_ActualDepartureDateTime& rule);

  Rule_ActualDepartureDateTime& operator=(const Rule_ActualDepartureDateTime& rule);

  const Rule_ActualDepartureDateTime* clone(void) const;

  static const Rule_ActualDepartureDateTime* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
