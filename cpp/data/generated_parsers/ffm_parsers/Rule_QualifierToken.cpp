/* -----------------------------------------------------------------------------
 * Rule_QualifierToken.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <string>
using std::string;

#include <vector>
using std::vector;

#include "Rule_QualifierToken.hpp"
#include "Visitor.hpp"
#include "ParserAlternative.hpp"
#include "ParserContext.hpp"

#include "Rule_NoSlashChar.hpp"

Rule_QualifierToken::Rule_QualifierToken(
  const string& spelling, 
  const vector<const Rule*>& rules) : Rule(spelling, rules)
{
}

Rule_QualifierToken::Rule_QualifierToken(const Rule_QualifierToken& rule) : Rule(rule)
{
}

Rule_QualifierToken& Rule_QualifierToken::operator=(const Rule_QualifierToken& rule)
{
  Rule::operator=(rule);
  return *this;
}

const Rule_QualifierToken* Rule_QualifierToken::clone() const
{
  return new Rule_QualifierToken(this->spelling, this->rules);
}

void* Rule_QualifierToken::accept(Visitor& visitor) const
{
  return visitor.visit(this);
}

const Rule_QualifierToken* Rule_QualifierToken::parse(ParserContext& context)
{
  context.push("QualifierToken");

  bool parsed = true;
  int s0 = context.index;
  ParserAlternative a0(s0);

  vector<const ParserAlternative*> as1;
  parsed = false;
  {
    int s1 = context.index;
    ParserAlternative a1(s1);
    parsed = true;
    if (parsed)
    {
      bool f1 = true;
      int c1 = 0;
      while (f1)
      {
        const Rule* rule = Rule_NoSlashChar::parse(context);
        if ((f1 = rule != NULL))
        {
          a1.add(*rule, context.index);
          c1++;
          delete rule;
        }
      }
      parsed = true;
    }
    if (parsed)
    {
      as1.push_back(new ParserAlternative(a1));
    }
    context.index = s1;
  }

  const ParserAlternative* b = ParserAlternative::getBest(as1);

  if ((parsed = b != NULL))
  {
    a0.add(b->rules, b->end);
    context.index = b->end;
  }

  for (vector<const ParserAlternative*>::const_iterator a = as1.begin(); a != as1.end(); a++)
  {
    delete *a;
  }

  const Rule* rule = NULL;
  if (parsed)
  {
    rule = new Rule_QualifierToken(context.text.substr(a0.start, a0.end - a0.start), a0.rules);
  }
  else
  {
    context.index = s0;
  }

  context.pop("QualifierToken", parsed);

  return (Rule_QualifierToken*)rule;
}

/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
