/* -----------------------------------------------------------------------------
 * Rule_CvdLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_CvdLine_hpp
#define Rule_CvdLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_CvdLine : public Rule
{
public:
  Rule_CvdLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_CvdLine(const Rule_CvdLine& rule);

  Rule_CvdLine& operator=(const Rule_CvdLine& rule);

  const Rule_CvdLine* clone(void) const;

  static const Rule_CvdLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
