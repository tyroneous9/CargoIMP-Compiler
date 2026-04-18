#ifndef MVT_JSON_EXTRACTOR_HPP
#define MVT_JSON_EXTRACTOR_HPP

#include <string>
#include <vector>

#include "Visitor.hpp"

class Rule;
class Rule_MVTMessage;
class Rule_MessageHeader;
class Rule_FlightIdentificationLine;
class Rule_CarrierFlightNumber;
class Rule_Day;
class Rule_AircraftRegistration;
class Rule_AirportCode;
class Rule_EventLine;
class Rule_ActualMovementLine;
class Rule_ActualDepartureEstimatedArrivalLine;
class Rule_EstimatedArrivalOnlyLine;
class Rule_EventDepartureLine;
class Rule_SupplementLine;
class Rule_DelayLine;
class Rule_DelayCode;
class Rule_DelayReason;
class Rule_PaxLine;
class Rule_EventBlockLine;
class Rule_FieldStateLine;
class Rule_EdlatLine;
class Rule_SiLine;
class Rule_ActualDepartureDateTime;
class Rule_ActualArrivalDateTime;
class Rule_AdditionalActualDateTime;
class Rule_EstimatedArrivalTime;
class Rule_EstimatedArrivalAirport;
class Rule_DateTime6;
class Rule_Time4;
class Rule_LineChar;
class Rule_SP;
class Rule_EOL;
class Rule_Slant;
class Rule_Dot;
class Rule_Digit;
class Rule_Upper;
class Rule_AlphaNum;
class Terminal_StringValue;
class Terminal_NumericValue;

struct MvtFlightIdentificationData
{
  std::string rawLine;
  std::string carrierFlightNumber;
  std::string day;
  std::string aircraftRegistration;
  std::string airportCode;
};

struct MvtEventData
{
  std::string kind;
  std::string rawLine;
  std::string actualDepartureDateTime;
  std::string actualArrivalDateTime;
  std::string additionalActualDateTime;
  std::string estimatedArrivalTime;
  std::string estimatedArrivalAirport;
  std::string eventDepartureDateTime;
};

struct MvtDelayData
{
  std::string rawLine;
  std::string code;
  std::string reason;
  std::string firstTime;
  std::string secondTime;
};

struct MvtPaxData
{
  std::string rawLine;
  std::string passengerCount;
};

struct MvtEventBlockData
{
  std::string rawLine;
  std::string time;
};

struct MvtFieldStateData
{
  std::string rawLine;
  std::string fieldState;
};

struct MvtEdlatData
{
  std::string rawLine;
  std::string time;
};

class MvtJsonExtractor : public Visitor
{
public:
  void* visit(const Rule_MVTMessage* rule);
  void* visit(const Rule_MessageHeader* rule);
  void* visit(const Rule_FlightIdentificationLine* rule);
  void* visit(const Rule_CarrierFlightNumber* rule);
  void* visit(const Rule_Day* rule);
  void* visit(const Rule_AircraftRegistration* rule);
  void* visit(const Rule_AirportCode* rule);
  void* visit(const Rule_EventLine* rule);
  void* visit(const Rule_ActualMovementLine* rule);
  void* visit(const Rule_ActualDepartureEstimatedArrivalLine* rule);
  void* visit(const Rule_EstimatedArrivalOnlyLine* rule);
  void* visit(const Rule_EventDepartureLine* rule);
  void* visit(const Rule_SupplementLine* rule);
  void* visit(const Rule_DelayLine* rule);
  void* visit(const Rule_DelayCode* rule);
  void* visit(const Rule_DelayReason* rule);
  void* visit(const Rule_PaxLine* rule);
  void* visit(const Rule_EventBlockLine* rule);
  void* visit(const Rule_FieldStateLine* rule);
  void* visit(const Rule_EdlatLine* rule);
  void* visit(const Rule_SiLine* rule);
  void* visit(const Rule_ActualDepartureDateTime* rule);
  void* visit(const Rule_ActualArrivalDateTime* rule);
  void* visit(const Rule_AdditionalActualDateTime* rule);
  void* visit(const Rule_EstimatedArrivalTime* rule);
  void* visit(const Rule_EstimatedArrivalAirport* rule);
  void* visit(const Rule_DateTime6* rule);
  void* visit(const Rule_Time4* rule);
  void* visit(const Rule_LineChar* rule);
  void* visit(const Rule_SP* rule);
  void* visit(const Rule_EOL* rule);
  void* visit(const Rule_Slant* rule);
  void* visit(const Rule_Dot* rule);
  void* visit(const Rule_Digit* rule);
  void* visit(const Rule_Upper* rule);
  void* visit(const Rule_AlphaNum* rule);
  void* visit(const Terminal_StringValue* value);
  void* visit(const Terminal_NumericValue* value);

private:
  std::string messageHeader;
  MvtFlightIdentificationData flightIdentification;
  MvtEventData event;
  std::vector<MvtDelayData> delayLines;
  std::vector<MvtPaxData> paxLines;
  std::vector<MvtEventBlockData> eventBlockLines;
  std::vector<MvtFieldStateData> fieldStateLines;
  std::vector<MvtEdlatData> edlatLines;
  std::vector<std::string> siLines;

  void* visitRules(const std::vector<const Rule*>& rules);
  std::string escapeJson(const std::string& input) const;
  std::vector<std::string> split(const std::string& input, char delimiter) const;
  MvtFlightIdentificationData parseFlightIdentificationLine(const std::string& line) const;
  MvtEventData parseActualMovementLine(const std::string& line) const;
  MvtEventData parseActualDepartureEstimatedArrivalLine(const std::string& line) const;
  MvtEventData parseEstimatedArrivalOnlyLine(const std::string& line) const;
  MvtEventData parseEventDepartureLine(const std::string& line) const;
  MvtDelayData parseDelayLine(const std::string& line) const;
  MvtPaxData parsePaxLine(const std::string& line) const;
  MvtEventBlockData parseEventBlockLine(const std::string& line) const;
  MvtFieldStateData parseFieldStateLine(const std::string& line) const;
  MvtEdlatData parseEdlatLine(const std::string& line) const;
  void printJson() const;
};

#endif
