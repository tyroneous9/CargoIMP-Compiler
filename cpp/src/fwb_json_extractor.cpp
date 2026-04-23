#include <iostream>
using std::cout;
using std::endl;

#include <string>
using std::string;

#include <vector>
using std::vector;

#include "fwb_json_extractor.hpp"

#include "Rule.hpp"
#include "Rule_FWB17.hpp"
#include "Rule_MessageHeader.hpp"
#include "Rule_MasterAirwayBillLine.hpp"
#include "Rule_MasterAirwayBillNumber.hpp"
#include "Rule_AirlinePrefix.hpp"
#include "Rule_AWBSerialNumber.hpp"
#include "Rule_OriginAndDestination.hpp"
#include "Rule_AirportCode.hpp"
#include "Rule_TotalConsignmentSummary.hpp"
#include "Rule_TotalPieceCount.hpp"
#include "Rule_WeightUnit.hpp"
#include "Rule_TotalWeight.hpp"
#include "Rule_VolumeUnit.hpp"
#include "Rule_VolumeAmount.hpp"
#include "Rule_FlightBookingsLine.hpp"
#include "Rule_RoutingLine.hpp"
#include "Rule_ShipperBlock.hpp"
#include "Rule_ShipperSubLine.hpp"
#include "Rule_ShipperNameLine.hpp"
#include "Rule_ShipperAddressLine.hpp"
#include "Rule_ShipperLocationLine.hpp"
#include "Rule_ShipperContLine.hpp"
#include "Rule_ConsigneeBlock.hpp"
#include "Rule_ConsigneeSubLine.hpp"
#include "Rule_ConsigneeNameLine.hpp"
#include "Rule_ConsigneeAddressLine.hpp"
#include "Rule_ConsigneeLocationLine.hpp"
#include "Rule_ConsigneeContLine.hpp"
#include "Rule_AgentLine.hpp"
#include "Rule_AgentTagLine.hpp"
#include "Rule_AgentContLine.hpp"
#include "Rule_AccountingLine.hpp"
#include "Rule_CvdLine.hpp"
#include "Rule_RatingLine.hpp"
#include "Rule_RatingTagLine.hpp"
#include "Rule_RatingContLine.hpp"
#include "Rule_OtherChargesLine.hpp"
#include "Rule_OtherChargesTagLine.hpp"
#include "Rule_OtherChargesContLine.hpp"
#include "Rule_PrepaidLine.hpp"
#include "Rule_PrepaidTagLine.hpp"
#include "Rule_PrepaidContLine.hpp"
#include "Rule_CertificationLine.hpp"
#include "Rule_IssuanceLine.hpp"
#include "Rule_SsrLine.hpp"
#include "Rule_SsrTagLine.hpp"
#include "Rule_SsrContLine.hpp"
#include "Rule_NotifyBlock.hpp"
#include "Rule_NotifySubLine.hpp"
#include "Rule_NotifyNameLine.hpp"
#include "Rule_NotifyAddressLine.hpp"
#include "Rule_NotifyLocationLine.hpp"
#include "Rule_NotifyContLine.hpp"
#include "Rule_ArdLine.hpp"
#include "Rule_SriLine.hpp"
#include "Rule_AccountingTagLine.hpp"
#include "Rule_AccountingContLine.hpp"
#include "Rule_SupplementalLine.hpp"
#include "Rule_OsiBlock.hpp"
#include "Rule_OsiLine.hpp"
#include "Rule_OciBlock.hpp"
#include "Rule_OciLine.hpp"
#include "Rule_ContinuationLine.hpp"
#include "Rule_RefLine.hpp"
#include "Rule_SphLine.hpp"
#include "Rule_LineChar.hpp"
#include "Rule_EOL.hpp"
#include "Rule_Slant.hpp"
#include "Rule_Hyphen.hpp"
#include "Rule_Digit.hpp"
#include "Rule_Upper.hpp"
#include "Terminal_StringValue.hpp"
#include "Terminal_NumericValue.hpp"

// --- root ---
void* Fwb17JsonExtractor::visit(const Rule_FWB17* rule)
{
  visitRules(rule->rules);
  printJson();
  return NULL;
}

