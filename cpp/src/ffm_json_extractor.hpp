#ifndef FFM_JSON_EXTRACTOR_HPP
#define FFM_JSON_EXTRACTOR_HPP

#include <string>
#include <vector>

#include "Visitor.hpp"

class Rule;

struct FfmAwbData
{
  std::string airWaybillLine;
  std::string masterAWBNumber;
  std::string originAndDest;
  std::string shipmentSummary;
  std::string freeText;
  std::vector<std::string> osiLines;
  std::vector<std::string> ociLines;
  std::vector<std::string> qualifiers;
  std::vector<std::string> continuations;
};

struct FfmUldData
{
  std::string uldIdentifier;
  std::string uldDetailText;
  std::vector<FfmAwbData> awbs;
};

class FfmJsonExtractor : public Visitor
{
public:
  void* visit(const Rule_FFM8* rule);
  void* visit(const Rule_MessageHeader* rule);
  void* visit(const Rule_FlightIdentificationLine* rule);
  void* visit(const Rule_RouteLine* rule);
  void* visit(const Rule_UldSection* rule);
  void* visit(const Rule_AwbBlock* rule);
  void* visit(const Rule_SupplementLine* rule);
  void* visit(const Rule_ULDLine* rule);
  void* visit(const Rule_AirWaybillLine* rule);
  void* visit(const Rule_OsiLine* rule);
  void* visit(const Rule_OciLine* rule);
  void* visit(const Rule_CorLine* rule);
  void* visit(const Rule_SlashQualifierLine* rule);
  void* visit(const Rule_ContinuationLine* rule);
  void* visit(const Rule_TrailerLine* rule);
  void* visit(const Rule_MessageFunctionCode* rule);
  void* visit(const Rule_CarrierFlightNumber* rule);
  void* visit(const Rule_DayMonthTime* rule);
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
  std::string messageHeader;
  std::string flightLine;
  std::string routeLine;
  std::vector<FfmUldData> ulds;

  void* visitRules(const std::vector<const Rule*>& rules);
  std::string escapeJson(const std::string& input) const;
  std::string jsonArray(const std::vector<std::string>& items) const;
  void printJson() const;
};

#endif