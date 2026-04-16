#ifndef FHL4_JSON_EXTRACTOR_HPP
#define FHL4_JSON_EXTRACTOR_HPP

#include <string>
#include <vector>

#include "Visitor.hpp"

class Rule;

struct Fhl4PartyData
{
  std::string tagLine;
  std::vector<std::string> continuations;
};

// Holds extracted data for one house-bill group (HBS + TXT + HTS + OCI).
struct Fhl4HouseData
{
  std::string houseBillLine;
  std::string houseOriginAndDestination;
  std::string houseWaybillNumber;
  std::string housePieceCount;
  std::string houseWeightUnit;
  std::string houseWeight;
  std::string descriptionTagLine;
  std::vector<std::string> descriptionContinuations;
  std::vector<std::string> htsLines;
  std::vector<std::string> ociLines;
};

class Fhl4JsonExtractor : public Visitor
{
public:
  void* visit(const Rule_FHL4* rule);
  void* visit(const Rule_MessageHeader* rule);
  void* visit(const Rule_MasterBillLine* rule);
  void* visit(const Rule_MasterAirwayBillNumber* rule);
  void* visit(const Rule_AirlinePrefix* rule);
  void* visit(const Rule_AWBSerialNumber* rule);
  void* visit(const Rule_MasterOriginAndDestination* rule);
  void* visit(const Rule_AirportCode* rule);
  void* visit(const Rule_MasterBillSummary* rule);
  void* visit(const Rule_MasterPieceCount* rule);
  void* visit(const Rule_MasterWeightUnit* rule);
  void* visit(const Rule_MasterWeight* rule);
  void* visit(const Rule_HouseBillGroup* rule);
  void* visit(const Rule_HouseBillLine* rule);
  void* visit(const Rule_HouseOriginAndDestination* rule);
  void* visit(const Rule_HouseWaybillNumber* rule);
  void* visit(const Rule_HousePieceCount* rule);
  void* visit(const Rule_HouseWeightUnit* rule);
  void* visit(const Rule_HouseWeight* rule);
  void* visit(const Rule_DescriptionBlock* rule);
  void* visit(const Rule_DescriptionTagLine* rule);
  void* visit(const Rule_DescriptionContLine* rule);
  void* visit(const Rule_HtsBlock* rule);
  void* visit(const Rule_HtsLine* rule);
  void* visit(const Rule_HtsContLine* rule);
  void* visit(const Rule_OciBlock* rule);
  void* visit(const Rule_OciLine* rule);
  void* visit(const Rule_OciContLine* rule);
  void* visit(const Rule_ShipperBlock* rule);
  void* visit(const Rule_ShipperTagLine* rule);
  void* visit(const Rule_ShipperContLine* rule);
  void* visit(const Rule_ConsigneeBlock* rule);
  void* visit(const Rule_ConsigneeTagLine* rule);
  void* visit(const Rule_ConsigneeContLine* rule);
  void* visit(const Rule_CvdLine* rule);
  void* visit(const Rule_LineChar* rule);
  void* visit(const Rule_EOL* rule);
  void* visit(const Rule_Slant* rule);
  void* visit(const Rule_Hyphen* rule);
  void* visit(const Rule_Digit* rule);
  void* visit(const Rule_Upper* rule);
  void* visit(const Rule_AlphaNum* rule);

  void* visit(const Terminal_StringValue* value);
  void* visit(const Terminal_NumericValue* value);

private:
  std::string masterBillLine;
  std::string masterAWB;
  std::string masterOriginAndDestination;
  std::string masterBillSummary;
  std::string masterPieceCount;
  std::string masterWeightUnit;
  std::string masterWeight;

  // Accumulator for the house-bill group currently being parsed.
  Fhl4HouseData currentHouse;
  // All house-bill groups in document order.
  std::vector<Fhl4HouseData> houseBills;

  Fhl4PartyData shipper;
  Fhl4PartyData consignee;
  std::string cvdLine;

  void* visitRules(const std::vector<const Rule*>& rules);
  std::string escapeJson(const std::string& input) const;
  std::string trimTrailing(const std::string& input) const;
  std::string jsonArray(const std::vector<std::string>& items) const;
  std::string jsonParty(const Fhl4PartyData& p, const std::string& tagKey) const;
  std::string jsonHouse(const Fhl4HouseData& h) const;
  void printJson() const;
};

#endif
