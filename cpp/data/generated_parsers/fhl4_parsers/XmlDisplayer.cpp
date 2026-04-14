/* -----------------------------------------------------------------------------
 * XmlDisplayer.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <iostream>
using std::cout;
using std::endl;

#include <vector>
using std::vector;

#include "XmlDisplayer.hpp"

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
#include "Rule_HouseBillLine.hpp"
#include "Rule_HouseOriginAndDestination.hpp"
#include "Rule_HouseWaybillNumber.hpp"
#include "Rule_HousePieceCount.hpp"
#include "Rule_HouseWeightUnit.hpp"
#include "Rule_HouseWeight.hpp"
#include "Rule_DescriptionBlock.hpp"
#include "Rule_DescriptionTagLine.hpp"
#include "Rule_DescriptionContLine.hpp"
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

void* XmlDisplayer::visit(const Rule_FHL4* rule)
{
  if (!terminal) cout << endl;
  cout << "<FHL4>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</FHL4>";
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

void* XmlDisplayer::visit(const Rule_MasterBillLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<MasterBillLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</MasterBillLine>";
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

void* XmlDisplayer::visit(const Rule_MasterOriginAndDestination* rule)
{
  if (!terminal) cout << endl;
  cout << "<MasterOriginAndDestination>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</MasterOriginAndDestination>";
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

void* XmlDisplayer::visit(const Rule_MasterBillSummary* rule)
{
  if (!terminal) cout << endl;
  cout << "<MasterBillSummary>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</MasterBillSummary>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_MasterPieceCount* rule)
{
  if (!terminal) cout << endl;
  cout << "<MasterPieceCount>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</MasterPieceCount>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_MasterWeightUnit* rule)
{
  if (!terminal) cout << endl;
  cout << "<MasterWeightUnit>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</MasterWeightUnit>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_MasterWeight* rule)
{
  if (!terminal) cout << endl;
  cout << "<MasterWeight>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</MasterWeight>";
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

void* XmlDisplayer::visit(const Rule_HouseOriginAndDestination* rule)
{
  if (!terminal) cout << endl;
  cout << "<HouseOriginAndDestination>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</HouseOriginAndDestination>";
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

void* XmlDisplayer::visit(const Rule_HousePieceCount* rule)
{
  if (!terminal) cout << endl;
  cout << "<HousePieceCount>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</HousePieceCount>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_HouseWeightUnit* rule)
{
  if (!terminal) cout << endl;
  cout << "<HouseWeightUnit>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</HouseWeightUnit>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_HouseWeight* rule)
{
  if (!terminal) cout << endl;
  cout << "<HouseWeight>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</HouseWeight>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_DescriptionBlock* rule)
{
  if (!terminal) cout << endl;
  cout << "<DescriptionBlock>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</DescriptionBlock>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_DescriptionTagLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<DescriptionTagLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</DescriptionTagLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_DescriptionContLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<DescriptionContLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</DescriptionContLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ShipperBlock* rule)
{
  if (!terminal) cout << endl;
  cout << "<ShipperBlock>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ShipperBlock>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ShipperTagLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ShipperTagLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ShipperTagLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ShipperContLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ShipperContLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ShipperContLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ConsigneeBlock* rule)
{
  if (!terminal) cout << endl;
  cout << "<ConsigneeBlock>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ConsigneeBlock>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ConsigneeTagLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ConsigneeTagLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ConsigneeTagLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ConsigneeContLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ConsigneeContLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ConsigneeContLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_CvdLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<CvdLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</CvdLine>";
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
