/* -----------------------------------------------------------------------------
 * Parser.cpp
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
#include "Rule_FFM8.hpp"
#include "Rule_MessageHeader.hpp"
#include "Rule_FlightIdentificationLine.hpp"
#include "Rule_ArrivalInformationLine.hpp"
#include "Rule_DirectArrivalLine.hpp"
#include "Rule_TransitArrivalLineNoNIL.hpp"
#include "Rule_TransitNILArrivalLine.hpp"
#include "Rule_TransitNILOnlyLine.hpp"
#include "Rule_DestinationOnlyLine.hpp"
#include "Rule_UldSection.hpp"
#include "Rule_HouseBillBlock.hpp"
#include "Rule_SupplementLine.hpp"
#include "Rule_ULDLine.hpp"
#include "Rule_HouseBillLine.hpp"
#include "Rule_OsiLine.hpp"
#include "Rule_OciLine.hpp"
#include "Rule_SciLine.hpp"
#include "Rule_CorLine.hpp"
#include "Rule_SlashQualifierLine.hpp"
#include "Rule_ContinuationLine.hpp"
#include "Rule_TrailerLine.hpp"
#include "Rule_MessagePageNumber.hpp"
#include "Rule_CarrierFlightNumber.hpp"
#include "Rule_DepartureAirportCode.hpp"
#include "Rule_ArrivalAirportCode.hpp"
#include "Rule_AircraftRegistration.hpp"
#include "Rule_AirportCode.hpp"
#include "Rule_HouseWaybillNumber.hpp"
#include "Rule_MasterAirwayBillNumber.hpp"
#include "Rule_AirlinePrefix.hpp"
#include "Rule_AWBSerialNumber.hpp"
#include "Rule_ScheduledDepartureDateTime.hpp"
#include "Rule_ScheduledDepartureDate.hpp"
#include "Rule_ScheduledDepartureTime.hpp"
#include "Rule_ScheduledArrivalDateTime.hpp"
#include "Rule_ScheduledArrivalDate.hpp"
#include "Rule_ScheduledArrivalTime.hpp"
#include "Rule_ScheduledOnwardDepartureDateTime.hpp"
#include "Rule_ScheduledOnwardDepartureDate.hpp"
#include "Rule_ScheduledOnwardDepartureTime.hpp"
#include "Rule_OriginAndDestination.hpp"
#include "Rule_ULDIdentifier.hpp"
#include "Rule_ULDDetailText.hpp"
#include "Rule_ShipmentSummary.hpp"
#include "Rule_SummaryType.hpp"
#include "Rule_PieceCount.hpp"
#include "Rule_TotalPieceCount.hpp"
#include "Rule_WeightUnit.hpp"
#include "Rule_WeightValue.hpp"
#include "Rule_VolumeUnit.hpp"
#include "Rule_VolumeAmount.hpp"
#include "Rule_Month.hpp"
#include "Rule_FreeText.hpp"
#include "Rule_ULDChar.hpp"
#include "Rule_SummaryChar.hpp"
#include "Rule_QualifierToken.hpp"
#include "Rule_NoSlashChar.hpp"
#include "Rule_LineChar.hpp"
#include "Rule_Slant.hpp"
#include "Rule_Hyphen.hpp"
#include "Rule_Dot.hpp"
#include "Rule_Digit.hpp"
#include "Rule_Upper.hpp"
#include "Rule_AlphaNum.hpp"
#include "Rule_EOL.hpp"

typedef const Rule* (*pParser)(ParserContext&);

static map<string, pParser> buildParserMap(void)
{
  map<string, pParser> parsers;

  parsers["ffm8"] = (pParser)Rule_FFM8::parse;
  parsers["messageheader"] = (pParser)Rule_MessageHeader::parse;
  parsers["flightidentificationline"] = (pParser)Rule_FlightIdentificationLine::parse;
  parsers["arrivalinformationline"] = (pParser)Rule_ArrivalInformationLine::parse;
  parsers["directarrivalline"] = (pParser)Rule_DirectArrivalLine::parse;
  parsers["transitarrivallinenonil"] = (pParser)Rule_TransitArrivalLineNoNIL::parse;
  parsers["transitnilarrivalline"] = (pParser)Rule_TransitNILArrivalLine::parse;
  parsers["transitnilonlyline"] = (pParser)Rule_TransitNILOnlyLine::parse;
  parsers["destinationonlyline"] = (pParser)Rule_DestinationOnlyLine::parse;
  parsers["uldsection"] = (pParser)Rule_UldSection::parse;
  parsers["housebillblock"] = (pParser)Rule_HouseBillBlock::parse;
  parsers["supplementline"] = (pParser)Rule_SupplementLine::parse;
  parsers["uldline"] = (pParser)Rule_ULDLine::parse;
  parsers["housebillline"] = (pParser)Rule_HouseBillLine::parse;
  parsers["osiline"] = (pParser)Rule_OsiLine::parse;
  parsers["ociline"] = (pParser)Rule_OciLine::parse;
  parsers["sciline"] = (pParser)Rule_SciLine::parse;
  parsers["corline"] = (pParser)Rule_CorLine::parse;
  parsers["slashqualifierline"] = (pParser)Rule_SlashQualifierLine::parse;
  parsers["continuationline"] = (pParser)Rule_ContinuationLine::parse;
  parsers["trailerline"] = (pParser)Rule_TrailerLine::parse;
  parsers["messagepagenumber"] = (pParser)Rule_MessagePageNumber::parse;
  parsers["carrierflightnumber"] = (pParser)Rule_CarrierFlightNumber::parse;
  parsers["departureairportcode"] = (pParser)Rule_DepartureAirportCode::parse;
  parsers["arrivalairportcode"] = (pParser)Rule_ArrivalAirportCode::parse;
  parsers["aircraftregistration"] = (pParser)Rule_AircraftRegistration::parse;
  parsers["airportcode"] = (pParser)Rule_AirportCode::parse;
  parsers["housewaybillnumber"] = (pParser)Rule_HouseWaybillNumber::parse;
  parsers["masterairwaybillnumber"] = (pParser)Rule_MasterAirwayBillNumber::parse;
  parsers["airlineprefix"] = (pParser)Rule_AirlinePrefix::parse;
  parsers["awbserialnumber"] = (pParser)Rule_AWBSerialNumber::parse;
  parsers["scheduleddeparturedatetime"] = (pParser)Rule_ScheduledDepartureDateTime::parse;
  parsers["scheduleddeparturedate"] = (pParser)Rule_ScheduledDepartureDate::parse;
  parsers["scheduleddeparturetime"] = (pParser)Rule_ScheduledDepartureTime::parse;
  parsers["scheduledarrivaldatetime"] = (pParser)Rule_ScheduledArrivalDateTime::parse;
  parsers["scheduledarrivaldate"] = (pParser)Rule_ScheduledArrivalDate::parse;
  parsers["scheduledarrivaltime"] = (pParser)Rule_ScheduledArrivalTime::parse;
  parsers["scheduledonwarddeparturedatetime"] = (pParser)Rule_ScheduledOnwardDepartureDateTime::parse;
  parsers["scheduledonwarddeparturedate"] = (pParser)Rule_ScheduledOnwardDepartureDate::parse;
  parsers["scheduledonwarddeparturetime"] = (pParser)Rule_ScheduledOnwardDepartureTime::parse;
  parsers["originanddestination"] = (pParser)Rule_OriginAndDestination::parse;
  parsers["uldidentifier"] = (pParser)Rule_ULDIdentifier::parse;
  parsers["ulddetailtext"] = (pParser)Rule_ULDDetailText::parse;
  parsers["shipmentsummary"] = (pParser)Rule_ShipmentSummary::parse;
  parsers["summarytype"] = (pParser)Rule_SummaryType::parse;
  parsers["piececount"] = (pParser)Rule_PieceCount::parse;
  parsers["totalpiececount"] = (pParser)Rule_TotalPieceCount::parse;
  parsers["weightunit"] = (pParser)Rule_WeightUnit::parse;
  parsers["weightvalue"] = (pParser)Rule_WeightValue::parse;
  parsers["volumeunit"] = (pParser)Rule_VolumeUnit::parse;
  parsers["volumeamount"] = (pParser)Rule_VolumeAmount::parse;
  parsers["month"] = (pParser)Rule_Month::parse;
  parsers["freetext"] = (pParser)Rule_FreeText::parse;
  parsers["uldchar"] = (pParser)Rule_ULDChar::parse;
  parsers["summarychar"] = (pParser)Rule_SummaryChar::parse;
  parsers["qualifiertoken"] = (pParser)Rule_QualifierToken::parse;
  parsers["noslashchar"] = (pParser)Rule_NoSlashChar::parse;
  parsers["linechar"] = (pParser)Rule_LineChar::parse;
  parsers["slant"] = (pParser)Rule_Slant::parse;
  parsers["hyphen"] = (pParser)Rule_Hyphen::parse;
  parsers["dot"] = (pParser)Rule_Dot::parse;
  parsers["digit"] = (pParser)Rule_Digit::parse;
  parsers["upper"] = (pParser)Rule_Upper::parse;
  parsers["alphanum"] = (pParser)Rule_AlphaNum::parse;
  parsers["eol"] = (pParser)Rule_EOL::parse;

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
