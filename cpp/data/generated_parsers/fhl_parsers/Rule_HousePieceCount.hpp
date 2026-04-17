/* -----------------------------------------------------------------------------
 * Rule_HousePieceCount.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu Apr 16 22:01:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_HousePieceCount_hpp
#define Rule_HousePieceCount_hpp

#include <string>
#include <vector>

#include "Rule.hpp"

class Visitor;
class ParserContext;

class Rule_HousePieceCount : public Rule
{
public:
  Rule_HousePieceCount(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule_HousePieceCount(const Rule_HousePieceCount& rule);

  Rule_HousePieceCount& operator=(const Rule_HousePieceCount& rule);

  const Rule_HousePieceCount* clone(void) const;

  static const Rule_HousePieceCount* parse(ParserContext& context);

  void* accept(Visitor& visitor) const;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
