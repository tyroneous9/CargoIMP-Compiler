/* -----------------------------------------------------------------------------
 * Rule_FFM8.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Thu May 21 16:34:36 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <string>
using std::string;

#include <vector>
using std::vector;

#include "Rule_FFM8.hpp"
#include "Visitor.hpp"
#include "ParserAlternative.hpp"
#include "ParserContext.hpp"

#include "Rule_UldSection.hpp"
#include "Rule_MessageHeader.hpp"
#include "Rule_FlightIdentificationLine.hpp"
#include "Rule_TrailerLine.hpp"
#include "Rule_ArrivalInformationLine.hpp"
#include "Rule_EOL.hpp"

Rule_FFM8::Rule_FFM8(
  const string& spelling, 
  const vector<const Rule*>& rules) : Rule(spelling, rules)
{
}

Rule_FFM8::Rule_FFM8(const Rule_FFM8& rule) : Rule(rule)
{
}

Rule_FFM8& Rule_FFM8::operator=(const Rule_FFM8& rule)
{
  Rule::operator=(rule);
  return *this;
}

const Rule_FFM8* Rule_FFM8::clone() const
{
  return new Rule_FFM8(this->spelling, this->rules);
}

void* Rule_FFM8::accept(Visitor& visitor) const
{
  return visitor.visit(this);
}

const Rule_FFM8* Rule_FFM8::parse(ParserContext& context)
{
  context.push("FFM8");

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
        const Rule* rule = Rule_MessageHeader::parse(context);
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
        const Rule* rule = Rule_EOL::parse(context);
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
        const Rule* rule = Rule_FlightIdentificationLine::parse(context);
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
        const Rule* rule = Rule_EOL::parse(context);
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
        unsigned int g1 = context.index;
        vector<const ParserAlternative*> as2;
        parsed = false;
        {
          int s2 = context.index;
          ParserAlternative a2(s2);
          parsed = true;
          if (parsed)
          {
            bool f2 = true;
            int c2 = 0;
            for (int i2 = 0; i2 < 1 && f2; i2++)
            {
              const Rule* rule = Rule_ArrivalInformationLine::parse(context);
              if ((f2 = rule != NULL))
              {
                a2.add(*rule, context.index);
                c2++;
                delete rule;
              }
            }
            parsed = c2 == 1;
          }
          if (parsed)
          {
            bool f2 = true;
            int c2 = 0;
            for (int i2 = 0; i2 < 1 && f2; i2++)
            {
              const Rule* rule = Rule_EOL::parse(context);
              if ((f2 = rule != NULL))
              {
                a2.add(*rule, context.index);
                c2++;
                delete rule;
              }
            }
            parsed = c2 == 1;
          }
          if (parsed)
          {
            as2.push_back(new ParserAlternative(a2));
          }
          context.index = s2;
        }
        {
          int s2 = context.index;
          ParserAlternative a2(s2);
          parsed = true;
          if (parsed)
          {
            bool f2 = true;
            int c2 = 0;
            for (int i2 = 0; i2 < 1 && f2; i2++)
            {
              const Rule* rule = Rule_UldSection::parse(context);
              if ((f2 = rule != NULL))
              {
                a2.add(*rule, context.index);
                c2++;
                delete rule;
              }
            }
            parsed = c2 == 1;
          }
          if (parsed)
          {
            as2.push_back(new ParserAlternative(a2));
          }
          context.index = s2;
        }

        const ParserAlternative* b = ParserAlternative::getBest(as2);

        if ((parsed = b != NULL))
        {
          a1.add(b->rules, b->end);
          context.index = b->end;
        }

        for (vector<const ParserAlternative*>::const_iterator a = as2.begin(); a != as2.end(); a++)
        {
          delete *a;
        }

        f1 = context.index > g1;
        if (parsed) c1++;
      }
      while (f1)
      {
        unsigned int g1 = context.index;
        vector<const ParserAlternative*> as2;
        parsed = false;
        {
          int s2 = context.index;
          ParserAlternative a2(s2);
          parsed = true;
          if (parsed)
          {
            bool f2 = true;
            int c2 = 0;
            for (int i2 = 0; i2 < 1 && f2; i2++)
            {
              const Rule* rule = Rule_ArrivalInformationLine::parse(context);
              if ((f2 = rule != NULL))
              {
                a2.add(*rule, context.index);
                c2++;
                delete rule;
              }
            }
            parsed = c2 == 1;
          }
          if (parsed)
          {
            bool f2 = true;
            int c2 = 0;
            for (int i2 = 0; i2 < 1 && f2; i2++)
            {
              const Rule* rule = Rule_EOL::parse(context);
              if ((f2 = rule != NULL))
              {
                a2.add(*rule, context.index);
                c2++;
                delete rule;
              }
            }
            parsed = c2 == 1;
          }
          if (parsed)
          {
            as2.push_back(new ParserAlternative(a2));
          }
          context.index = s2;
        }
        {
          int s2 = context.index;
          ParserAlternative a2(s2);
          parsed = true;
          if (parsed)
          {
            bool f2 = true;
            int c2 = 0;
            for (int i2 = 0; i2 < 1 && f2; i2++)
            {
              const Rule* rule = Rule_UldSection::parse(context);
              if ((f2 = rule != NULL))
              {
                a2.add(*rule, context.index);
                c2++;
                delete rule;
              }
            }
            parsed = c2 == 1;
          }
          if (parsed)
          {
            as2.push_back(new ParserAlternative(a2));
          }
          context.index = s2;
        }

        const ParserAlternative* b = ParserAlternative::getBest(as2);

        if ((parsed = b != NULL))
        {
          a1.add(b->rules, b->end);
          context.index = b->end;
        }

        for (vector<const ParserAlternative*>::const_iterator a = as2.begin(); a != as2.end(); a++)
        {
          delete *a;
        }

        f1 = context.index > g1;
        if (parsed) c1++;
      }
      parsed = c1 >= 1;
    }
    if (parsed)
    {
      bool f1 = true;
      int c1 = 0;
      for (int i1 = 0; i1 < 1 && f1; i1++)
      {
        unsigned int g1 = context.index;
        vector<const ParserAlternative*> as2;
        parsed = false;
        {
          int s2 = context.index;
          ParserAlternative a2(s2);
          parsed = true;
          if (parsed)
          {
            bool f2 = true;
            int c2 = 0;
            for (int i2 = 0; i2 < 1 && f2; i2++)
            {
              const Rule* rule = Rule_TrailerLine::parse(context);
              if ((f2 = rule != NULL))
              {
                a2.add(*rule, context.index);
                c2++;
                delete rule;
              }
            }
            parsed = c2 == 1;
          }
          if (parsed)
          {
            bool f2 = true;
            int c2 = 0;
            for (int i2 = 0; i2 < 1 && f2; i2++)
            {
              unsigned int g2 = context.index;
              vector<const ParserAlternative*> as3;
              parsed = false;
              {
                int s3 = context.index;
                ParserAlternative a3(s3);
                parsed = true;
                if (parsed)
                {
                  bool f3 = true;
                  int c3 = 0;
                  for (int i3 = 0; i3 < 1 && f3; i3++)
                  {
                    const Rule* rule = Rule_EOL::parse(context);
                    if ((f3 = rule != NULL))
                    {
                      a3.add(*rule, context.index);
                      c3++;
                      delete rule;
                    }
                  }
                  parsed = c3 == 1;
                }
                if (parsed)
                {
                  as3.push_back(new ParserAlternative(a3));
                }
                context.index = s3;
              }

              const ParserAlternative* b = ParserAlternative::getBest(as3);

              if ((parsed = b != NULL))
              {
                a2.add(b->rules, b->end);
                context.index = b->end;
              }

              for (vector<const ParserAlternative*>::const_iterator a = as3.begin(); a != as3.end(); a++)
              {
                delete *a;
              }

              f2 = context.index > g2;
              if (parsed) c2++;
            }
            parsed = true;
          }
          if (parsed)
          {
            as2.push_back(new ParserAlternative(a2));
          }
          context.index = s2;
        }

        const ParserAlternative* b = ParserAlternative::getBest(as2);

        if ((parsed = b != NULL))
        {
          a1.add(b->rules, b->end);
          context.index = b->end;
        }

        for (vector<const ParserAlternative*>::const_iterator a = as2.begin(); a != as2.end(); a++)
        {
          delete *a;
        }

        f1 = context.index > g1;
        if (parsed) c1++;
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
    rule = new Rule_FFM8(context.text.substr(a0.start, a0.end - a0.start), a0.rules);
  }
  else
  {
    context.index = s0;
  }

  context.pop("FFM8", parsed);

  return (Rule_FFM8*)rule;
}

/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
