/* -----------------------------------------------------------------------------
 * Rule_MasterPieceCount.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 22:01:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_MasterPieceCount_hpp
#define Rule_MasterPieceCount_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_MasterPieceCount : public Rule
{
public:
  Rule_MasterPieceCount(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_MasterPieceCount(const Rule_MasterPieceCount& rule);

  Rule_MasterPieceCount& operator=(const Rule_MasterPieceCount& rule);

  const Rule_MasterPieceCount* clone(void) const;

  static const Rule_MasterPieceCount* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
