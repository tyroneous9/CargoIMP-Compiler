#include <cstddef>
#include <iostream>
#include <string>
#include <vector>

using std::cout;
using std::endl;
using std::string;
using std::vector;

#include "mvt_json_extractor.hpp"

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
#include "Terminal_StringValue.hpp"
#include "Terminal_NumericValue.hpp"

void* MvtJsonExtractor::visit(const Rule_MVTMessage* rule)
{
  visitRules(rule->rules);
  printJson();
  return NULL;
}

void* MvtJsonExtractor::visit(const Rule_MessageHeader* rule)
{
  messageHeader = rule->spelling;
  return NULL;
}

void* MvtJsonExtractor::visit(const Rule_FlightIdentificationLine* rule)
{
  flightIdentification = parseFlightIdentificationLine(rule->spelling);
  return NULL;
}

void* MvtJsonExtractor::visit(const Rule_EventLine* rule)
{
  return visitRules(rule->rules);
}

void* MvtJsonExtractor::visit(const Rule_ActualMovementLine* rule)
{
  event = parseActualMovementLine(rule->spelling);
  return NULL;
}

void* MvtJsonExtractor::visit(const Rule_ActualDepartureEstimatedArrivalLine* rule)
{
  event = parseActualDepartureEstimatedArrivalLine(rule->spelling);
  return NULL;
}

void* MvtJsonExtractor::visit(const Rule_EstimatedArrivalOnlyLine* rule)
{
  event = parseEstimatedArrivalOnlyLine(rule->spelling);
  return NULL;
}

void* MvtJsonExtractor::visit(const Rule_EventDepartureLine* rule)
{
  event = parseEventDepartureLine(rule->spelling);
  return NULL;
}

void* MvtJsonExtractor::visit(const Rule_SupplementLine* rule)
{
  return visitRules(rule->rules);
}

void* MvtJsonExtractor::visit(const Rule_DelayLine* rule)
{
  delayLines.push_back(parseDelayLine(rule->spelling));
  return NULL;
}

void* MvtJsonExtractor::visit(const Rule_PaxLine* rule)
{
  paxLines.push_back(parsePaxLine(rule->spelling));
  return NULL;
}

void* MvtJsonExtractor::visit(const Rule_EventBlockLine* rule)
{
  eventBlockLines.push_back(parseEventBlockLine(rule->spelling));
  return NULL;
}

void* MvtJsonExtractor::visit(const Rule_FieldStateLine* rule)
{
  fieldStateLines.push_back(parseFieldStateLine(rule->spelling));
  return NULL;
}

void* MvtJsonExtractor::visit(const Rule_EdlatLine* rule)
{
  edlatLines.push_back(parseEdlatLine(rule->spelling));
  return NULL;
}

void* MvtJsonExtractor::visit(const Rule_SiLine* rule)
{
  siLines.push_back(rule->spelling);
  return NULL;
}

void* MvtJsonExtractor::visit(const Rule_CarrierFlightNumber* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_Day* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_AircraftRegistration* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_AirportCode* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_DelayCode* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_DelayReason* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_ActualDepartureDateTime* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_ActualArrivalDateTime* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_AdditionalActualDateTime* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_EstimatedArrivalTime* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_EstimatedArrivalAirport* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_DateTime6* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_Time4* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_LineChar* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_SP* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_EOL* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_Slant* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_Dot* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_Digit* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_Upper* rule) { (void)rule; return NULL; }
void* MvtJsonExtractor::visit(const Rule_AlphaNum* rule) { (void)rule; return NULL; }

void* MvtJsonExtractor::visit(const Terminal_StringValue* value)
{
  (void)value;
  return NULL;
}

void* MvtJsonExtractor::visit(const Terminal_NumericValue* value)
{
  (void)value;
  return NULL;
}

void* MvtJsonExtractor::visitRules(const vector<const Rule*>& rules)
{
  for (vector<const Rule*>::const_iterator it = rules.begin(); it != rules.end(); ++it)
    (*it)->accept(*this);

  return NULL;
}

string MvtJsonExtractor::escapeJson(const string& input) const
{
  string out;
  out.reserve(input.size());

  for (string::const_iterator it = input.begin(); it != input.end(); ++it)
  {
    const char c = *it;
    if (c == '\\') out += "\\\\";
    else if (c == '"') out += "\\\"";
    else if (c == '\n') out += "\\n";
    else if (c == '\r') out += "\\r";
    else if (c == '\t') out += "\\t";
    else out += c;
  }

  return out;
}

vector<string> MvtJsonExtractor::split(const string& input, char delimiter) const
{
  vector<string> parts;
  string current;

  for (string::const_iterator it = input.begin(); it != input.end(); ++it)
  {
    if (*it == delimiter)
    {
      parts.push_back(current);
      current.clear();
    }
    else
    {
      current += *it;
    }
  }

  parts.push_back(current);
  return parts;
}

