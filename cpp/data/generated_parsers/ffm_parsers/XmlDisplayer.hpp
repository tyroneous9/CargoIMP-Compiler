/* -----------------------------------------------------------------------------
 * XmlDisplayer.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 22:09:18 CDT 2026
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

  void* visit(const Rule_FFM8* rule);
  void* visit(const Rule_MessageHeader* rule);
  void* visit(const Rule_FlightIdentificationLine* rule);
  void* visit(const Rule_ArrivalInformationLine* rule);
  void* visit(const Rule_DirectArrivalLine* rule);
  void* visit(const Rule_TransitNILArrivalLine* rule);
  void* visit(const Rule_TransitNILOnlyLine* rule);
  void* visit(const Rule_DestinationOnlyLine* rule);
  void* visit(const Rule_UldSection* rule);
  void* visit(const Rule_AwbBlock* rule);
  void* visit(const Rule_SupplementLine* rule);
  void* visit(const Rule_ULDLine* rule);
  void* visit(const Rule_AirWaybillLine* rule);
  void* visit(const Rule_OsiLine* rule);
  void* visit(const Rule_OciLine* rule);
  void* visit(const Rule_SciLine* rule);
  void* visit(const Rule_CorLine* rule);
  void* visit(const Rule_SlashQualifierLine* rule);
  void* visit(const Rule_ContinuationLine* rule);
  void* visit(const Rule_TrailerLine* rule);
  void* visit(const Rule_MessageFunctionCode* rule);
  void* visit(const Rule_CarrierFlightNumber* rule);
  void* visit(const Rule_ScheduledDepartureDateTime* rule);
  void* visit(const Rule_ScheduledDepartureDate* rule);
  void* visit(const Rule_ScheduledDepartureTime* rule);
  void* visit(const Rule_ScheduledArrivalDateTime* rule);
  void* visit(const Rule_ScheduledArrivalDate* rule);
  void* visit(const Rule_ScheduledArrivalTime* rule);
  void* visit(const Rule_ScheduledOnwardDepartureDateTime* rule);
  void* visit(const Rule_ScheduledOnwardDepartureDate* rule);
  void* visit(const Rule_ScheduledOnwardDepartureTime* rule);
  void* visit(const Rule_DepartureAirportCode* rule);
  void* visit(const Rule_ArrivalAirportCode* rule);
  void* visit(const Rule_AircraftRegistration* rule);
  void* visit(const Rule_MasterAirwayBillNumber* rule);
  void* visit(const Rule_AirlinePrefix* rule);
  void* visit(const Rule_AWBSerialNumber* rule);
  void* visit(const Rule_OriginAndDestination* rule);
  void* visit(const Rule_AirportCode* rule);
  void* visit(const Rule_ULDIdentifier* rule);
  void* visit(const Rule_ULDDetailText* rule);
  void* visit(const Rule_ShipmentSummary* rule);
  void* visit(const Rule_SummaryType* rule);
  void* visit(const Rule_PieceCount* rule);
  void* visit(const Rule_TotalPieceCount* rule);
  void* visit(const Rule_WeightUnit* rule);
  void* visit(const Rule_WeightValue* rule);
  void* visit(const Rule_VolumeUnit* rule);
  void* visit(const Rule_VolumeAmount* rule);
  void* visit(const Rule_Month* rule);
  void* visit(const Rule_FreeText* rule);
  void* visit(const Rule_ULDChar* rule);
  void* visit(const Rule_SummaryChar* rule);
  void* visit(const Rule_QualifierToken* rule);
  void* visit(const Rule_NoSlashChar* rule);
  void* visit(const Rule_LineChar* rule);
  void* visit(const Rule_Slant* rule);
  void* visit(const Rule_Hyphen* rule);
  void* visit(const Rule_Dot* rule);
  void* visit(const Rule_Digit* rule);
  void* visit(const Rule_Upper* rule);
  void* visit(const Rule_AlphaNum* rule);
  void* visit(const Rule_EOL* rule);

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
