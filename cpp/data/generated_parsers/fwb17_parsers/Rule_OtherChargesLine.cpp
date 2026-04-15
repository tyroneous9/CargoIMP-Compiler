/* -----------------------------------------------------------------------------
 * Rule_OtherChargesLine.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:21:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <string>
using std::string;

#include <vector>
using std::vector;

#include "Rule_OtherChargesLine.hpp"
#include "Visitor.hpp"
#include "ParserAlternative.hpp"
#include "ParserContext.hpp"

#include "Rule_OtherChargesTagLine.hpp"
#include "Rule_OtherChargesContLine.hpp"

Rule_OtherChargesLine::Rule_OtherChargesLine(
  const string& spelling, 
  const vector<const Rule*>& rules) : Rule(spelling, rules)
{
}

Rule_OtherChargesLine::Rule_OtherChargesLine(const Rule_OtherChargesLine& rule) : Rule(rule)
{
}

Rule_OtherChargesLine& Rule_OtherChargesLine::operator=(const Rule_OtherChargesLine& rule)
{
  Rule::operator=(rule);
  return *this;
}

const Rule_OtherChargesLine* Rule_OtherChargesLine::clone() const
{
  return new Rule_OtherChargesLine(this->spelling, this->rules);
}

void* Rule_OtherChargesLine::accept(Visitor& visitor) const
{
  return visitor.visit(this);
}

const Rule_OtherChargesLine* Rule_OtherChargesLine::parse(ParserContext& context)
{
  context.push("OtherChargesLine");

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
      for (int i1 = 0; i1 < 1 && f1; i1++)
      {
        const Rule* rule = Rule_OtherChargesTagLine::parse(context);
        if ((f1 = rule != NULL))
        {
          a1.add(*rule, context.index);
          c1++;
          delete rule;
        }
      }
      parsed = c1 == 1;
    }
    if (parsed)
    {
      bool f1 = true;
      int c1 = 0;
      while (f1)
      {
        const Rule* rule = Rule_OtherChargesContLine::parse(context);
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
    rule = new Rule_OtherChargesLine(context.text.substr(a0.start, a0.end - a0.start), a0.rules);
  }
  else
  {
    context.index = s0;
  }

  context.pop("OtherChargesLine", parsed);

  return (Rule_OtherChargesLine*)rule;
}

/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
