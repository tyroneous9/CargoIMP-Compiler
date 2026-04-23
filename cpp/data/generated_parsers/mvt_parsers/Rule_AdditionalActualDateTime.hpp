/* -----------------------------------------------------------------------------
 * Rule_AdditionalActualDateTime.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_AdditionalActualDateTime_hpp
#define Rule_AdditionalActualDateTime_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_AdditionalActualDateTime : public Rule
{
public:
  Rule_AdditionalActualDateTime(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_AdditionalActualDateTime(const Rule_AdditionalActualDateTime& rule);

  Rule_AdditionalActualDateTime& operator=(const Rule_AdditionalActualDateTime& rule);

  const Rule_AdditionalActualDateTime* clone(void) const;

  static const Rule_AdditionalActualDateTime* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
