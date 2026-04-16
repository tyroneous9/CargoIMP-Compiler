/* -----------------------------------------------------------------------------
 * Rule_PieceCount.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 15 00:18:58 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_PieceCount_hpp
#define Rule_PieceCount_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_PieceCount : public Rule
{
public:
  Rule_PieceCount(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_PieceCount(const Rule_PieceCount& rule);

  Rule_PieceCount& operator=(const Rule_PieceCount& rule);

  const Rule_PieceCount* clone(void) const;

  static const Rule_PieceCount* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
