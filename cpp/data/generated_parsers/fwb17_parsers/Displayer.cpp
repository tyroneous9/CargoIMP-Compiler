/* -----------------------------------------------------------------------------
 * Displayer.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <iostream>
using std::cout;

#include <vector>
using std::vector;

#include "Displayer.hpp"

#include "Rule_FWB17.hpp"
#include "Rule_MessageHeader.hpp"
#include "Rule_AirWaybillLine.hpp"
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
#include "Rule_IssuanceLine.hpp"
#include "Rule_IssuanceDate.hpp"
#include "Rule_Month.hpp"
#include "Rule_SupplementalLine.hpp"
#include "Rule_OsiLine.hpp"
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

void* Displayer::visit(const Rule_FWB17* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_MessageHeader* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AirWaybillLine* rule)
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

void* Displayer::visit(const Rule_TotalConsignmentSummary* rule)
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

void* Displayer::visit(const Rule_TotalWeight* rule)
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

void* Displayer::visit(const Rule_RoutingLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ShipperBlock* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ShipperSubLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ShipperNameLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ShipperAddressLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ShipperLocationLine* rule)
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

void* Displayer::visit(const Rule_ConsigneeSubLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ConsigneeNameLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ConsigneeAddressLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ConsigneeLocationLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_ConsigneeContLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AgentLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AgentTagLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_AgentContLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_CvdLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_RatingLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_RatingTagLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_RatingContLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_OtherChargesLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_OtherChargesTagLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_OtherChargesContLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_PrepaidLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_PrepaidTagLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_PrepaidContLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_IssuanceLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_IssuanceDate* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_Month* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_SupplementalLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_OsiLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_RefLine* rule)
{
  return visitRules(rule->rules);
}

void* Displayer::visit(const Rule_SphLine* rule)
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
