/* -----------------------------------------------------------------------------
 * Rule_VolumeUnit.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu May 21 16:34:36 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_VolumeUnit_hpp
#define Rule_VolumeUnit_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_VolumeUnit : public Rule
{
public:
  Rule_VolumeUnit(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_VolumeUnit(const Rule_VolumeUnit& rule);

  Rule_VolumeUnit& operator=(const Rule_VolumeUnit& rule);

  const Rule_VolumeUnit* clone(void) const;

  static const Rule_VolumeUnit* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
