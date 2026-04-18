/* -----------------------------------------------------------------------------
 * Displayer.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef Displayer_hpp
#define Displayer_hpp

#include <vector>

#include "Visitor.hpp"

class Rule;

class Displayer : public Visitor
{
public:
  void* visit(const Rule_FWB17* rule);
  void* visit(const Rule_MessageHeader* rule);
  void* visit(const Rule_AirWaybillLine* rule);
  void* visit(const Rule_MasterAirwayBillNumber* rule);
  void* visit(const Rule_AirlinePrefix* rule);
  void* visit(const Rule_AWBSerialNumber* rule);
  void* visit(const Rule_OriginAndDestination* rule);
  void* visit(const Rule_AirportCode* rule);
  void* visit(const Rule_TotalConsignmentSummary* rule);
  void* visit(const Rule_TotalPieceCount* rule);
  void* visit(const Rule_WeightUnit* rule);
  void* visit(const Rule_TotalWeight* rule);
  void* visit(const Rule_VolumeUnit* rule);
  void* visit(const Rule_VolumeAmount* rule);
  void* visit(const Rule_FlightBookingsLine* rule);
  void* visit(const Rule_RoutingLine* rule);
  void* visit(const Rule_ShipperBlock* rule);
  void* visit(const Rule_ShipperSubLine* rule);
  void* visit(const Rule_ShipperNameLine* rule);
  void* visit(const Rule_ShipperAddressLine* rule);
  void* visit(const Rule_ShipperLocationLine* rule);
  void* visit(const Rule_ShipperContLine* rule);
  void* visit(const Rule_ConsigneeBlock* rule);
  void* visit(const Rule_ConsigneeSubLine* rule);
  void* visit(const Rule_ConsigneeNameLine* rule);
  void* visit(const Rule_ConsigneeAddressLine* rule);
  void* visit(const Rule_ConsigneeLocationLine* rule);
  void* visit(const Rule_ConsigneeContLine* rule);
  void* visit(const Rule_AgentLine* rule);
  void* visit(const Rule_AgentTagLine* rule);
  void* visit(const Rule_AgentContLine* rule);
  void* visit(const Rule_AccountingLine* rule);
  void* visit(const Rule_AccountingTagLine* rule);
  void* visit(const Rule_AccountingContLine* rule);
  void* visit(const Rule_CvdLine* rule);
  void* visit(const Rule_RatingLine* rule);
  void* visit(const Rule_RatingTagLine* rule);
  void* visit(const Rule_RatingContLine* rule);
  void* visit(const Rule_OtherChargesLine* rule);
  void* visit(const Rule_OtherChargesTagLine* rule);
  void* visit(const Rule_OtherChargesContLine* rule);
  void* visit(const Rule_PrepaidLine* rule);
  void* visit(const Rule_PrepaidTagLine* rule);
  void* visit(const Rule_PrepaidContLine* rule);
  void* visit(const Rule_CertificationLine* rule);
  void* visit(const Rule_IssuanceLine* rule);
  void* visit(const Rule_SupplementalLine* rule);
  void* visit(const Rule_OsiBlock* rule);
  void* visit(const Rule_OsiLine* rule);
  void* visit(const Rule_OciBlock* rule);
  void* visit(const Rule_OciLine* rule);
  void* visit(const Rule_ContinuationLine* rule);
  void* visit(const Rule_RefLine* rule);
  void* visit(const Rule_SphLine* rule);
  void* visit(const Rule_SsrLine* rule);
  void* visit(const Rule_SsrTagLine* rule);
  void* visit(const Rule_SsrContLine* rule);
  void* visit(const Rule_NotifyBlock* rule);
  void* visit(const Rule_NotifySubLine* rule);
  void* visit(const Rule_NotifyNameLine* rule);
  void* visit(const Rule_NotifyAddressLine* rule);
  void* visit(const Rule_NotifyLocationLine* rule);
  void* visit(const Rule_NotifyContLine* rule);
  void* visit(const Rule_ArdLine* rule);
  void* visit(const Rule_SriLine* rule);
  void* visit(const Rule_LineChar* rule);
  void* visit(const Rule_EOL* rule);
  void* visit(const Rule_Slant* rule);
  void* visit(const Rule_Hyphen* rule);
  void* visit(const Rule_Digit* rule);
  void* visit(const Rule_Upper* rule);

  void* visit(const Terminal_StringValue* value);
  void* visit(const Terminal_NumericValue* value);

private:
  void* visitRules(const std::vector<const Rule*>& rules);
};

#endif

/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
