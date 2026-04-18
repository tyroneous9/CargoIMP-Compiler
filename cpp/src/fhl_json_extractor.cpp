#include <iostream>
using std::cout;
using std::endl;

#include <string>
using std::string;

#include <vector>
using std::vector;

#include "fhl_json_extractor.hpp"

#include "Rule.hpp"
#include "Rule_FHL4.hpp"
#include "Rule_MessageHeader.hpp"
#include "Rule_MasterBillLine.hpp"
#include "Rule_MasterAirwayBillNumber.hpp"
#include "Rule_AirlinePrefix.hpp"
#include "Rule_AWBSerialNumber.hpp"
#include "Rule_MasterOriginAndDestination.hpp"
#include "Rule_AirportCode.hpp"
#include "Rule_MasterBillSummary.hpp"
#include "Rule_MasterPieceCount.hpp"
#include "Rule_MasterWeightUnit.hpp"
#include "Rule_MasterWeight.hpp"
#include "Rule_HouseBillGroup.hpp"
#include "Rule_HouseBillLine.hpp"
#include "Rule_HouseOriginAndDestination.hpp"
#include "Rule_HouseWaybillNumber.hpp"
#include "Rule_HousePieceCount.hpp"
#include "Rule_HouseSlac.hpp"
#include "Rule_HouseWeightUnit.hpp"
#include "Rule_HouseWeight.hpp"
#include "Rule_DescriptionBlock.hpp"
#include "Rule_DescriptionTagLine.hpp"
#include "Rule_DescriptionContLine.hpp"
#include "Rule_HtsBlock.hpp"
#include "Rule_HtsLine.hpp"
#include "Rule_HtsContLine.hpp"
#include "Rule_OciBlock.hpp"
#include "Rule_OciLine.hpp"
#include "Rule_OciContLine.hpp"
#include "Rule_ShipperBlock.hpp"
#include "Rule_ShipperTagLine.hpp"
#include "Rule_ShipperContLine.hpp"
#include "Rule_ConsigneeBlock.hpp"
#include "Rule_ConsigneeTagLine.hpp"
#include "Rule_ConsigneeContLine.hpp"
#include "Rule_CvdLine.hpp"
#include "Rule_LineChar.hpp"
#include "Rule_EOL.hpp"
#include "Rule_Slant.hpp"
#include "Rule_Hyphen.hpp"
#include "Rule_Digit.hpp"
#include "Rule_Upper.hpp"
#include "Rule_AlphaNum.hpp"
#include "Terminal_StringValue.hpp"
#include "Terminal_NumericValue.hpp"

void* Fhl4JsonExtractor::visit(const Rule_FHL4* rule)
{
  visitRules(rule->rules);
  printJson();
  return NULL;
}

// --- Master bill ---
void* Fhl4JsonExtractor::visit(const Rule_MessageHeader* rule)         { (void)rule; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_MasterBillLine* rule)
{
  masterBillLine = rule->spelling;
  return visitRules(rule->rules);
}
void* Fhl4JsonExtractor::visit(const Rule_MasterAirwayBillNumber* rule){ masterAWB = rule->spelling; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_AirlinePrefix* rule)         { (void)rule; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_AWBSerialNumber* rule)       { (void)rule; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_MasterOriginAndDestination* rule) { masterOriginAndDestination = rule->spelling; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_AirportCode* rule)           { (void)rule; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_MasterBillSummary* rule)
{
  masterBillSummary = rule->spelling;
  return visitRules(rule->rules);
}
void* Fhl4JsonExtractor::visit(const Rule_MasterPieceCount* rule)      { masterPieceCount = rule->spelling; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_MasterWeightUnit* rule)      { masterWeightUnit = rule->spelling; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_MasterWeight* rule)          { masterWeight = rule->spelling; return NULL; }

// --- House bill group ---
void* Fhl4JsonExtractor::visit(const Rule_HouseBillGroup* rule)
{
  currentHouse = Fhl4HouseData();
  visitRules(rule->rules);
  houseBills.push_back(currentHouse);
  return NULL;
}

