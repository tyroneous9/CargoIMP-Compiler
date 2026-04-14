#include <iostream>
using std::cout;
using std::endl;

#include <string>
using std::string;

#include <vector>
using std::vector;

#include "ffm_json_extractor.hpp"

#include "Rule.hpp"

#include "Rule_FFM8.hpp"
#include "Rule_MessageHeader.hpp"
#include "Rule_FlightIdentificationLine.hpp"
#include "Rule_RouteLine.hpp"
#include "Rule_UldSection.hpp"
#include "Rule_AwbBlock.hpp"
#include "Rule_SupplementLine.hpp"
#include "Rule_ULDLine.hpp"
#include "Rule_AirWaybillLine.hpp"
#include "Rule_OsiLine.hpp"
#include "Rule_OciLine.hpp"
#include "Rule_SlashQualifierLine.hpp"
#include "Rule_ContinuationLine.hpp"
#include "Rule_TrailerLine.hpp"
#include "Rule_MessageFunctionCode.hpp"
#include "Rule_CarrierFlightNumber.hpp"
#include "Rule_DayMonthTime.hpp"
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

void* FfmJsonExtractor::visit(const Rule_FFM8* rule)
{
  visitRules(rule->rules);
  printJson();
  return NULL;
}

void* FfmJsonExtractor::visit(const Rule_MessageHeader* rule) { messageHeader = rule->spelling; return NULL; }
void* FfmJsonExtractor::visit(const Rule_FlightIdentificationLine* rule) { flightLine = rule->spelling; return NULL; }
void* FfmJsonExtractor::visit(const Rule_RouteLine* rule) { routeLine = rule->spelling; return NULL; }

void* FfmJsonExtractor::visit(const Rule_UldSection* rule)
{
  ulds.emplace_back();
  return visitRules(rule->rules);
}

void* FfmJsonExtractor::visit(const Rule_AwbBlock* rule)
{
  ulds.back().awbs.emplace_back();
  return visitRules(rule->rules);
}

void* FfmJsonExtractor::visit(const Rule_SupplementLine* rule) { return visitRules(rule->rules); }
void* FfmJsonExtractor::visit(const Rule_ULDLine* rule) { return visitRules(rule->rules); }

void* FfmJsonExtractor::visit(const Rule_AirWaybillLine* rule)
{
  ulds.back().awbs.back().airWaybillLine = rule->spelling;
  return visitRules(rule->rules);
}

void* FfmJsonExtractor::visit(const Rule_OsiLine* rule) { ulds.back().awbs.back().osiLines.push_back(rule->spelling); return NULL; }
void* FfmJsonExtractor::visit(const Rule_OciLine* rule) { ulds.back().awbs.back().ociLines.push_back(rule->spelling); return NULL; }
void* FfmJsonExtractor::visit(const Rule_SlashQualifierLine* rule) { ulds.back().awbs.back().qualifiers.push_back(rule->spelling); return NULL; }
void* FfmJsonExtractor::visit(const Rule_ContinuationLine* rule) { ulds.back().awbs.back().continuations.push_back(rule->spelling); return NULL; }
void* FfmJsonExtractor::visit(const Rule_ULDIdentifier* rule) { ulds.back().uldIdentifier = rule->spelling; return NULL; }
void* FfmJsonExtractor::visit(const Rule_ULDDetailText* rule) { ulds.back().uldDetailText = rule->spelling; return NULL; }
void* FfmJsonExtractor::visit(const Rule_MasterAirwayBillNumber* rule) { ulds.back().awbs.back().masterAWBNumber = rule->spelling; return NULL; }
void* FfmJsonExtractor::visit(const Rule_OriginAndDestination* rule) { ulds.back().awbs.back().originAndDest = rule->spelling; return NULL; }
void* FfmJsonExtractor::visit(const Rule_ShipmentSummary* rule) { ulds.back().awbs.back().shipmentSummary = rule->spelling; return NULL; }
void* FfmJsonExtractor::visit(const Rule_FreeText* rule) { ulds.back().awbs.back().freeText = rule->spelling; return NULL; }

