/* -----------------------------------------------------------------------------
 * XmlDisplayer.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 20:33:48 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <iostream>
using std::cout;
using std::endl;

#include <vector>
using std::vector;

#include "XmlDisplayer.hpp"

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

void* XmlDisplayer::visit(const Rule_MVTMessage* rule)
{
  if (!terminal) cout << endl;
  cout << "<MVTMessage>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</MVTMessage>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_MessageHeader* rule)
{
  if (!terminal) cout << endl;
  cout << "<MessageHeader>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</MessageHeader>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_FlightIdentificationLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<FlightIdentificationLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</FlightIdentificationLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_CarrierFlightNumber* rule)
{
  if (!terminal) cout << endl;
  cout << "<CarrierFlightNumber>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</CarrierFlightNumber>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_Day* rule)
{
  if (!terminal) cout << endl;
  cout << "<Day>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</Day>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_AircraftRegistration* rule)
{
  if (!terminal) cout << endl;
  cout << "<AircraftRegistration>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</AircraftRegistration>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_AirportCode* rule)
{
  if (!terminal) cout << endl;
  cout << "<AirportCode>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</AirportCode>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_EventLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<EventLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</EventLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ActualMovementLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ActualMovementLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ActualMovementLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ActualDepartureEstimatedArrivalLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ActualDepartureEstimatedArrivalLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ActualDepartureEstimatedArrivalLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_EstimatedArrivalOnlyLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<EstimatedArrivalOnlyLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</EstimatedArrivalOnlyLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_EventDepartureLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<EventDepartureLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</EventDepartureLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_SupplementLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<SupplementLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</SupplementLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_DelayLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<DelayLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</DelayLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_DelayCode* rule)
{
  if (!terminal) cout << endl;
  cout << "<DelayCode>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</DelayCode>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_DelayReason* rule)
{
  if (!terminal) cout << endl;
  cout << "<DelayReason>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</DelayReason>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_PaxLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<PaxLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</PaxLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_EventBlockLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<EventBlockLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</EventBlockLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_FieldStateLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<FieldStateLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</FieldStateLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_EdlatLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<EdlatLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</EdlatLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_SiLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<SiLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</SiLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ActualDepartureDateTime* rule)
{
  if (!terminal) cout << endl;
  cout << "<ActualDepartureDateTime>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ActualDepartureDateTime>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ActualArrivalDateTime* rule)
{
  if (!terminal) cout << endl;
  cout << "<ActualArrivalDateTime>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ActualArrivalDateTime>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_AdditionalActualDateTime* rule)
{
  if (!terminal) cout << endl;
  cout << "<AdditionalActualDateTime>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</AdditionalActualDateTime>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_EstimatedArrivalTime* rule)
{
  if (!terminal) cout << endl;
  cout << "<EstimatedArrivalTime>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</EstimatedArrivalTime>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_EstimatedArrivalAirport* rule)
{
  if (!terminal) cout << endl;
  cout << "<EstimatedArrivalAirport>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</EstimatedArrivalAirport>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_DateTime6* rule)
{
  if (!terminal) cout << endl;
  cout << "<DateTime6>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</DateTime6>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_Time4* rule)
{
  if (!terminal) cout << endl;
  cout << "<Time4>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</Time4>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_LineChar* rule)
{
  if (!terminal) cout << endl;
  cout << "<LineChar>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</LineChar>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_SP* rule)
{
  if (!terminal) cout << endl;
  cout << "<SP>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</SP>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_EOL* rule)
{
  if (!terminal) cout << endl;
  cout << "<EOL>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</EOL>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_Slant* rule)
{
  if (!terminal) cout << endl;
  cout << "<Slant>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</Slant>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_Dot* rule)
{
  if (!terminal) cout << endl;
  cout << "<Dot>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</Dot>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_Digit* rule)
{
  if (!terminal) cout << endl;
  cout << "<Digit>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</Digit>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_Upper* rule)
{
  if (!terminal) cout << endl;
  cout << "<Upper>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</Upper>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_AlphaNum* rule)
{
  if (!terminal) cout << endl;
  cout << "<AlphaNum>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</AlphaNum>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Terminal_StringValue* value)
{
  cout << value->spelling;
  terminal = true;
  return NULL;
}

void* XmlDisplayer::visit(const Terminal_NumericValue* value)
{
  cout << value->spelling;
  terminal = true;
  return NULL;
}

void* XmlDisplayer::visitRules(const vector<const Rule*>& rules)
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