MvtFlightIdentificationData MvtJsonExtractor::parseFlightIdentificationLine(const string& line) const
{
  MvtFlightIdentificationData data;
  data.rawLine = line;

  const size_t slash = line.find('/');
  if (slash == string::npos) return data;

  data.carrierFlightNumber = line.substr(0, slash);

  const string remainder = line.substr(slash + 1);
  const vector<string> parts = split(remainder, '.');
  if (parts.size() > 0) data.day = parts[0];
  if (parts.size() > 1) data.aircraftRegistration = parts[1];
  if (parts.size() > 2) data.airportCode = parts[2];

  return data;
}

MvtEventData MvtJsonExtractor::parseActualMovementLine(const string& line) const
{
  MvtEventData data;
  data.kind = "ActualMovement";
  data.rawLine = line;

  const string payload = line.size() >= 2 ? line.substr(2) : string();
  const vector<string> parts = split(payload, '/');
  if (parts.size() > 0) data.actualDepartureDateTime = parts[0];
  if (parts.size() > 1) data.actualArrivalDateTime = parts[1];

  return data;
}

MvtEventData MvtJsonExtractor::parseActualDepartureEstimatedArrivalLine(const string& line) const
{
  MvtEventData data;
  data.kind = "ActualDepartureEstimatedArrival";
  data.rawLine = line;

  const size_t firstSpace = line.find(' ');
  const string mainPart = firstSpace == string::npos ? line : line.substr(0, firstSpace);
  const string tail = firstSpace == string::npos ? string() : line.substr(firstSpace + 1);

  const string payload = mainPart.size() >= 2 ? mainPart.substr(2) : string();
  const vector<string> parts = split(payload, '/');
  if (parts.size() > 0) data.actualDepartureDateTime = parts[0];
  if (parts.size() > 1) data.additionalActualDateTime = parts[1];

  if (!tail.empty())
  {
    const vector<string> tailParts = split(tail, ' ');
    if (!tailParts.empty() && tailParts[0].size() >= 6 && tailParts[0].substr(0, 2) == "EA")
      data.estimatedArrivalTime = tailParts[0].substr(2);
    if (tailParts.size() > 1)
      data.estimatedArrivalAirport = tailParts[1];
  }

  return data;
}

MvtEventData MvtJsonExtractor::parseEstimatedArrivalOnlyLine(const string& line) const
{
  MvtEventData data;
  data.kind = "EstimatedArrivalOnly";
  data.rawLine = line;
  data.estimatedArrivalTime = line.size() >= 2 ? line.substr(2) : string();
  return data;
}

MvtEventData MvtJsonExtractor::parseEventDepartureLine(const string& line) const
{
  MvtEventData data;
  data.kind = "EventDeparture";
  data.rawLine = line;
  data.eventDepartureDateTime = line.size() >= 2 ? line.substr(2) : string();
  return data;
}

MvtDelayData MvtJsonExtractor::parseDelayLine(const string& line) const
{
  MvtDelayData data;
  data.rawLine = line;

  const vector<string> parts = split(line, '/');
  if (parts.size() > 0) data.code = parts[0];
  if (parts.size() > 1) data.reason = parts[1];
  if (parts.size() > 2) data.firstTime = parts[2];
  if (parts.size() > 3) data.secondTime = parts[3];

  return data;
}

MvtPaxData MvtJsonExtractor::parsePaxLine(const string& line) const
{
  MvtPaxData data;
  data.rawLine = line;
  data.passengerCount = line.size() >= 2 ? line.substr(2) : string();
  return data;
}

MvtEventBlockData MvtJsonExtractor::parseEventBlockLine(const string& line) const
{
  MvtEventBlockData data;
  data.rawLine = line;
  data.time = line.size() >= 2 ? line.substr(2) : string();
  return data;
}

MvtFieldStateData MvtJsonExtractor::parseFieldStateLine(const string& line) const
{
  MvtFieldStateData data;
  data.rawLine = line;
  data.fieldState = line.size() >= 3 ? line.substr(3) : string();
  return data;
}

MvtEdlatData MvtJsonExtractor::parseEdlatLine(const string& line) const
{
  MvtEdlatData data;
  data.rawLine = line;
  const size_t slash = line.find('/');
  if (slash != string::npos)
    data.time = line.substr(slash + 1);
  return data;
}

