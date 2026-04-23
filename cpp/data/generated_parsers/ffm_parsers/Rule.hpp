/* -----------------------------------------------------------------------------
 * Rule.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 18:15:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Rule_hpp
#define Rule_hpp

#include <string>
#include <vector>

class Visitor;

class Rule
{
public:
  std::string spelling;
  std::vector<const Rule*> rules;

  Rule(const std::string& spelling, const std::vector<const Rule*>& rules);
  Rule(const Rule& rule);

  Rule& operator=(const Rule& rule);

  virtual ~Rule();

  virtual const Rule* clone(void) const = 0;

  virtual void* accept(Visitor& visitor) const = 0;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
