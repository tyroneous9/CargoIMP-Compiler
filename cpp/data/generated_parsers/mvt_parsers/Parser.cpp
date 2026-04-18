/* -----------------------------------------------------------------------------
 * Parser.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
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
#include "Rule_MVTMessage.hpp"
#include "Rule_MessageHeader.hpp"
#include "Rule_FlightIdentificationLine.hpp"
#include "Rule_CarrierFlightNumber.hpp"
#include "Rule_Day.hpp"
#include "Rule_AircraftRegistration.hpp"
#include "Rule_AirportCode.hpp"
#include "Rule_EventLine.hpp"
#include "Rule_ActualMovementLine.hpp"
#include "Rule_ActualDepartureEstimatedArrivalLine.hpp"
#include "Rule_EstimatedArrivalOnlyLine.hpp"
#include "Rule_EventDepartureLine.hpp"
#include "Rule_SupplementLine.hpp"
#include "Rule_DelayLine.hpp"
#include "Rule_DelayCode.hpp"
#include "Rule_DelayReason.hpp"
#include "Rule_PaxLine.hpp"
#include "Rule_EventBlockLine.hpp"
#include "Rule_FieldStateLine.hpp"
#include "Rule_EdlatLine.hpp"
#include "Rule_SiLine.hpp"
#include "Rule_ActualDepartureDateTime.hpp"
#include "Rule_ActualArrivalDateTime.hpp"
#include "Rule_AdditionalActualDateTime.hpp"
#include "Rule_EstimatedArrivalTime.hpp"
#include "Rule_EstimatedArrivalAirport.hpp"
#include "Rule_DateTime6.hpp"
#include "Rule_Time4.hpp"
#include "Rule_LineChar.hpp"
#include "Rule_SP.hpp"
#include "Rule_EOL.hpp"
#include "Rule_Slant.hpp"
#include "Rule_Dot.hpp"
#include "Rule_Digit.hpp"
#include "Rule_Upper.hpp"
#include "Rule_AlphaNum.hpp"

typedef const Rule* (*pParser)(ParserContext&);

static map<string, pParser> buildParserMap(void)
{
  map<string, pParser> parsers;

  parsers["mvtmessage"] = (pParser)Rule_MVTMessage::parse;
  parsers["messageheader"] = (pParser)Rule_MessageHeader::parse;
  parsers["flightidentificationline"] = (pParser)Rule_FlightIdentificationLine::parse;
  parsers["carrierflightnumber"] = (pParser)Rule_CarrierFlightNumber::parse;
  parsers["day"] = (pParser)Rule_Day::parse;
  parsers["aircraftregistration"] = (pParser)Rule_AircraftRegistration::parse;
  parsers["airportcode"] = (pParser)Rule_AirportCode::parse;
  parsers["eventline"] = (pParser)Rule_EventLine::parse;
  parsers["actualmovementline"] = (pParser)Rule_ActualMovementLine::parse;
  parsers["actualdepartureestimatedarrivalline"] = (pParser)Rule_ActualDepartureEstimatedArrivalLine::parse;
  parsers["estimatedarrivalonlyline"] = (pParser)Rule_EstimatedArrivalOnlyLine::parse;
  parsers["eventdepartureline"] = (pParser)Rule_EventDepartureLine::parse;
  parsers["supplementline"] = (pParser)Rule_SupplementLine::parse;
  parsers["delayline"] = (pParser)Rule_DelayLine::parse;
  parsers["delaycode"] = (pParser)Rule_DelayCode::parse;
  parsers["delayreason"] = (pParser)Rule_DelayReason::parse;
  parsers["paxline"] = (pParser)Rule_PaxLine::parse;
  parsers["eventblockline"] = (pParser)Rule_EventBlockLine::parse;
  parsers["fieldstateline"] = (pParser)Rule_FieldStateLine::parse;
  parsers["edlatline"] = (pParser)Rule_EdlatLine::parse;
  parsers["siline"] = (pParser)Rule_SiLine::parse;
  parsers["actualdeparturedatetime"] = (pParser)Rule_ActualDepartureDateTime::parse;
  parsers["actualarrivaldatetime"] = (pParser)Rule_ActualArrivalDateTime::parse;
  parsers["additionalactualdatetime"] = (pParser)Rule_AdditionalActualDateTime::parse;
  parsers["estimatedarrivaltime"] = (pParser)Rule_EstimatedArrivalTime::parse;
  parsers["estimatedarrivalairport"] = (pParser)Rule_EstimatedArrivalAirport::parse;
  parsers["datetime6"] = (pParser)Rule_DateTime6::parse;
  parsers["time4"] = (pParser)Rule_Time4::parse;
  parsers["linechar"] = (pParser)Rule_LineChar::parse;
  parsers["sp"] = (pParser)Rule_SP::parse;
  parsers["eol"] = (pParser)Rule_EOL::parse;
  parsers["slant"] = (pParser)Rule_Slant::parse;
  parsers["dot"] = (pParser)Rule_Dot::parse;
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
