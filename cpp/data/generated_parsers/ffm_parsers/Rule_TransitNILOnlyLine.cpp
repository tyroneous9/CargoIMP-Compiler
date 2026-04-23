/* -----------------------------------------------------------------------------
 * Rule_TransitNILOnlyLine.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 18:15:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <string>
using std::string;

#include <vector>
using std::vector;

#include "Rule_TransitNILOnlyLine.hpp"
#include "Visitor.hpp"
#include "ParserAlternative.hpp"
#include "ParserContext.hpp"

#include "Rule_Slant.hpp"
#include "Rule_ArrivalAirportCode.hpp"
#include "Terminal_StringValue.hpp"

Rule_TransitNILOnlyLine::Rule_TransitNILOnlyLine(
  const string& spelling, 
  const vector<const Rule*>& rules) : Rule(spelling, rules)
{
}

Rule_TransitNILOnlyLine::Rule_TransitNILOnlyLine(const Rule_TransitNILOnlyLine& rule) : Rule(rule)
{
}

Rule_TransitNILOnlyLine& Rule_TransitNILOnlyLine::operator=(const Rule_TransitNILOnlyLine& rule)
{
  Rule::operator=(rule);
  return *this;
}

const Rule_TransitNILOnlyLine* Rule_TransitNILOnlyLine::clone() const
{
  return new Rule_TransitNILOnlyLine(this->spelling, this->rules);
}

void* Rule_TransitNILOnlyLine::accept(Visitor& visitor) const
{
  return visitor.visit(this);
}

const Rule_TransitNILOnlyLine* Rule_TransitNILOnlyLine::parse(ParserContext& context)
{
  context.push("TransitNILOnlyLine");

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
        const Rule* rule = Rule_ArrivalAirportCode::parse(context);
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
      for (int i1 = 0; i1 < 1 && f1; i1++)
      {
        const Rule* rule = Rule_Slant::parse(context);
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
      for (int i1 = 0; i1 < 1 && f1; i1++)
      {
        const Rule* rule = Terminal_StringValue::parse(context, "NIL");
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
    rule = new Rule_TransitNILOnlyLine(context.text.substr(a0.start, a0.end - a0.start), a0.rules);
  }
  else
  {
    context.index = s0;
  }

  context.pop("TransitNILOnlyLine", parsed);

  return (Rule_TransitNILOnlyLine*)rule;
}

/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
