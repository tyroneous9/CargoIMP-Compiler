/* -----------------------------------------------------------------------------
 * Rule_MVTMessage.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_MVTMessage_hpp
#define Rule_MVTMessage_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_MVTMessage : public Rule
{
public:
  Rule_MVTMessage(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_MVTMessage(const Rule_MVTMessage& rule);

  Rule_MVTMessage& operator=(const Rule_MVTMessage& rule);

  const Rule_MVTMessage* clone(void) const;

  static const Rule_MVTMessage* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
