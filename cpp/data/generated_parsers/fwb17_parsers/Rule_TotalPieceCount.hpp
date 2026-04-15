/* -----------------------------------------------------------------------------
 * Rule_TotalPieceCount.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:21:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_TotalPieceCount_hpp
#define Rule_TotalPieceCount_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_TotalPieceCount : public Rule
{
public:
  Rule_TotalPieceCount(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_TotalPieceCount(const Rule_TotalPieceCount& rule);

  Rule_TotalPieceCount& operator=(const Rule_TotalPieceCount& rule);

  const Rule_TotalPieceCount* clone(void) const;

  static const Rule_TotalPieceCount* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
