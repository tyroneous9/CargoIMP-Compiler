/* -----------------------------------------------------------------------------
 * Visitor.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef visitor_hpp
#define visitor_hpp

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

class Visitor
{
public:
  virtual void* visit(const Rule_MVTMessage* rule) = 0;
  virtual void* visit(const Rule_MessageHeader* rule) = 0;
  virtual void* visit(const Rule_FlightIdentificationLine* rule) = 0;
  virtual void* visit(const Rule_CarrierFlightNumber* rule) = 0;
  virtual void* visit(const Rule_Day* rule) = 0;
  virtual void* visit(const Rule_AircraftRegistration* rule) = 0;
  virtual void* visit(const Rule_AirportCode* rule) = 0;
  virtual void* visit(const Rule_EventLine* rule) = 0;
  virtual void* visit(const Rule_ActualMovementLine* rule) = 0;
  virtual void* visit(const Rule_ActualDepartureEstimatedArrivalLine* rule) = 0;
  virtual void* visit(const Rule_EstimatedArrivalOnlyLine* rule) = 0;
  virtual void* visit(const Rule_EventDepartureLine* rule) = 0;
  virtual void* visit(const Rule_SupplementLine* rule) = 0;
  virtual void* visit(const Rule_DelayLine* rule) = 0;
  virtual void* visit(const Rule_DelayCode* rule) = 0;
  virtual void* visit(const Rule_DelayReason* rule) = 0;
  virtual void* visit(const Rule_PaxLine* rule) = 0;
  virtual void* visit(const Rule_EventBlockLine* rule) = 0;
  virtual void* visit(const Rule_FieldStateLine* rule) = 0;
  virtual void* visit(const Rule_EdlatLine* rule) = 0;
  virtual void* visit(const Rule_SiLine* rule) = 0;
  virtual void* visit(const Rule_ActualDepartureDateTime* rule) = 0;
  virtual void* visit(const Rule_ActualArrivalDateTime* rule) = 0;
  virtual void* visit(const Rule_AdditionalActualDateTime* rule) = 0;
  virtual void* visit(const Rule_EstimatedArrivalTime* rule) = 0;
  virtual void* visit(const Rule_EstimatedArrivalAirport* rule) = 0;
  virtual void* visit(const Rule_DateTime6* rule) = 0;
  virtual void* visit(const Rule_Time4* rule) = 0;
  virtual void* visit(const Rule_LineChar* rule) = 0;
  virtual void* visit(const Rule_SP* rule) = 0;
  virtual void* visit(const Rule_EOL* rule) = 0;
  virtual void* visit(const Rule_Slant* rule) = 0;
  virtual void* visit(const Rule_Dot* rule) = 0;
  virtual void* visit(const Rule_Digit* rule) = 0;
  virtual void* visit(const Rule_Upper* rule) = 0;
  virtual void* visit(const Rule_AlphaNum* rule) = 0;

  virtual void* visit(const Terminal_StringValue* value) = 0;
  virtual void* visit(const Terminal_NumericValue* value) = 0;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
