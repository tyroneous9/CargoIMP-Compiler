/* -----------------------------------------------------------------------------
 * Rule_VolumeAmount.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_VolumeAmount_hpp
#define Rule_VolumeAmount_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_VolumeAmount : public Rule
{
public:
  Rule_VolumeAmount(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_VolumeAmount(const Rule_VolumeAmount& rule);

  Rule_VolumeAmount& operator=(const Rule_VolumeAmount& rule);

  const Rule_VolumeAmount* clone(void) const;

  static const Rule_VolumeAmount* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