// --- AWB identification ---
void* Fwb17JsonExtractor::visit(const Rule_MessageHeader* rule)       { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_MasterAirwayBillLine* rule)       { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_MasterAirwayBillNumber* rule) { masterAWB = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_AirlinePrefix* rule)        { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_AWBSerialNumber* rule)      { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_OriginAndDestination* rule) { originAndDest = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_AirportCode* rule)          { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_TotalConsignmentSummary* rule)
{
  totalConsignmentSummary = rule->spelling;
  return visitRules(rule->rules);
}
void* Fwb17JsonExtractor::visit(const Rule_TotalPieceCount* rule)      { totalPieceCount = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_WeightUnit* rule)           { weightUnit = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_TotalWeight* rule)          { totalWeight = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_VolumeUnit* rule)           { volumeUnit = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_VolumeAmount* rule)         { volumeAmount = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_FlightBookingsLine* rule)
{
  flightBookingsLines.push_back(rule->spelling);
  return NULL;
}

// --- Routing ---
void* Fwb17JsonExtractor::visit(const Rule_RoutingLine* rule) { routingLine = rule->spelling; return NULL; }

// --- Shipper ---
void* Fwb17JsonExtractor::visit(const Rule_ShipperBlock* rule)       { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_ShipperSubLine* rule)     { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_ShipperNameLine* rule)    { shipper.nameLine = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_ShipperAddressLine* rule) { shipper.addressLine = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_ShipperLocationLine* rule){ shipper.locationLine = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_ShipperContLine* rule)    { shipper.continuations.push_back(rule->spelling); return NULL; }

// --- Consignee ---
void* Fwb17JsonExtractor::visit(const Rule_ConsigneeBlock* rule)       { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_ConsigneeSubLine* rule)     { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_ConsigneeNameLine* rule)    { consignee.nameLine = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_ConsigneeAddressLine* rule) { consignee.addressLine = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_ConsigneeLocationLine* rule){ consignee.locationLine = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_ConsigneeContLine* rule)    { consignee.continuations.push_back(rule->spelling); return NULL; }

// --- Agent ---
void* Fwb17JsonExtractor::visit(const Rule_AgentLine* rule)    { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_AgentTagLine* rule) { agentTagLine = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_AgentContLine* rule){ agentContinuations.push_back(rule->spelling); return NULL; }

// --- Charges ---
void* Fwb17JsonExtractor::visit(const Rule_AccountingLine* rule) { accountingLine = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_CvdLine* rule) { cvdLine = rule->spelling; return NULL; }

// --- Rating ---
void* Fwb17JsonExtractor::visit(const Rule_RatingLine* rule)    { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_RatingTagLine* rule) { ratingTagLine = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_RatingContLine* rule){ ratingContinuations.push_back(rule->spelling); return NULL; }

// --- Other charges ---
void* Fwb17JsonExtractor::visit(const Rule_OtherChargesLine* rule)    { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_OtherChargesTagLine* rule) { otherChargesTagLine = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_OtherChargesContLine* rule){ otherChargesContinuations.push_back(rule->spelling); return NULL; }

// --- Prepaid ---
void* Fwb17JsonExtractor::visit(const Rule_PrepaidLine* rule)    { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_PrepaidTagLine* rule) { prepaidTagLine = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_PrepaidContLine* rule){ prepaidContinuations.push_back(rule->spelling); return NULL; }

// --- Certification / Issuance ---
void* Fwb17JsonExtractor::visit(const Rule_CertificationLine* rule) { certificationLine = rule->spelling; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_IssuanceLine* rule)
{
  issuanceLine = rule->spelling;
  return visitRules(rule->rules);
}
void* Fwb17JsonExtractor::visit(const Rule_AccountingTagLine* rule) { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_AccountingContLine* rule) { (void)rule; return NULL; }

