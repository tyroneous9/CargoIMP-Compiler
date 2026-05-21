/* -----------------------------------------------------------------------------
 * Rule_ULDIdentifier.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu May 21 16:34:36 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_ULDIdentifier_hpp
#define Rule_ULDIdentifier_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_ULDIdentifier : public Rule
{
public:
  Rule_ULDIdentifier(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_ULDIdentifier(const Rule_ULDIdentifier& rule);

  Rule_ULDIdentifier& operator=(const Rule_ULDIdentifier& rule);

  const Rule_ULDIdentifier* clone(void) const;

  static const Rule_ULDIdentifier* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
