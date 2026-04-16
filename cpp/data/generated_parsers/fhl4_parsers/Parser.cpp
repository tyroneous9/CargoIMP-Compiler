/* -----------------------------------------------------------------------------
 * Parser.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 15 00:18:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <string>
using std::string;

#include <vector>
using std::vector;

#include <map>
using std::map;

#include <iostream>
using std::istream;

#include <algorithm>
using std::transform;

#include "Parser.hpp"

#include "ParserContext.hpp"
#include "ParserException.hpp"

#include "Rule.hpp"
#include "Rule_FHL4.hpp"
#include "Rule_HouseBillGroup.hpp"
#include "Rule_MessageHeader.hpp"
#include "Rule_MasterBillLine.hpp"
#include "Rule_MasterAirwayBillNumber.hpp"
#include "Rule_AirlinePrefix.hpp"
#include "Rule_AWBSerialNumber.hpp"
#include "Rule_MasterOriginAndDestination.hpp"
#include "Rule_AirportCode.hpp"
#include "Rule_MasterBillSummary.hpp"
#include "Rule_MasterPieceCount.hpp"
#include "Rule_MasterWeightUnit.hpp"
#include "Rule_MasterWeight.hpp"
#include "Rule_HouseBillLine.hpp"
#include "Rule_HouseOriginAndDestination.hpp"
#include "Rule_HouseWaybillNumber.hpp"
#include "Rule_HousePieceCount.hpp"
#include "Rule_HouseWeightUnit.hpp"
#include "Rule_HouseWeight.hpp"
#include "Rule_DescriptionBlock.hpp"
#include "Rule_DescriptionTagLine.hpp"
#include "Rule_DescriptionContLine.hpp"
#include "Rule_HtsBlock.hpp"
#include "Rule_HtsLine.hpp"
#include "Rule_HtsContLine.hpp"
#include "Rule_OciBlock.hpp"
#include "Rule_OciLine.hpp"
#include "Rule_OciContLine.hpp"
#include "Rule_ShipperBlock.hpp"
#include "Rule_ShipperTagLine.hpp"
#include "Rule_ShipperContLine.hpp"
#include "Rule_ConsigneeBlock.hpp"
#include "Rule_ConsigneeTagLine.hpp"
#include "Rule_ConsigneeContLine.hpp"
#include "Rule_CvdLine.hpp"
#include "Rule_LineChar.hpp"
#include "Rule_EOL.hpp"
#include "Rule_Slant.hpp"
#include "Rule_Hyphen.hpp"
#include "Rule_Digit.hpp"
#include "Rule_Upper.hpp"
#include "Rule_AlphaNum.hpp"

typedef const Rule* (*pParser)(ParserContext&);

static map<string, pParser> buildParserMap(void)
{
  map<string, pParser> parsers;

  parsers["fhl4"] = (pParser)Rule_FHL4::parse;
  parsers["housebillgroup"] = (pParser)Rule_HouseBillGroup::parse;
  parsers["messageheader"] = (pParser)Rule_MessageHeader::parse;
  parsers["masterbillline"] = (pParser)Rule_MasterBillLine::parse;
  parsers["masterairwaybillnumber"] = (pParser)Rule_MasterAirwayBillNumber::parse;
  parsers["airlineprefix"] = (pParser)Rule_AirlinePrefix::parse;
  parsers["awbserialnumber"] = (pParser)Rule_AWBSerialNumber::parse;
  parsers["masteroriginanddestination"] = (pParser)Rule_MasterOriginAndDestination::parse;
  parsers["airportcode"] = (pParser)Rule_AirportCode::parse;
  parsers["masterbillsummary"] = (pParser)Rule_MasterBillSummary::parse;
  parsers["masterpiececount"] = (pParser)Rule_MasterPieceCount::parse;
  parsers["masterweightunit"] = (pParser)Rule_MasterWeightUnit::parse;
  parsers["masterweight"] = (pParser)Rule_MasterWeight::parse;
  parsers["housebillline"] = (pParser)Rule_HouseBillLine::parse;
  parsers["houseoriginanddestination"] = (pParser)Rule_HouseOriginAndDestination::parse;
  parsers["housewaybillnumber"] = (pParser)Rule_HouseWaybillNumber::parse;
  parsers["housepiececount"] = (pParser)Rule_HousePieceCount::parse;
  parsers["houseweightunit"] = (pParser)Rule_HouseWeightUnit::parse;
  parsers["houseweight"] = (pParser)Rule_HouseWeight::parse;
  parsers["descriptionblock"] = (pParser)Rule_DescriptionBlock::parse;
  parsers["descriptiontagline"] = (pParser)Rule_DescriptionTagLine::parse;
  parsers["descriptioncontline"] = (pParser)Rule_DescriptionContLine::parse;
  parsers["htsblock"] = (pParser)Rule_HtsBlock::parse;
  parsers["htsline"] = (pParser)Rule_HtsLine::parse;
  parsers["htscontline"] = (pParser)Rule_HtsContLine::parse;
  parsers["ociblock"] = (pParser)Rule_OciBlock::parse;
  parsers["ociline"] = (pParser)Rule_OciLine::parse;
  parsers["ocicontline"] = (pParser)Rule_OciContLine::parse;
  parsers["shipperblock"] = (pParser)Rule_ShipperBlock::parse;
  parsers["shippertagline"] = (pParser)Rule_ShipperTagLine::parse;
  parsers["shippercontline"] = (pParser)Rule_ShipperContLine::parse;
  parsers["consigneeblock"] = (pParser)Rule_ConsigneeBlock::parse;
  parsers["consigneetagline"] = (pParser)Rule_ConsigneeTagLine::parse;
  parsers["consigneecontline"] = (pParser)Rule_ConsigneeContLine::parse;
  parsers["cvdline"] = (pParser)Rule_CvdLine::parse;
  parsers["linechar"] = (pParser)Rule_LineChar::parse;
  parsers["eol"] = (pParser)Rule_EOL::parse;
  parsers["slant"] = (pParser)Rule_Slant::parse;
  parsers["hyphen"] = (pParser)Rule_Hyphen::parse;
  parsers["digit"] = (pParser)Rule_Digit::parse;
  parsers["upper"] = (pParser)Rule_Upper::parse;
  parsers["alphanum"] = (pParser)Rule_AlphaNum::parse;

  return parsers;
}

static map<string, pParser> parsers = buildParserMap();

const Rule* Parser::parse(const string& rulename, const string& text)
{
  return parse(rulename, text, false);
}

const Rule* Parser::parse(const string& rulename, istream& in)
{
  return parse(rulename, in, false);
}

const Rule* Parser::parse(const string& rulename, const string& text, bool trace)
{
  string lcRulename(rulename);
  transform(lcRulename.begin(), lcRulename.end(), lcRulename.begin(), tolower);

  ParserContext context(text, trace);

  const Rule* rule = NULL;

  pParser parser = parsers[lcRulename];

  if (parser != NULL)
  {
    rule = parser(context);
  }
  else
  {
    throw ParserException(
      string("unknown rule \"") + rulename + "\"",
      context.text,
      context.getErrorIndex(),
      context.getErrorStack());
  }

  if (rule == NULL)
  {
    throw ParserException(
      string("rule \"") + context.getErrorStack().back() + "\" failed",
      context.text,
      context.getErrorIndex(),
      context.getErrorStack());
  }

  if (context.text.length() > context.index)
  {
    ParserException primaryError(
      "extra data found",
      context.text,
      context.index,
      vector<string>());

    if (context.getErrorIndex() > context.index)
    {
      ParserException secondaryError(
        "rule \"" + context.getErrorStack().back() + "\" failed",
        context.text,
        context.getErrorIndex(),
        context.getErrorStack());

      primaryError.setCause(secondaryError);
    }

    throw primaryError;
  }

  return rule;
}

const Rule* Parser::parse(const string& rulename, istream& in, bool trace)
{
  string out;
  int ch;

  while ((ch = in.get()) != EOF)
    out += ch;

  return parse(rulename, out, trace);
}

/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
