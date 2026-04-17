/* -----------------------------------------------------------------------------
 * Rule_MessageFunctionCode.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 20:34:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_MessageFunctionCode_hpp
#define Rule_MessageFunctionCode_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_MessageFunctionCode : public Rule
{
public:
  Rule_MessageFunctionCode(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_MessageFunctionCode(const Rule_MessageFunctionCode& rule);

  Rule_MessageFunctionCode& operator=(const Rule_MessageFunctionCode& rule);

  const Rule_MessageFunctionCode* clone(void) const;

  static const Rule_MessageFunctionCode* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
