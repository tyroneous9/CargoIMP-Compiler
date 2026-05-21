/* -----------------------------------------------------------------------------
 * Rule_QualifierToken.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu May 21 16:34:36 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_QualifierToken_hpp
#define Rule_QualifierToken_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_QualifierToken : public Rule
{
public:
  Rule_QualifierToken(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_QualifierToken(const Rule_QualifierToken& rule);

  Rule_QualifierToken& operator=(const Rule_QualifierToken& rule);

  const Rule_QualifierToken* clone(void) const;

  static const Rule_QualifierToken* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
