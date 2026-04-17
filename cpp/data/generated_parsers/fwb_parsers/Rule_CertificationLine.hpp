/* -----------------------------------------------------------------------------
 * Rule_CertificationLine.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:21:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_CertificationLine_hpp
#define Rule_CertificationLine_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_CertificationLine : public Rule
{
public:
  Rule_CertificationLine(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_CertificationLine(const Rule_CertificationLine& rule);

  Rule_CertificationLine& operator=(const Rule_CertificationLine& rule);

  const Rule_CertificationLine* clone(void) const;

  static const Rule_CertificationLine* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
