/* -----------------------------------------------------------------------------
 * Rule_DayMonthTime.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 15 00:18:58 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_DayMonthTime_hpp
#define Rule_DayMonthTime_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_DayMonthTime : public Rule
{
public:
  Rule_DayMonthTime(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_DayMonthTime(const Rule_DayMonthTime& rule);

  Rule_DayMonthTime& operator=(const Rule_DayMonthTime& rule);

  const Rule_DayMonthTime* clone(void) const;

  static const Rule_DayMonthTime* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