void MvtJsonExtractor::printJson() const
{
  cout << "{" << endl;
  cout << "  \"MessageHeader\": \"" << escapeJson(messageHeader) << "\"," << endl;
  cout << "  \"FlightIdentification\": {" << endl;
  cout << "    \"RawLine\": \"" << escapeJson(flightIdentification.rawLine) << "\"," << endl;
  cout << "    \"CarrierFlightNumber\": \"" << escapeJson(flightIdentification.carrierFlightNumber) << "\"," << endl;
  cout << "    \"Day\": \"" << escapeJson(flightIdentification.day) << "\"," << endl;
  cout << "    \"AircraftRegistration\": \"" << escapeJson(flightIdentification.aircraftRegistration) << "\"," << endl;
  cout << "    \"AirportCode\": \"" << escapeJson(flightIdentification.airportCode) << "\"" << endl;
  cout << "  }," << endl;
  cout << "  \"Event\": {" << endl;
  cout << "    \"Kind\": \"" << escapeJson(event.kind) << "\"," << endl;
  cout << "    \"RawLine\": \"" << escapeJson(event.rawLine) << "\"," << endl;
  cout << "    \"ActualDepartureDateTime\": \"" << escapeJson(event.actualDepartureDateTime) << "\"," << endl;
  cout << "    \"ActualArrivalDateTime\": \"" << escapeJson(event.actualArrivalDateTime) << "\"," << endl;
  cout << "    \"AdditionalActualDateTime\": \"" << escapeJson(event.additionalActualDateTime) << "\"," << endl;
  cout << "    \"EstimatedArrivalTime\": \"" << escapeJson(event.estimatedArrivalTime) << "\"," << endl;
  cout << "    \"EstimatedArrivalAirport\": \"" << escapeJson(event.estimatedArrivalAirport) << "\"," << endl;
  cout << "    \"EventDepartureDateTime\": \"" << escapeJson(event.eventDepartureDateTime) << "\"" << endl;
  cout << "  }," << endl;
  cout << "  \"SupplementLines\": {" << endl;

  cout << "    \"DelayLines\": [" << endl;
  for (size_t i = 0; i < delayLines.size(); ++i)
  {
    const MvtDelayData& item = delayLines[i];
    cout << "      {" << endl;
    cout << "        \"RawLine\": \"" << escapeJson(item.rawLine) << "\"," << endl;
    cout << "        \"Code\": \"" << escapeJson(item.code) << "\"," << endl;
    cout << "        \"Reason\": \"" << escapeJson(item.reason) << "\"," << endl;
    cout << "        \"FirstTime\": \"" << escapeJson(item.firstTime) << "\"," << endl;
    cout << "        \"SecondTime\": \"" << escapeJson(item.secondTime) << "\"" << endl;
    cout << "      }";
    if (i + 1 < delayLines.size()) cout << ",";
    cout << endl;
  }
  cout << "    ]," << endl;

  cout << "    \"PaxLines\": [" << endl;
  for (size_t i = 0; i < paxLines.size(); ++i)
  {
    const MvtPaxData& item = paxLines[i];
    cout << "      {" << endl;
    cout << "        \"RawLine\": \"" << escapeJson(item.rawLine) << "\"," << endl;
    cout << "        \"PassengerCount\": \"" << escapeJson(item.passengerCount) << "\"" << endl;
    cout << "      }";
    if (i + 1 < paxLines.size()) cout << ",";
    cout << endl;
  }
  cout << "    ]," << endl;

  cout << "    \"EventBlockLines\": [" << endl;
  for (size_t i = 0; i < eventBlockLines.size(); ++i)
  {
    const MvtEventBlockData& item = eventBlockLines[i];
    cout << "      {" << endl;
    cout << "        \"RawLine\": \"" << escapeJson(item.rawLine) << "\"," << endl;
    cout << "        \"Time\": \"" << escapeJson(item.time) << "\"" << endl;
    cout << "      }";
    if (i + 1 < eventBlockLines.size()) cout << ",";
    cout << endl;
  }
  cout << "    ]," << endl;

  cout << "    \"FieldStateLines\": [" << endl;
  for (size_t i = 0; i < fieldStateLines.size(); ++i)
  {
    const MvtFieldStateData& item = fieldStateLines[i];
    cout << "      {" << endl;
    cout << "        \"RawLine\": \"" << escapeJson(item.rawLine) << "\"," << endl;
    cout << "        \"FieldState\": \"" << escapeJson(item.fieldState) << "\"" << endl;
    cout << "      }";
    if (i + 1 < fieldStateLines.size()) cout << ",";
    cout << endl;
  }
  cout << "    ]," << endl;

  cout << "    \"EdlatLines\": [" << endl;
  for (size_t i = 0; i < edlatLines.size(); ++i)
  {
    const MvtEdlatData& item = edlatLines[i];
    cout << "      {" << endl;
    cout << "        \"RawLine\": \"" << escapeJson(item.rawLine) << "\"," << endl;
    cout << "        \"Time\": \"" << escapeJson(item.time) << "\"" << endl;
    cout << "      }";
    if (i + 1 < edlatLines.size()) cout << ",";
    cout << endl;
  }
  cout << "    ]," << endl;

  cout << "    \"SiLines\": [" << endl;
  for (size_t i = 0; i < siLines.size(); ++i)
  {
    cout << "      \"" << escapeJson(siLines[i]) << "\"";
    if (i + 1 < siLines.size()) cout << ",";
    cout << endl;
  }
  cout << "    ]" << endl;

  cout << "  }" << endl;
  cout << "}" << endl;
}
