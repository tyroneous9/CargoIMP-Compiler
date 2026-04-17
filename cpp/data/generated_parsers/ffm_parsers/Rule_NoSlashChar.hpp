/* -----------------------------------------------------------------------------
 * Rule_NoSlashChar.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 20:34:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_NoSlashChar_hpp
#define Rule_NoSlashChar_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_NoSlashChar : public Rule
{
public:
  Rule_NoSlashChar(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_NoSlashChar(const Rule_NoSlashChar& rule);

  Rule_NoSlashChar& operator=(const Rule_NoSlashChar& rule);

  const Rule_NoSlashChar* clone(void) const;

  static const Rule_NoSlashChar* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
