/* -----------------------------------------------------------------------------
 * Rule_DescriptionBlock.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:36:00 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <string>
using std::string;

#include <vector>
using std::vector;

#include "Rule_DescriptionBlock.hpp"
#include "Visitor.hpp"
#include "ParserAlternative.hpp"
#include "ParserContext.hpp"

#include "Rule_DescriptionContLine.hpp"
#include "Rule_DescriptionTagLine.hpp"

Rule_DescriptionBlock::Rule_DescriptionBlock(
  const string& spelling, 
  const vector<const Rule*>& rules) : Rule(spelling, rules)
{
}

Rule_DescriptionBlock::Rule_DescriptionBlock(const Rule_DescriptionBlock& rule) : Rule(rule)
{
}

Rule_DescriptionBlock& Rule_DescriptionBlock::operator=(const Rule_DescriptionBlock& rule)
{
  Rule::operator=(rule);
  return *this;
}

const Rule_DescriptionBlock* Rule_DescriptionBlock::clone() const
{
  return new Rule_DescriptionBlock(this->spelling, this->rules);
}

void* Rule_DescriptionBlock::accept(Visitor& visitor) const
{
  return visitor.visit(this);
}

const Rule_DescriptionBlock* Rule_DescriptionBlock::parse(ParserContext& context)
{
  context.push("DescriptionBlock");

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
        const Rule* rule = Rule_DescriptionTagLine::parse(context);
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
        const Rule* rule = Rule_DescriptionContLine::parse(context);
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
    rule = new Rule_DescriptionBlock(context.text.substr(a0.start, a0.end - a0.start), a0.rules);
  }
  else
  {
    context.index = s0;
  }

  context.pop("DescriptionBlock", parsed);

  return (Rule_DescriptionBlock*)rule;
}

/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
