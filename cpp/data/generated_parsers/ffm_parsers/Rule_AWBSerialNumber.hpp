/* -----------------------------------------------------------------------------
 * Rule_AWBSerialNumber.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 20:34:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_AWBSerialNumber_hpp
#define Rule_AWBSerialNumber_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_AWBSerialNumber : public Rule
{
public:
  Rule_AWBSerialNumber(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_AWBSerialNumber(const Rule_AWBSerialNumber& rule);

  Rule_AWBSerialNumber& operator=(const Rule_AWBSerialNumber& rule);

  const Rule_AWBSerialNumber* clone(void) const;

  static const Rule_AWBSerialNumber* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
