/* -----------------------------------------------------------------------------
 * Rule_ScheduledDepartureDate.cpp
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

#include "Rule_ScheduledDepartureDate.hpp"
#include "Visitor.hpp"
#include "ParserAlternative.hpp"
#include "ParserContext.hpp"

#include "Rule_Month.hpp"
#include "Rule_Digit.hpp"

Rule_ScheduledDepartureDate::Rule_ScheduledDepartureDate(
  const string& spelling, 
  const vector<const Rule*>& rules) : Rule(spelling, rules)
{
}

Rule_ScheduledDepartureDate::Rule_ScheduledDepartureDate(const Rule_ScheduledDepartureDate& rule) : Rule(rule)
{
}

Rule_ScheduledDepartureDate& Rule_ScheduledDepartureDate::operator=(const Rule_ScheduledDepartureDate& rule)
{
  Rule::operator=(rule);
  return *this;
}

const Rule_ScheduledDepartureDate* Rule_ScheduledDepartureDate::clone() const
{
  return new Rule_ScheduledDepartureDate(this->spelling, this->rules);
}

void* Rule_ScheduledDepartureDate::accept(Visitor& visitor) const
{
  return visitor.visit(this);
}

const Rule_ScheduledDepartureDate* Rule_ScheduledDepartureDate::parse(ParserContext& context)
{
  context.push("ScheduledDepartureDate");

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
      for (int i1 = 0; i1 < 2 && f1; i1++)
      {
        const Rule* rule = Rule_Digit::parse(context);
        if ((f1 = rule != NULL))
        {
          a1.add(*rule, context.index);
          c1++;
          delete rule;
        }
      }
      parsed = c1 == 2;
    }
    if (parsed)
    {
      bool f1 = true;
      int c1 = 0;
      for (int i1 = 0; i1 < 1 && f1; i1++)
      {
        const Rule* rule = Rule_Month::parse(context);
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
    rule = new Rule_ScheduledDepartureDate(context.text.substr(a0.start, a0.end - a0.start), a0.rules);
  }
  else
  {
    context.index = s0;
  }

  context.pop("ScheduledDepartureDate", parsed);

  return (Rule_ScheduledDepartureDate*)rule;
}

/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