// --- Supplemental lines ---
void* Fwb17JsonExtractor::visit(const Rule_SupplementalLine* rule) { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_OsiBlock* rule) { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_OsiLine* rule)
{
  activeSupplementalBlock = "OSI";
  osiLines.push_back(rule->spelling);
  return NULL;
}
void* Fwb17JsonExtractor::visit(const Rule_OciBlock* rule) { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_OciLine* rule)
{
  activeSupplementalBlock = "OCI";
  ociLines.push_back(rule->spelling);
  return NULL;
}
void* Fwb17JsonExtractor::visit(const Rule_ContinuationLine* rule)
{
  if (activeSupplementalBlock == "OSI") {
    osiLines.push_back(rule->spelling);
  } else if (activeSupplementalBlock == "OCI") {
    ociLines.push_back(rule->spelling);
  }
  return NULL;
}
void* Fwb17JsonExtractor::visit(const Rule_RefLine* rule)
{
  activeSupplementalBlock.clear();
  refLines.push_back(rule->spelling);
  return NULL;
}
void* Fwb17JsonExtractor::visit(const Rule_SphLine* rule)
{
  activeSupplementalBlock.clear();
  sphLine = rule->spelling;
  return NULL;
}
void* Fwb17JsonExtractor::visit(const Rule_SsrLine* rule)    { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_SsrTagLine* rule) { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_SsrContLine* rule){ (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_NotifyBlock* rule)        { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_NotifySubLine* rule)      { return visitRules(rule->rules); }
void* Fwb17JsonExtractor::visit(const Rule_NotifyNameLine* rule)     { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_NotifyAddressLine* rule)  { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_NotifyLocationLine* rule) { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_NotifyContLine* rule)     { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_ArdLine* rule) { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_SriLine* rule) { (void)rule; return NULL; }

// --- Char-level no-ops ---
void* Fwb17JsonExtractor::visit(const Rule_LineChar* rule) { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_EOL* rule)      { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_Slant* rule)    { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_Hyphen* rule)   { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_Digit* rule)    { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Rule_Upper* rule)    { (void)rule; return NULL; }
void* Fwb17JsonExtractor::visit(const Terminal_StringValue* value)  { (void)value; return NULL; }
void* Fwb17JsonExtractor::visit(const Terminal_NumericValue* value) { (void)value; return NULL; }

// --- Helpers ---
void* Fwb17JsonExtractor::visitRules(const vector<const Rule*>& rules)
{
  for (vector<const Rule*>::const_iterator it = rules.begin(); it != rules.end(); ++it)
    (*it)->accept(*this);
  return NULL;
}

string Fwb17JsonExtractor::trimTrailing(const string& input) const
{
  size_t end = input.size();
  while (end > 0 && (input[end-1] == '\n' || input[end-1] == '\r' || input[end-1] == ' ' || input[end-1] == '\t'))
    --end;
  return input.substr(0, end);
}

string Fwb17JsonExtractor::escapeJson(const string& input) const
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

string Fwb17JsonExtractor::jsonArray(const vector<string>& items) const
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

string Fwb17JsonExtractor::jsonParty(const Fwb17PartyData& p) const
{
  string out = "{\n";
  out += "      \"NameLine\": \""    + escapeJson(trimTrailing(p.nameLine))    + "\",\n";
  out += "      \"AddressLine\": \"" + escapeJson(trimTrailing(p.addressLine)) + "\",\n";
  out += "      \"LocationLine\": \""+ escapeJson(trimTrailing(p.locationLine))+ "\",\n";
  out += "      \"Continuations\": " + jsonArray(p.continuations)+ "\n";
  out += "    }";
  return out;
}

string Fwb17JsonExtractor::jsonFlightBookings() const
{
  string out = "[";
  bool firstObj = true;

  for (size_t i = 0; i < flightBookingsLines.size(); ++i)
  {
    const string line = trimTrailing(flightBookingsLines[i]);
    size_t start = 0;
    size_t end = line.find('/');
    vector<string> tokens;

    while (end != string::npos)
    {
      tokens.push_back(line.substr(start, end - start));
      start = end + 1;
      end = line.find('/', start);
    }
    tokens.push_back(line.substr(start));

    if (tokens.empty() || tokens[0] != "FLT") continue;

    for (size_t t = 1; t + 1 < tokens.size(); t += 2)
    {
      if (!firstObj) out += ", ";
      firstObj = false;
      out += "{\"CarrierFlightNumber\": \"" + escapeJson(tokens[t]) + "\", ";
      out += "\"Day\": \"" + escapeJson(tokens[t + 1]) + "\"}";
    }
  }

  out += "]";
  return out;
}

string Fwb17JsonExtractor::jsonRouting() const
{
  const string line = trimTrailing(routingLine);
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

  if (tokens.empty() || tokens[0] != "RTG") return "[]";

  string out = "[";
  bool first = true;
  for (size_t i = 1; i < tokens.size(); ++i)
  {
    const string token = tokens[i];
    const string airport = token.size() >= 3 ? token.substr(0, 3) : token;
    const string carrier = token.size() > 3 ? token.substr(3) : "";

    if (!first) out += ", ";
    first = false;
    out += "{\"AirportCode\": \"" + escapeJson(airport) + "\", ";
    out += "\"CarrierCode\": \"" + escapeJson(carrier) + "\"}";
  }
  out += "]";
  return out;
}

string Fwb17JsonExtractor::jsonChargesDeclaration() const
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

  if (tokens.size() < 7 || tokens[0] != "CVD") return "{}";

  string out = "{";
  out += "\"CurrencyCode\": \"" + escapeJson(tokens[1]) + "\", ";
  out += "\"WeightValuation\": \"" + escapeJson(tokens[2]) + "\", ";
  out += "\"OtherCharges\": \"" + escapeJson(tokens[3]) + "\", ";
  out += "\"DeclaredValueForCarriage\": \"" + escapeJson(tokens[4]) + "\", ";
  out += "\"DeclaredValueForCustoms\": \"" + escapeJson(tokens[5]) + "\", ";
  out += "\"InsuranceValue\": \"" + escapeJson(tokens[6]) + "\"";
  out += "}";
  return out;
}

