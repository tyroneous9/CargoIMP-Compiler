/* -----------------------------------------------------------------------------
 * Parser.cpp
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
#include "Rule_FWB17.hpp"
#include "Rule_MessageHeader.hpp"
#include "Rule_MasterAirwayBillLine.hpp"
#include "Rule_MasterAirwayBillNumber.hpp"
#include "Rule_AirlinePrefix.hpp"
#include "Rule_AWBSerialNumber.hpp"
#include "Rule_OriginAndDestination.hpp"
#include "Rule_AirportCode.hpp"
#include "Rule_TotalConsignmentSummary.hpp"
#include "Rule_TotalPieceCount.hpp"
#include "Rule_WeightUnit.hpp"
#include "Rule_TotalWeight.hpp"
#include "Rule_VolumeUnit.hpp"
#include "Rule_VolumeAmount.hpp"
#include "Rule_FlightBookingsLine.hpp"
#include "Rule_RoutingLine.hpp"
#include "Rule_ShipperBlock.hpp"
#include "Rule_ShipperSubLine.hpp"
#include "Rule_ShipperNameLine.hpp"
#include "Rule_ShipperAddressLine.hpp"
#include "Rule_ShipperLocationLine.hpp"
#include "Rule_ShipperContLine.hpp"
#include "Rule_ConsigneeBlock.hpp"
#include "Rule_ConsigneeSubLine.hpp"
#include "Rule_ConsigneeNameLine.hpp"
#include "Rule_ConsigneeAddressLine.hpp"
#include "Rule_ConsigneeLocationLine.hpp"
#include "Rule_ConsigneeContLine.hpp"
#include "Rule_AgentLine.hpp"
#include "Rule_AgentTagLine.hpp"
#include "Rule_AgentContLine.hpp"
#include "Rule_AccountingLine.hpp"
#include "Rule_AccountingTagLine.hpp"
#include "Rule_AccountingContLine.hpp"
#include "Rule_CvdLine.hpp"
#include "Rule_RatingLine.hpp"
#include "Rule_RatingTagLine.hpp"
#include "Rule_RatingContLine.hpp"
#include "Rule_OtherChargesLine.hpp"
#include "Rule_OtherChargesTagLine.hpp"
#include "Rule_OtherChargesContLine.hpp"
#include "Rule_PrepaidLine.hpp"
#include "Rule_PrepaidTagLine.hpp"
#include "Rule_PrepaidContLine.hpp"
#include "Rule_CertificationLine.hpp"
#include "Rule_IssuanceLine.hpp"
#include "Rule_SupplementalLine.hpp"
#include "Rule_OsiBlock.hpp"
#include "Rule_OsiLine.hpp"
#include "Rule_OciBlock.hpp"
#include "Rule_OciLine.hpp"
#include "Rule_ContinuationLine.hpp"
#include "Rule_RefLine.hpp"
#include "Rule_SphLine.hpp"
#include "Rule_SsrLine.hpp"
#include "Rule_SsrTagLine.hpp"
#include "Rule_SsrContLine.hpp"
#include "Rule_NotifyBlock.hpp"
#include "Rule_NotifySubLine.hpp"
#include "Rule_NotifyNameLine.hpp"
#include "Rule_NotifyAddressLine.hpp"
#include "Rule_NotifyLocationLine.hpp"
#include "Rule_NotifyContLine.hpp"
#include "Rule_ArdLine.hpp"
#include "Rule_SriLine.hpp"
#include "Rule_LineChar.hpp"
#include "Rule_EOL.hpp"
#include "Rule_Slant.hpp"
#include "Rule_Hyphen.hpp"
#include "Rule_Digit.hpp"
#include "Rule_Upper.hpp"

typedef const Rule* (*pParser)(ParserContext&);

static map<string, pParser> buildParserMap(void)
{
  map<string, pParser> parsers;

  parsers["fwb17"] = (pParser)Rule_FWB17::parse;
  parsers["messageheader"] = (pParser)Rule_MessageHeader::parse;
  parsers["masterairwaybillline"] = (pParser)Rule_MasterAirwayBillLine::parse;
  parsers["masterairwaybillnumber"] = (pParser)Rule_MasterAirwayBillNumber::parse;
  parsers["airlineprefix"] = (pParser)Rule_AirlinePrefix::parse;
  parsers["awbserialnumber"] = (pParser)Rule_AWBSerialNumber::parse;
  parsers["originanddestination"] = (pParser)Rule_OriginAndDestination::parse;
  parsers["airportcode"] = (pParser)Rule_AirportCode::parse;
  parsers["totalconsignmentsummary"] = (pParser)Rule_TotalConsignmentSummary::parse;
  parsers["totalpiececount"] = (pParser)Rule_TotalPieceCount::parse;
  parsers["weightunit"] = (pParser)Rule_WeightUnit::parse;
  parsers["totalweight"] = (pParser)Rule_TotalWeight::parse;
  parsers["volumeunit"] = (pParser)Rule_VolumeUnit::parse;
  parsers["volumeamount"] = (pParser)Rule_VolumeAmount::parse;
  parsers["flightbookingsline"] = (pParser)Rule_FlightBookingsLine::parse;
  parsers["routingline"] = (pParser)Rule_RoutingLine::parse;
  parsers["shipperblock"] = (pParser)Rule_ShipperBlock::parse;
  parsers["shippersubline"] = (pParser)Rule_ShipperSubLine::parse;
  parsers["shippernameline"] = (pParser)Rule_ShipperNameLine::parse;
  parsers["shipperaddressline"] = (pParser)Rule_ShipperAddressLine::parse;
  parsers["shipperlocationline"] = (pParser)Rule_ShipperLocationLine::parse;
  parsers["shippercontline"] = (pParser)Rule_ShipperContLine::parse;
  parsers["consigneeblock"] = (pParser)Rule_ConsigneeBlock::parse;
  parsers["consigneesubline"] = (pParser)Rule_ConsigneeSubLine::parse;
  parsers["consigneenameline"] = (pParser)Rule_ConsigneeNameLine::parse;
  parsers["consigneeaddressline"] = (pParser)Rule_ConsigneeAddressLine::parse;
  parsers["consigneelocationline"] = (pParser)Rule_ConsigneeLocationLine::parse;
  parsers["consigneecontline"] = (pParser)Rule_ConsigneeContLine::parse;
  parsers["agentline"] = (pParser)Rule_AgentLine::parse;
  parsers["agenttagline"] = (pParser)Rule_AgentTagLine::parse;
  parsers["agentcontline"] = (pParser)Rule_AgentContLine::parse;
  parsers["accountingline"] = (pParser)Rule_AccountingLine::parse;
  parsers["accountingtagline"] = (pParser)Rule_AccountingTagLine::parse;
  parsers["accountingcontline"] = (pParser)Rule_AccountingContLine::parse;
  parsers["cvdline"] = (pParser)Rule_CvdLine::parse;
  parsers["ratingline"] = (pParser)Rule_RatingLine::parse;
  parsers["ratingtagline"] = (pParser)Rule_RatingTagLine::parse;
  parsers["ratingcontline"] = (pParser)Rule_RatingContLine::parse;
  parsers["otherchargesline"] = (pParser)Rule_OtherChargesLine::parse;
  parsers["otherchargestagline"] = (pParser)Rule_OtherChargesTagLine::parse;
  parsers["otherchargescontline"] = (pParser)Rule_OtherChargesContLine::parse;
  parsers["prepaidline"] = (pParser)Rule_PrepaidLine::parse;
  parsers["prepaidtagline"] = (pParser)Rule_PrepaidTagLine::parse;
  parsers["prepaidcontline"] = (pParser)Rule_PrepaidContLine::parse;
  parsers["certificationline"] = (pParser)Rule_CertificationLine::parse;
  parsers["issuanceline"] = (pParser)Rule_IssuanceLine::parse;
  parsers["supplementalline"] = (pParser)Rule_SupplementalLine::parse;
  parsers["osiblock"] = (pParser)Rule_OsiBlock::parse;
  parsers["osiline"] = (pParser)Rule_OsiLine::parse;
  parsers["ociblock"] = (pParser)Rule_OciBlock::parse;
  parsers["ociline"] = (pParser)Rule_OciLine::parse;
  parsers["continuationline"] = (pParser)Rule_ContinuationLine::parse;
  parsers["refline"] = (pParser)Rule_RefLine::parse;
  parsers["sphline"] = (pParser)Rule_SphLine::parse;
  parsers["ssrline"] = (pParser)Rule_SsrLine::parse;
  parsers["ssrtagline"] = (pParser)Rule_SsrTagLine::parse;
  parsers["ssrcontline"] = (pParser)Rule_SsrContLine::parse;
  parsers["notifyblock"] = (pParser)Rule_NotifyBlock::parse;
  parsers["notifysubline"] = (pParser)Rule_NotifySubLine::parse;
  parsers["notifynameline"] = (pParser)Rule_NotifyNameLine::parse;
  parsers["notifyaddressline"] = (pParser)Rule_NotifyAddressLine::parse;
  parsers["notifylocationline"] = (pParser)Rule_NotifyLocationLine::parse;
  parsers["notifycontline"] = (pParser)Rule_NotifyContLine::parse;
  parsers["ardline"] = (pParser)Rule_ArdLine::parse;
  parsers["sriline"] = (pParser)Rule_SriLine::parse;
  parsers["linechar"] = (pParser)Rule_LineChar::parse;
  parsers["eol"] = (pParser)Rule_EOL::parse;
  parsers["slant"] = (pParser)Rule_Slant::parse;
  parsers["hyphen"] = (pParser)Rule_Hyphen::parse;
  parsers["digit"] = (pParser)Rule_Digit::parse;
  parsers["upper"] = (pParser)Rule_Upper::parse;

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
