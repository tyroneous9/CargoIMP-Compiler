/* -----------------------------------------------------------------------------
 * Rule_TransitNILArrivalLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_TransitNILArrivalLine_hpp
#define Rule_TransitNILArrivalLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_TransitNILArrivalLine : public Rule
{
public:
  Rule_TransitNILArrivalLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_TransitNILArrivalLine(const Rule_TransitNILArrivalLine& rule);

  Rule_TransitNILArrivalLine& operator=(const Rule_TransitNILArrivalLine& rule);

  const Rule_TransitNILArrivalLine* clone(void) const;

  static const Rule_TransitNILArrivalLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