// --- House bill ---
void* Fhl4JsonExtractor::visit(const Rule_HouseBillLine* rule)
{
  currentHouse.houseBillLine = rule->spelling;
  return visitRules(rule->rules);
}
void* Fhl4JsonExtractor::visit(const Rule_HouseOriginAndDestination* rule) { currentHouse.houseOriginAndDestination = rule->spelling; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_HouseWaybillNumber* rule)        { currentHouse.houseWaybillNumber = rule->spelling; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_HousePieceCount* rule)           { currentHouse.housePieceCount = rule->spelling; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_HouseSlac* rule)                 { currentHouse.houseSlac = rule->spelling; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_HouseWeightUnit* rule)           { currentHouse.houseWeightUnit = rule->spelling; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_HouseWeight* rule)               { currentHouse.houseWeight = rule->spelling; return NULL; }

// --- Description ---
void* Fhl4JsonExtractor::visit(const Rule_DescriptionBlock* rule)    { return visitRules(rule->rules); }
void* Fhl4JsonExtractor::visit(const Rule_DescriptionTagLine* rule)  { currentHouse.descriptionTagLine = rule->spelling; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_DescriptionContLine* rule) { currentHouse.descriptionContinuations.push_back(rule->spelling); return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_HtsBlock* rule)            { return visitRules(rule->rules); }
void* Fhl4JsonExtractor::visit(const Rule_HtsLine* rule)             { currentHouse.htsLines.push_back(rule->spelling); return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_HtsContLine* rule)         { currentHouse.htsLines.push_back(rule->spelling); return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_OciBlock* rule)            { return visitRules(rule->rules); }
void* Fhl4JsonExtractor::visit(const Rule_OciLine* rule)             { currentHouse.ociLines.push_back(rule->spelling); return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_OciContLine* rule)         { currentHouse.ociLines.push_back(rule->spelling); return NULL; }

// --- Shipper ---
void* Fhl4JsonExtractor::visit(const Rule_ShipperBlock* rule)    { return visitRules(rule->rules); }
void* Fhl4JsonExtractor::visit(const Rule_ShipperTagLine* rule)  { shipper.tagLine = rule->spelling; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_ShipperContLine* rule) { shipper.continuations.push_back(rule->spelling); return NULL; }

// --- Consignee ---
void* Fhl4JsonExtractor::visit(const Rule_ConsigneeBlock* rule)    { return visitRules(rule->rules); }
void* Fhl4JsonExtractor::visit(const Rule_ConsigneeTagLine* rule)  { consignee.tagLine = rule->spelling; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_ConsigneeContLine* rule) { consignee.continuations.push_back(rule->spelling); return NULL; }

// --- CVD ---
void* Fhl4JsonExtractor::visit(const Rule_CvdLine* rule) { cvdLine = rule->spelling; return NULL; }

// --- Char-level no-ops ---
void* Fhl4JsonExtractor::visit(const Rule_LineChar* rule) { (void)rule; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_EOL* rule)      { (void)rule; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_Slant* rule)    { (void)rule; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_Hyphen* rule)   { (void)rule; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_Digit* rule)    { (void)rule; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_Upper* rule)    { (void)rule; return NULL; }
void* Fhl4JsonExtractor::visit(const Rule_AlphaNum* rule) { (void)rule; return NULL; }
void* Fhl4JsonExtractor::visit(const Terminal_StringValue* value)  { (void)value; return NULL; }
void* Fhl4JsonExtractor::visit(const Terminal_NumericValue* value) { (void)value; return NULL; }

// --- Helpers ---
void* Fhl4JsonExtractor::visitRules(const vector<const Rule*>& rules)
{
  for (vector<const Rule*>::const_iterator it = rules.begin(); it != rules.end(); ++it)
    (*it)->accept(*this);
  return NULL;
}

string Fhl4JsonExtractor::trimTrailing(const string& input) const
{
  size_t end = input.size();
  while (end > 0 && (input[end-1] == '\n' || input[end-1] == '\r' || input[end-1] == ' ' || input[end-1] == '\t'))
    --end;
  return input.substr(0, end);
}

string Fhl4JsonExtractor::escapeJson(const string& input) const
{
  string out;
  out.reserve(input.size());
  for (string::const_iterator it = input.begin(); it != input.end(); ++it)
  {
    const char c = *it;
    if      (c == '\\') out += "\\\\";
    else if (c == '"')  out += "\\\"";
    else if (c == '\n') out += "\\n";
    else if (c == '\r') out += "\\r";
    else if (c == '\t') out += "\\t";
    else out += c;
  }
  return out;
}

string Fhl4JsonExtractor::jsonArray(const vector<string>& items) const
{
  if (items.empty()) return "[]";
  string out = "[";
  for (size_t i = 0; i < items.size(); ++i)
  {
    if (i > 0) out += ", ";
    out += "\""; out += escapeJson(trimTrailing(items[i])); out += "\"";
  }
  out += "]";
  return out;
}

