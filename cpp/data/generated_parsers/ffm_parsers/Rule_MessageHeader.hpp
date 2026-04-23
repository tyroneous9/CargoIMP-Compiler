/* -----------------------------------------------------------------------------
 * Rule_MessageHeader.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_MessageHeader_hpp
#define Rule_MessageHeader_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_MessageHeader : public Rule
{
public:
  Rule_MessageHeader(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_MessageHeader(const Rule_MessageHeader& rule);

  Rule_MessageHeader& operator=(const Rule_MessageHeader& rule);

  const Rule_MessageHeader* clone(void) const;

  static const Rule_MessageHeader* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
