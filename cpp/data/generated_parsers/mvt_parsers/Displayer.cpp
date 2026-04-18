/* -----------------------------------------------------------------------------
 * Displayer.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 02:09:06 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <iostream>
using std::cout;

#include <vector>
using std::vector;

#include "Displayer.hpp"

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

void* Displayer::visit(const Rule_MVTMessage* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_MessageHeader* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_FlightIdentificationLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_CarrierFlightNumber* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_Day* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AircraftRegistration* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AirportCode* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_EventLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ActualMovementLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ActualDepartureEstimatedArrivalLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_EstimatedArrivalOnlyLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_EventDepartureLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_SupplementLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_DelayLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_DelayCode* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_DelayReason* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_PaxLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_EventBlockLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_FieldStateLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_EdlatLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_SiLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ActualDepartureDateTime* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ActualArrivalDateTime* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AdditionalActualDateTime* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_EstimatedArrivalTime* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_EstimatedArrivalAirport* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_DateTime6* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_Time4* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_LineChar* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_SP* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_EOL* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_Slant* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_Dot* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_Digit* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_Upper* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AlphaNum* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Terminal_StringValue* value)
{
  cout << value->spelling;
  return NULL;
}

void* Displayer::visit(const Terminal_NumericValue* value)
{
  cout << value->spelling;
  return NULL;
}

void* Displayer::visitRules(const vector<const Rule*>& rules)
{
  vector<const Rule*>::const_iterator i;
  for (i = rules.begin(); i != rules.end(); i++)
    (*i)->accept(*this);

  return NULL;
}

/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