string Fhl4JsonExtractor::jsonParty(const Fhl4PartyData& p, const string& tagKey) const
{
  string out = "{\n";
  out += "      \"" + tagKey + "\": \"" + escapeJson(trimTrailing(p.tagLine)) + "\",\n";
  out += "      \"Continuations\": " + jsonArray(p.continuations) + "\n";
  out += "    }";
  return out;
}

string Fhl4JsonExtractor::jsonHouse(const Fhl4HouseData& h) const
{
  string out = "    {\n";
  out += "      \"HouseOriginAndDestination\": \"" + escapeJson(trimTrailing(h.houseOriginAndDestination)) + "\",\n";
  out += "      \"HouseWaybillNumber\": \""        + escapeJson(trimTrailing(h.houseWaybillNumber))        + "\",\n";
  out += "      \"HousePieceCount\": \""           + escapeJson(trimTrailing(h.housePieceCount))           + "\",\n";
  out += "      \"HouseSlac\": \""                 + escapeJson(trimTrailing(h.houseSlac))                 + "\",\n";
  out += "      \"HouseWeightUnit\": \""           + escapeJson(trimTrailing(h.houseWeightUnit))           + "\",\n";
  out += "      \"HouseWeight\": \""               + escapeJson(trimTrailing(h.houseWeight))               + "\",\n";
  out += "      \"DescriptionLine\": \""           + escapeJson(trimTrailing(h.descriptionTagLine))        + "\",\n";
  out += "      \"DescriptionContinuations\": "    + jsonArray(h.descriptionContinuations)                 + ",\n";
  out += "      \"HtsLines\": "                   + jsonArray(h.htsLines)                                 + ",\n";
  out += "      \"OciLines\": "                   + jsonArray(h.ociLines)                                 + "\n";
  out += "    }";
  return out;
}

string Fhl4JsonExtractor::jsonChargesDeclaration() const
{
  const string line = trimTrailing(cvdLine);
  vector<string> tokens;
  size_t start = 0;
  size_t end = line.find('/');

  while (end != string::npos)
  {
    tokens.push_back(line.substr(start, end - start));
    start = end + 1;
    end = line.find('/', start);
  }
  tokens.push_back(line.substr(start));

  if (tokens.size() < 6 || tokens[0] != "CVD") return "{}";

  string out = "{";
  out += "\"CurrencyCode\": \"" + escapeJson(tokens[1]) + "\", ";
  out += "\"WeightValuation\": \"" + escapeJson(tokens[2]) + "\", ";
  out += "\"DeclaredValueForCarriage\": \"" + escapeJson(tokens[3]) + "\", ";
  out += "\"DeclaredValueForCustoms\": \"" + escapeJson(tokens[4]) + "\", ";
  out += "\"InsuranceValue\": \"" + escapeJson(tokens[5]) + "\"";
  out += "}";
  return out;
}

void Fhl4JsonExtractor::printJson() const
{
  cout << "{" << endl;
  cout << "  \"MasterAirwayBillNumber\": \""    << escapeJson(trimTrailing(masterAWB))            << "\"," << endl;
  cout << "  \"MasterOriginAndDestination\": \"" << escapeJson(trimTrailing(masterOriginAndDestination)) << "\"," << endl;
  cout << "  \"MasterPieceCount\": \""          << escapeJson(trimTrailing(masterPieceCount))     << "\"," << endl;
  cout << "  \"MasterWeightUnit\": \""          << escapeJson(trimTrailing(masterWeightUnit))     << "\"," << endl;
  cout << "  \"MasterWeight\": \""              << escapeJson(trimTrailing(masterWeight))         << "\"," << endl;

  // Output all house-bill groups as an array.
  cout << "  \"HouseBills\": [" << endl;
  for (size_t i = 0; i < houseBills.size(); ++i)
  {
    cout << jsonHouse(houseBills[i]);
    if (i + 1 < houseBills.size()) cout << ",";
    cout << endl;
  }
  cout << "  ]," << endl;

  cout << "  \"Shipper\": "   << jsonParty(shipper,   "ShipperLine")   << "," << endl;
  cout << "  \"Consignee\": " << jsonParty(consignee, "ConsigneeLine") << "," << endl;
  cout << "  \"ChargesDeclaration\": " << jsonChargesDeclaration() << endl;
  cout << "}" << endl;
}
