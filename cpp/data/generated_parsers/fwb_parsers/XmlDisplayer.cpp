/* -----------------------------------------------------------------------------
 * XmlDisplayer.cpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:21:29 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#include <iostream>
using std::cout;
using std::endl;

#include <vector>
using std::vector;

#include "XmlDisplayer.hpp"

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
#include "Rule_AccountingTagLine.hpp"
#include "Rule_AccountingContLine.hpp"
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
#include "Rule_SupplementalLine.hpp"
#include "Rule_OsiBlock.hpp"
#include "Rule_OsiLine.hpp"
#include "Rule_OciBlock.hpp"
#include "Rule_OciLine.hpp"
#include "Rule_ContinuationLine.hpp"
#include "Rule_RefLine.hpp"
#include "Rule_SphLine.hpp"
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
#include "Rule_LineChar.hpp"
#include "Rule_EOL.hpp"
#include "Rule_Slant.hpp"
#include "Rule_Hyphen.hpp"
#include "Rule_Digit.hpp"
#include "Rule_Upper.hpp"
#include "Terminal_StringValue.hpp"
#include "Terminal_NumericValue.hpp"

void* XmlDisplayer::visit(const Rule_FWB17* rule)
{
  if (!terminal) cout << endl;
  cout << "<FWB17>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</FWB17>";
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

void* XmlDisplayer::visit(const Rule_AirWaybillLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<AirWaybillLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</AirWaybillLine>";
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

void* XmlDisplayer::visit(const Rule_TotalConsignmentSummary* rule)
{
  if (!terminal) cout << endl;
  cout << "<TotalConsignmentSummary>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</TotalConsignmentSummary>";
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

void* XmlDisplayer::visit(const Rule_TotalWeight* rule)
{
  if (!terminal) cout << endl;
  cout << "<TotalWeight>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</TotalWeight>";
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

void* XmlDisplayer::visit(const Rule_FlightBookingsLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<FlightBookingsLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</FlightBookingsLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_RoutingLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<RoutingLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</RoutingLine>";
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

void* XmlDisplayer::visit(const Rule_ShipperSubLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ShipperSubLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ShipperSubLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ShipperNameLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ShipperNameLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ShipperNameLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ShipperAddressLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ShipperAddressLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ShipperAddressLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ShipperLocationLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ShipperLocationLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ShipperLocationLine>";
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

void* XmlDisplayer::visit(const Rule_ConsigneeSubLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ConsigneeSubLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ConsigneeSubLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ConsigneeNameLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ConsigneeNameLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ConsigneeNameLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ConsigneeAddressLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ConsigneeAddressLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ConsigneeAddressLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ConsigneeLocationLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ConsigneeLocationLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ConsigneeLocationLine>";
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

void* XmlDisplayer::visit(const Rule_AgentLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<AgentLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</AgentLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_AgentTagLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<AgentTagLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</AgentTagLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_AgentContLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<AgentContLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</AgentContLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_AccountingLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<AccountingLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</AccountingLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_AccountingTagLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<AccountingTagLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</AccountingTagLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_AccountingContLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<AccountingContLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</AccountingContLine>";
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

void* XmlDisplayer::visit(const Rule_RatingLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<RatingLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</RatingLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_RatingTagLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<RatingTagLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</RatingTagLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_RatingContLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<RatingContLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</RatingContLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_OtherChargesLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<OtherChargesLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</OtherChargesLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_OtherChargesTagLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<OtherChargesTagLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</OtherChargesTagLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_OtherChargesContLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<OtherChargesContLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</OtherChargesContLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_PrepaidLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<PrepaidLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</PrepaidLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_PrepaidTagLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<PrepaidTagLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</PrepaidTagLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_PrepaidContLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<PrepaidContLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</PrepaidContLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_CertificationLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<CertificationLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</CertificationLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_IssuanceLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<IssuanceLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</IssuanceLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_SupplementalLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<SupplementalLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</SupplementalLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_OsiBlock* rule)
{
  if (!terminal) cout << endl;
  cout << "<OsiBlock>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</OsiBlock>";
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

void* XmlDisplayer::visit(const Rule_OciBlock* rule)
{
  if (!terminal) cout << endl;
  cout << "<OciBlock>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</OciBlock>";
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

void* XmlDisplayer::visit(const Rule_RefLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<RefLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</RefLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_SphLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<SphLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</SphLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_SsrLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<SsrLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</SsrLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_SsrTagLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<SsrTagLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</SsrTagLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_SsrContLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<SsrContLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</SsrContLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_NotifyBlock* rule)
{
  if (!terminal) cout << endl;
  cout << "<NotifyBlock>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</NotifyBlock>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_NotifySubLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<NotifySubLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</NotifySubLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_NotifyNameLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<NotifyNameLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</NotifyNameLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_NotifyAddressLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<NotifyAddressLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</NotifyAddressLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_NotifyLocationLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<NotifyLocationLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</NotifyLocationLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_NotifyContLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<NotifyContLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</NotifyContLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_ArdLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<ArdLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</ArdLine>";
  terminal = false;
  return NULL;
}

void* XmlDisplayer::visit(const Rule_SriLine* rule)
{
  if (!terminal) cout << endl;
  cout << "<SriLine>";
  terminal = false;
  visitRules(rule->rules);
  if (!terminal) cout << endl;
  cout << "</SriLine>";
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
