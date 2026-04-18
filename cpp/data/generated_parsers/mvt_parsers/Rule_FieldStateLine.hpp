/* -----------------------------------------------------------------------------
 * Rule_FieldStateLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_FieldStateLine_hpp
#define Rule_FieldStateLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_FieldStateLine : public Rule
{
public:
  Rule_FieldStateLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_FieldStateLine(const Rule_FieldStateLine& rule);

  Rule_FieldStateLine& operator=(const Rule_FieldStateLine& rule);

  const Rule_FieldStateLine* clone(void) const;

  static const Rule_FieldStateLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
