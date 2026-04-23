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

#include "Rule_FFM8.hpp"
#include "Rule_MessageHeader.hpp"
#include "Rule_FlightIdentificationLine.hpp"
#include "Rule_ArrivalInformationLine.hpp"
#include "Rule_DirectArrivalLine.hpp"
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
#include "Terminal_StringValue.hpp"
#include "Terminal_NumericValue.hpp"

void* XmlDisplayer::visit(const Rule_FFM8* rule)
{
  if (!terminal) cout << endl;
  cout << "<FFM8>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</FFM8>";
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

void* XmlDisplayer::visit(const Rule_ArrivalInformationLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ArrivalInformationLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ArrivalInformationLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_DirectArrivalLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<DirectArrivalLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</DirectArrivalLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_TransitNILArrivalLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<TransitNILArrivalLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</TransitNILArrivalLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_TransitNILOnlyLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<TransitNILOnlyLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</TransitNILOnlyLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_DestinationOnlyLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<DestinationOnlyLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</DestinationOnlyLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_UldSection* rule)
{
  if (!terminal) cout << endl;
  cout << "<UldSection>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</UldSection>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_HouseBillBlock* rule)
{
  if (!terminal) cout << endl;
  cout << "<HouseBillBlock>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</HouseBillBlock>";
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

void* XmlDisplayer::visit(const Rule_ULDLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ULDLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ULDLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_HouseBillLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<HouseBillLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</HouseBillLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_OsiLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<OsiLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</OsiLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_OciLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<OciLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</OciLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_SciLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<SciLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</SciLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_CorLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<CorLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</CorLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_SlashQualifierLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<SlashQualifierLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</SlashQualifierLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ContinuationLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ContinuationLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ContinuationLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_TrailerLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<TrailerLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</TrailerLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_MessagePageNumber* rule)
{
  if (!terminal) cout << endl;
  cout << "<MessagePageNumber>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</MessagePageNumber>";
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

void* XmlDisplayer::visit(const Rule_DepartureAirportCode* rule)
{
  if (!terminal) cout << endl;
  cout << "<DepartureAirportCode>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</DepartureAirportCode>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ArrivalAirportCode* rule)
{
  if (!terminal) cout << endl;
  cout << "<ArrivalAirportCode>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ArrivalAirportCode>";
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

void* XmlDisplayer::visit(const Rule_HouseWaybillNumber* rule)
{
  if (!terminal) cout << endl;
  cout << "<HouseWaybillNumber>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</HouseWaybillNumber>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_MasterAirwayBillNumber* rule)
{
  if (!terminal) cout << endl;
  cout << "<MasterAirwayBillNumber>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</MasterAirwayBillNumber>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_AirlinePrefix* rule)
{
  if (!terminal) cout << endl;
  cout << "<AirlinePrefix>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</AirlinePrefix>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_AWBSerialNumber* rule)
{
  if (!terminal) cout << endl;
  cout << "<AWBSerialNumber>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</AWBSerialNumber>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ScheduledDepartureDateTime* rule)
{
  if (!terminal) cout << endl;
  cout << "<ScheduledDepartureDateTime>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ScheduledDepartureDateTime>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ScheduledDepartureDate* rule)
{
  if (!terminal) cout << endl;
  cout << "<ScheduledDepartureDate>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ScheduledDepartureDate>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ScheduledDepartureTime* rule)
{
  if (!terminal) cout << endl;
  cout << "<ScheduledDepartureTime>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ScheduledDepartureTime>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ScheduledArrivalDateTime* rule)
{
  if (!terminal) cout << endl;
  cout << "<ScheduledArrivalDateTime>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ScheduledArrivalDateTime>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ScheduledArrivalDate* rule)
{
  if (!terminal) cout << endl;
  cout << "<ScheduledArrivalDate>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ScheduledArrivalDate>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ScheduledArrivalTime* rule)
{
  if (!terminal) cout << endl;
  cout << "<ScheduledArrivalTime>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ScheduledArrivalTime>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ScheduledOnwardDepartureDateTime* rule)
{
  if (!terminal) cout << endl;
  cout << "<ScheduledOnwardDepartureDateTime>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ScheduledOnwardDepartureDateTime>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ScheduledOnwardDepartureDate* rule)
{
  if (!terminal) cout << endl;
  cout << "<ScheduledOnwardDepartureDate>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ScheduledOnwardDepartureDate>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ScheduledOnwardDepartureTime* rule)
{
  if (!terminal) cout << endl;
  cout << "<ScheduledOnwardDepartureTime>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ScheduledOnwardDepartureTime>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_OriginAndDestination* rule)
{
  if (!terminal) cout << endl;
  cout << "<OriginAndDestination>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</OriginAndDestination>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ULDIdentifier* rule)
{
  if (!terminal) cout << endl;
  cout << "<ULDIdentifier>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ULDIdentifier>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ULDDetailText* rule)
{
  if (!terminal) cout << endl;
  cout << "<ULDDetailText>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ULDDetailText>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ShipmentSummary* rule)
{
  if (!terminal) cout << endl;
  cout << "<ShipmentSummary>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ShipmentSummary>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_SummaryType* rule)
{
  if (!terminal) cout << endl;
  cout << "<SummaryType>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</SummaryType>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_PieceCount* rule)
{
  if (!terminal) cout << endl;
  cout << "<PieceCount>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</PieceCount>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_TotalPieceCount* rule)
{
  if (!terminal) cout << endl;
  cout << "<TotalPieceCount>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</TotalPieceCount>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_WeightUnit* rule)
{
  if (!terminal) cout << endl;
  cout << "<WeightUnit>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</WeightUnit>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_WeightValue* rule)
{
  if (!terminal) cout << endl;
  cout << "<WeightValue>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</WeightValue>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_VolumeUnit* rule)
{
  if (!terminal) cout << endl;
  cout << "<VolumeUnit>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</VolumeUnit>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_VolumeAmount* rule)
{
  if (!terminal) cout << endl;
  cout << "<VolumeAmount>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</VolumeAmount>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_Month* rule)
{
  if (!terminal) cout << endl;
  cout << "<Month>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</Month>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_FreeText* rule)
{
  if (!terminal) cout << endl;
  cout << "<FreeText>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</FreeText>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ULDChar* rule)
{
  if (!terminal) cout << endl;
  cout << "<ULDChar>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ULDChar>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_SummaryChar* rule)
{
  if (!terminal) cout << endl;
  cout << "<SummaryChar>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</SummaryChar>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_QualifierToken* rule)
{
  if (!terminal) cout << endl;
  cout << "<QualifierToken>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</QualifierToken>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_NoSlashChar* rule)
{
  if (!terminal) cout << endl;
  cout << "<NoSlashChar>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</NoSlashChar>";
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

void* XmlDisplayer::visit(const Rule_Hyphen* rule)
{
  if (!terminal) cout << endl;
  cout << "<Hyphen>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</Hyphen>";
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
