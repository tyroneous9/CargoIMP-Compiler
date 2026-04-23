/* -----------------------------------------------------------------------------
 * Displayer.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 22 18:15:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <iostream>
using std::cout;

#include <vector>
using std::vector;

#include "Displayer.hpp"

#include "Rule_FFM8.hpp"
#include "Rule_MessageHeader.hpp"
#include "Rule_FlightIdentificationLine.hpp"
#include "Rule_ArrivalInformationLine.hpp"
#include "Rule_DirectArrivalLine.hpp"
#include "Rule_TransitNILArrivalLine.hpp"
#include "Rule_TransitNILOnlyLine.hpp"
#include "Rule_DestinationOnlyLine.hpp"
#include "Rule_UldSection.hpp"
#include "Rule_AwbBlock.hpp"
#include "Rule_SupplementLine.hpp"
#include "Rule_ULDLine.hpp"
#include "Rule_AirWaybillLine.hpp"
#include "Rule_OsiLine.hpp"
#include "Rule_OciLine.hpp"
#include "Rule_SciLine.hpp"
#include "Rule_CorLine.hpp"
#include "Rule_SlashQualifierLine.hpp"
#include "Rule_ContinuationLine.hpp"
#include "Rule_TrailerLine.hpp"
#include "Rule_MessagePageNumber.hpp"
#include "Rule_CarrierFlightNumber.hpp"
#include "Rule_ScheduledDepartureDateTime.hpp"
#include "Rule_ScheduledDepartureDate.hpp"
#include "Rule_ScheduledDepartureTime.hpp"
#include "Rule_ScheduledArrivalDateTime.hpp"
#include "Rule_ScheduledArrivalDate.hpp"
#include "Rule_ScheduledArrivalTime.hpp"
#include "Rule_ScheduledOnwardDepartureDateTime.hpp"
#include "Rule_ScheduledOnwardDepartureDate.hpp"
#include "Rule_ScheduledOnwardDepartureTime.hpp"
#include "Rule_DepartureAirportCode.hpp"
#include "Rule_ArrivalAirportCode.hpp"
#include "Rule_AircraftRegistration.hpp"
#include "Rule_MasterAirwayBillNumber.hpp"
#include "Rule_AirlinePrefix.hpp"
#include "Rule_AWBSerialNumber.hpp"
#include "Rule_OriginAndDestination.hpp"
#include "Rule_AirportCode.hpp"
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
#include "Terminal_StringValue.hpp"
#include "Terminal_NumericValue.hpp"

void* Displayer::visit(const Rule_FFM8* rule)
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

void* Displayer::visit(const Rule_ArrivalInformationLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_DirectArrivalLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_TransitNILArrivalLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_TransitNILOnlyLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_DestinationOnlyLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_UldSection* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AwbBlock* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_SupplementLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ULDLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AirWaybillLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_OsiLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_OciLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_SciLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_CorLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_SlashQualifierLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ContinuationLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_TrailerLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_MessagePageNumber* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_CarrierFlightNumber* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ScheduledDepartureDateTime* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ScheduledDepartureDate* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ScheduledDepartureTime* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ScheduledArrivalDateTime* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ScheduledArrivalDate* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ScheduledArrivalTime* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ScheduledOnwardDepartureDateTime* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ScheduledOnwardDepartureDate* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ScheduledOnwardDepartureTime* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_DepartureAirportCode* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ArrivalAirportCode* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AircraftRegistration* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_MasterAirwayBillNumber* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AirlinePrefix* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AWBSerialNumber* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_OriginAndDestination* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AirportCode* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ULDIdentifier* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ULDDetailText* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ShipmentSummary* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_SummaryType* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_PieceCount* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_TotalPieceCount* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_WeightUnit* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_WeightValue* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_VolumeUnit* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_VolumeAmount* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_Month* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_FreeText* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ULDChar* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_SummaryChar* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_QualifierToken* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_NoSlashChar* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_LineChar* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_Slant* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_Hyphen* rule)
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

void* Displayer::visit(const Rule_EOL* rule)
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
