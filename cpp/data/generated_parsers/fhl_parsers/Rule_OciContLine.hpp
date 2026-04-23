/* -----------------------------------------------------------------------------
 * Rule_OciContLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_OciContLine_hpp
#define Rule_OciContLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_OciContLine : public Rule
{
public:
  Rule_OciContLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_OciContLine(const Rule_OciContLine& rule);

  Rule_OciContLine& operator=(const Rule_OciContLine& rule);

  const Rule_OciContLine* clone(void) const;

  static const Rule_OciContLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