void Fwb17JsonExtractor::printJson() const
{
  cout << "{" << endl;
  cout << "  \"MasterAirwayBillNumber\": \""   << escapeJson(trimTrailing(masterAWB))              << "\"," << endl;
  cout << "  \"OriginAndDestination\": \""      << escapeJson(trimTrailing(originAndDest))          << "\"," << endl;
  cout << "  \"TotalPieceCount\": \""           << escapeJson(trimTrailing(totalPieceCount))        << "\"," << endl;
  cout << "  \"WeightUnit\": \""                << escapeJson(trimTrailing(weightUnit))             << "\"," << endl;
  cout << "  \"TotalWeight\": \""               << escapeJson(trimTrailing(totalWeight))            << "\"," << endl;
  if (!volumeUnit.empty())
  {
    cout << "  \"VolumeUnit\": \""   << escapeJson(trimTrailing(volumeUnit))   << "\"," << endl;
    cout << "  \"VolumeAmount\": \"" << escapeJson(trimTrailing(volumeAmount)) << "\"," << endl;
  }
  cout << "  \"FlightBookings\": "         << jsonFlightBookings()                << "," << endl;
  cout << "  \"Routing\": "                << jsonRouting()                       << "," << endl;
  cout << "  \"Shipper\": "               << jsonParty(shipper)        << "," << endl;
  cout << "  \"Consignee\": "             << jsonParty(consignee)      << "," << endl;
  cout << "  \"AgentLine\": \""           << escapeJson(trimTrailing(agentTagLine))  << "\"," << endl;
  cout << "  \"AgentContinuations\": "    << jsonArray(agentContinuations)       << "," << endl;
  cout << "  \"AccountingLine\": \""      << escapeJson(trimTrailing(accountingLine)) << "\"," << endl;
  cout << "  \"ChargesDeclaration\": "    << jsonChargesDeclaration()            << "," << endl;
  cout << "  \"RatingLine\": \""          << escapeJson(trimTrailing(ratingTagLine)) << "\"," << endl;
  cout << "  \"RatingContinuations\": "   << jsonArray(ratingContinuations)      << "," << endl;
  cout << "  \"OtherChargesLine\": \""    << escapeJson(trimTrailing(otherChargesTagLine)) << "\"," << endl;
  cout << "  \"OtherChargesContinuations\": " << jsonArray(otherChargesContinuations) << "," << endl;
  cout << "  \"PrepaidLine\": \""         << escapeJson(trimTrailing(prepaidTagLine))<< "\"," << endl;
  cout << "  \"PrepaidContinuations\": "  << jsonArray(prepaidContinuations)     << "," << endl;
  cout << "  \"CertificationLine\": \""   << escapeJson(trimTrailing(certificationLine)) << "\"," << endl;
  cout << "  \"IssuanceLine\": \""        << escapeJson(trimTrailing(issuanceLine))  << "\"," << endl;
  cout << "  \"OsiLines\": "              << jsonArray(osiLines)       << "," << endl;
  cout << "  \"OciLines\": "              << jsonArray(ociLines)       << "," << endl;
  cout << "  \"RefLines\": "              << jsonArray(refLines)       << "," << endl;
  cout << "  \"SphLine\": \""             << escapeJson(trimTrailing(sphLine))       << "\"" << endl;
  cout << "}" << endl;
}