void* FfmJsonExtractor::visit(const Rule_TrailerLine* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_MessageFunctionCode* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_CarrierFlightNumber* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_DayMonthTime* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_AircraftRegistration* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_AirlinePrefix* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_AWBSerialNumber* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_AirportCode* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_SummaryType* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_PieceCount* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_TotalPieceCount* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_WeightUnit* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_WeightValue* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_VolumeUnit* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_VolumeAmount* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_Month* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_ULDChar* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_SummaryChar* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_QualifierToken* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_NoSlashChar* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_LineChar* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_Slant* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_Hyphen* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_Dot* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_Digit* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_Upper* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_AlphaNum* rule) { (void)rule; return NULL; }
void* FfmJsonExtractor::visit(const Rule_EOL* rule) { (void)rule; return NULL; }

void* FfmJsonExtractor::visit(const Terminal_StringValue* value)
{
  (void)value;
  return NULL;
}

void* FfmJsonExtractor::visit(const Terminal_NumericValue* value)
{
  (void)value;
  return NULL;
}

void* FfmJsonExtractor::visitRules(const vector<const Rule*>& rules)
{
  vector<const Rule*>::const_iterator it;
  for (it = rules.begin(); it != rules.end(); ++it)
    (*it)->accept(*this);

  return NULL;
}

string FfmJsonExtractor::escapeJson(const string& input) const
{
  string out;
  out.reserve(input.size());

  for (string::const_iterator it = input.begin(); it != input.end(); ++it)
  {
    const char c = *it;
    if (c == '\\') out += "\\\\";
    else if (c == '"') out += "\\\"";
    else if (c == '\n') out += "\\n";
    else if (c == '\r') out += "\\r";
    else if (c == '\t') out += "\\t";
    else out += c;
  }

  return out;
}

string FfmJsonExtractor::jsonArray(const vector<string>& items) const
{
  if (items.empty()) return "[]";
  string out = "[";
  for (size_t i = 0; i < items.size(); ++i)
  {
    if (i > 0) out += ", ";
    out += "\"";
    out += escapeJson(items[i]);
    out += "\"";
  }
  out += "]";
  return out;
}

void FfmJsonExtractor::printJson() const
{
  cout << "{" << endl;
  cout << "  \"MessageHeader\": \"" << escapeJson(messageHeader) << "\"," << endl;
  cout << "  \"FlightIdentificationLine\": \"" << escapeJson(flightLine) << "\"," << endl;
  cout << "  \"RouteLine\": \"" << escapeJson(routeLine) << "\"," << endl;
  cout << "  \"ULDs\": {" << endl;

  for (size_t i = 0; i < ulds.size(); ++i)
  {
    const FfmUldData& uld = ulds[i];
    cout << "    \"" << escapeJson(uld.uldIdentifier) << "\": {" << endl;
    if (!uld.uldDetailText.empty())
      cout << "      \"ULDDetailText\": \"" << escapeJson(uld.uldDetailText) << "\"," << endl;
    cout << "      \"AWBs\": [" << endl;

    for (size_t j = 0; j < uld.awbs.size(); ++j)
    {
      const FfmAwbData& awb = uld.awbs[j];
      cout << "        {" << endl;
      cout << "          \"AirWaybillLine\": \"" << escapeJson(awb.airWaybillLine) << "\"," << endl;
      cout << "          \"MasterAirwayBillNumber\": \"" << escapeJson(awb.masterAWBNumber) << "\"," << endl;
      cout << "          \"OriginAndDestination\": \"" << escapeJson(awb.originAndDest) << "\"," << endl;
      cout << "          \"ShipmentSummary\": \"" << escapeJson(awb.shipmentSummary) << "\"," << endl;
      cout << "          \"FreeText\": \"" << escapeJson(awb.freeText) << "\"," << endl;
      cout << "          \"OSI\": " << jsonArray(awb.osiLines) << "," << endl;
      cout << "          \"OCI\": " << jsonArray(awb.ociLines) << "," << endl;
      cout << "          \"Qualifiers\": " << jsonArray(awb.qualifiers) << "," << endl;
      cout << "          \"Continuations\": " << jsonArray(awb.continuations) << endl;
      cout << "        }";
      if (j + 1 < uld.awbs.size()) cout << ",";
      cout << endl;
    }

    cout << "      ]" << endl;
    cout << "    }";
    if (i + 1 < ulds.size()) cout << ",";
    cout << endl;
  }

  cout << "  }" << endl;
  cout << "}" << endl;
}
