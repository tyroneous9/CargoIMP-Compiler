/* -----------------------------------------------------------------------------
 * XmlDisplayer.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef XmlDisplayer_hpp
#define XmlDisplayer_hpp

#include <vector>

#include "Visitor.hpp"

class Rule;

class XmlDisplayer : public Visitor
{
public:
  XmlDisplayer() : terminal(true) {}

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
  bool terminal;

  void* visitRules(const std::vector<const Rule*>& rules);
};

#endif

/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
