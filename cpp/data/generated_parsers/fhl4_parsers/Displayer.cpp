/* -----------------------------------------------------------------------------
 * Displayer.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Wed Apr 15 00:18:54 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <iostream>
using std::cout;

#include <vector>
using std::vector;

#include "Displayer.hpp"

#include "Rule_FHL4.hpp"
#include "Rule_HouseBillGroup.hpp"
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

void* Displayer::visit(const Rule_FHL4* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_HouseBillGroup* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_MessageHeader* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_MasterBillLine* rule)
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

void* Displayer::visit(const Rule_MasterOriginAndDestination* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AirportCode* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_MasterBillSummary* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_MasterPieceCount* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_MasterWeightUnit* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_MasterWeight* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_HouseBillLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_HouseOriginAndDestination* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_HouseWaybillNumber* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_HousePieceCount* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_HouseWeightUnit* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_HouseWeight* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_DescriptionBlock* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_DescriptionTagLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_DescriptionContLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_HtsBlock* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_HtsLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_HtsContLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_OciBlock* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_OciLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_OciContLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ShipperBlock* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ShipperTagLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ShipperContLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ConsigneeBlock* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ConsigneeTagLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ConsigneeContLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_CvdLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_LineChar* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_EOL* rule)
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
