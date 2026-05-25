/* -----------------------------------------------------------------------------
 * Rule_ULDDetailText.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sun May 24 20:39:41 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <string>
using std::string;

#include <vector>
using std::vector;

#include "Rule_ULDDetailText.hpp"
#include "Visitor.hpp"
#include "ParserAlternative.hpp"
#include "ParserContext.hpp"

#include "Rule_LineChar.hpp"
#include "Rule_Hyphen.hpp"
#include "Rule_Dot.hpp"
#include "Rule_Digit.hpp"
#include "Terminal_NumericValue.hpp"
#include "Terminal_StringValue.hpp"
#include "Rule_Upper.hpp"

Rule_ULDDetailText::Rule_ULDDetailText(
  const string& spelling, 
  const vector<const Rule*>& rules) : Rule(spelling, rules)
{
}

Rule_ULDDetailText::Rule_ULDDetailText(const Rule_ULDDetailText& rule) : Rule(rule)
{
}

Rule_ULDDetailText& Rule_ULDDetailText::operator=(const Rule_ULDDetailText& rule)
{
  Rule::operator=(rule);
  return *this;
}

const Rule_ULDDetailText* Rule_ULDDetailText::clone() const
{
  return new Rule_ULDDetailText(this->spelling, this->rules);
}

void* Rule_ULDDetailText::accept(Visitor& visitor) const
{
  return visitor.visit(this);
}

const Rule_ULDDetailText* Rule_ULDDetailText::parse(ParserContext& context)
{
  context.push("ULDDetailText");

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
              const Rule* rule = Terminal_StringValue::parse(context, "W-");
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
              const Rule* rule = Rule_Digit::parse(context);
              if ((f2 = rule != NULL))
              {
                a2.add(*rule, context.index);
                c2++;
                delete rule;
              }
            }
            for (int i2 = 1; i2 < 7 && f2; i2++)
            {
              const Rule* rule = Rule_Digit::parse(context);
              if ((f2 = rule != NULL))
              {
                a2.add(*rule, context.index);
                c2++;
                delete rule;
              }
            }
            parsed = c2 >= 1;
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
                    const Rule* rule = Rule_Dot::parse(context);
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
                  bool f3 = true;
                  int c3 = 0;
                  for (int i3 = 0; i3 < 1 && f3; i3++)
                  {
                    const Rule* rule = Rule_Digit::parse(context);
                    if ((f3 = rule != NULL))
                    {
                      a3.add(*rule, context.index);
                      c3++;
                      delete rule;
                    }
                  }
                  for (int i3 = 1; i3 < 3 && f3; i3++)
                  {
                    const Rule* rule = Rule_Digit::parse(context);
                    if ((f3 = rule != NULL))
                    {
                      a3.add(*rule, context.index);
                      c3++;
                      delete rule;
                    }
                  }
                  parsed = c3 >= 1;
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
                    const Rule* rule = Terminal_NumericValue::parse(context, "%x20", "[\\x20]", 1);
                    if ((f3 = rule != NULL))
                    {
                      a3.add(*rule, context.index);
                      c3++;
                      delete rule;
                    }
                  }
                  while (f3)
                  {
                    const Rule* rule = Terminal_NumericValue::parse(context, "%x20", "[\\x20]", 1);
                    if ((f3 = rule != NULL))
                    {
                      a3.add(*rule, context.index);
                      c3++;
                      delete rule;
                    }
                  }
                  parsed = c3 >= 1;
                }
                if (parsed)
                {
                  bool f3 = true;
                  int c3 = 0;
                  for (int i3 = 0; i3 < 1 && f3; i3++)
                  {
                    const Rule* rule = Terminal_StringValue::parse(context, "C-");
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
                  bool f3 = true;
                  int c3 = 0;
                  for (int i3 = 0; i3 < 1 && f3; i3++)
                  {
                    unsigned int g3 = context.index;
                    vector<const ParserAlternative*> as4;
                    parsed = false;
                    {
                      int s4 = context.index;
                      ParserAlternative a4(s4);
                      parsed = true;
                      if (parsed)
                      {
                        bool f4 = true;
                        int c4 = 0;
                        for (int i4 = 0; i4 < 1 && f4; i4++)
                        {
                          const Rule* rule = Rule_Upper::parse(context);
                          if ((f4 = rule != NULL))
                          {
                            a4.add(*rule, context.index);
                            c4++;
                            delete rule;
                          }
                        }
                        parsed = c4 == 1;
                      }
                      if (parsed)
                      {
                        as4.push_back(new ParserAlternative(a4));
                      }
                      context.index = s4;
                    }
                    {
                      int s4 = context.index;
                      ParserAlternative a4(s4);
                      parsed = true;
                      if (parsed)
                      {
                        bool f4 = true;
                        int c4 = 0;
                        for (int i4 = 0; i4 < 1 && f4; i4++)
                        {
                          const Rule* rule = Rule_Digit::parse(context);
                          if ((f4 = rule != NULL))
                          {
                            a4.add(*rule, context.index);
                            c4++;
                            delete rule;
                          }
                        }
                        parsed = c4 == 1;
                      }
                      if (parsed)
                      {
                        as4.push_back(new ParserAlternative(a4));
                      }
                      context.index = s4;
                    }
                    {
                      int s4 = context.index;
                      ParserAlternative a4(s4);
                      parsed = true;
                      if (parsed)
                      {
                        bool f4 = true;
                        int c4 = 0;
                        for (int i4 = 0; i4 < 1 && f4; i4++)
                        {
                          const Rule* rule = Rule_Hyphen::parse(context);
                          if ((f4 = rule != NULL))
                          {
                            a4.add(*rule, context.index);
                            c4++;
                            delete rule;
                          }
                        }
                        parsed = c4 == 1;
                      }
                      if (parsed)
                      {
                        as4.push_back(new ParserAlternative(a4));
                      }
                      context.index = s4;
                    }

                    const ParserAlternative* b = ParserAlternative::getBest(as4);

                    if ((parsed = b != NULL))
                    {
                      a3.add(b->rules, b->end);
                      context.index = b->end;
                    }

                    for (vector<const ParserAlternative*>::const_iterator a = as4.begin(); a != as4.end(); a++)
                    {
                      delete *a;
                    }

                    f3 = context.index > g3;
                    if (parsed) c3++;
                  }
                  for (int i3 = 1; i3 < 4 && f3; i3++)
                  {
                    unsigned int g3 = context.index;
                    vector<const ParserAlternative*> as4;
                    parsed = false;
                    {
                      int s4 = context.index;
                      ParserAlternative a4(s4);
                      parsed = true;
                      if (parsed)
                      {
                        bool f4 = true;
                        int c4 = 0;
                        for (int i4 = 0; i4 < 1 && f4; i4++)
                        {
                          const Rule* rule = Rule_Upper::parse(context);
                          if ((f4 = rule != NULL))
                          {
                            a4.add(*rule, context.index);
                            c4++;
                            delete rule;
                          }
                        }
                        parsed = c4 == 1;
                      }
                      if (parsed)
                      {
                        as4.push_back(new ParserAlternative(a4));
                      }
                      context.index = s4;
                    }
                    {
                      int s4 = context.index;
                      ParserAlternative a4(s4);
                      parsed = true;
                      if (parsed)
                      {
                        bool f4 = true;
                        int c4 = 0;
                        for (int i4 = 0; i4 < 1 && f4; i4++)
                        {
                          const Rule* rule = Rule_Digit::parse(context);
                          if ((f4 = rule != NULL))
                          {
                            a4.add(*rule, context.index);
                            c4++;
                            delete rule;
                          }
                        }
                        parsed = c4 == 1;
                      }
                      if (parsed)
                      {
                        as4.push_back(new ParserAlternative(a4));
                      }
                      context.index = s4;
                    }
                    {
                      int s4 = context.index;
                      ParserAlternative a4(s4);
                      parsed = true;
                      if (parsed)
                      {
                        bool f4 = true;
                        int c4 = 0;
                        for (int i4 = 0; i4 < 1 && f4; i4++)
                        {
                          const Rule* rule = Rule_Hyphen::parse(context);
                          if ((f4 = rule != NULL))
                          {
                            a4.add(*rule, context.index);
                            c4++;
                            delete rule;
                          }
                        }
                        parsed = c4 == 1;
                      }
                      if (parsed)
                      {
                        as4.push_back(new ParserAlternative(a4));
                      }
                      context.index = s4;
                    }

                    const ParserAlternative* b = ParserAlternative::getBest(as4);

                    if ((parsed = b != NULL))
                    {
                      a3.add(b->rules, b->end);
                      context.index = b->end;
                    }

                    for (vector<const ParserAlternative*>::const_iterator a = as4.begin(); a != as4.end(); a++)
                    {
                      delete *a;
                    }

                    f3 = context.index > g3;
                    if (parsed) c3++;
                  }
                  parsed = c3 >= 1;
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
                    const Rule* rule = Terminal_NumericValue::parse(context, "%x20", "[\\x20]", 1);
                    if ((f3 = rule != NULL))
                    {
                      a3.add(*rule, context.index);
                      c3++;
                      delete rule;
                    }
                  }
                  while (f3)
                  {
                    const Rule* rule = Terminal_NumericValue::parse(context, "%x20", "[\\x20]", 1);
                    if ((f3 = rule != NULL))
                    {
                      a3.add(*rule, context.index);
                      c3++;
                      delete rule;
                    }
                  }
                  parsed = c3 >= 1;
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
      parsed = c1 == 1;
    }
    if (parsed)
    {
      as1.push_back(new ParserAlternative(a1));
    }
    context.index = s1;
  }
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
        const Rule* rule = Rule_LineChar::parse(context);
        if ((f1 = rule != NULL))
        {
          a1.add(*rule, context.index);
          c1++;
          delete rule;
        }
      }
      while (f1)
      {
        const Rule* rule = Rule_LineChar::parse(context);
        if ((f1 = rule != NULL))
        {
          a1.add(*rule, context.index);
          c1++;
          delete rule;
        }
      }
      parsed = c1 >= 1;
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
    rule = new Rule_ULDDetailText(context.text.substr(a0.start, a0.end - a0.start), a0.rules);
  }
  else
  {
    context.index = s0;
  }

  context.pop("ULDDetailText", parsed);

  return (Rule_ULDDetailText*)rule;
}

/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
