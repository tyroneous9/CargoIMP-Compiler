/* -----------------------------------------------------------------------------
 * Visitor.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Sat Apr 18 18:43:25 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef visitor_hpp
#define visitor_hpp

class Rule_FWB17;
class Rule_MessageHeader;
class Rule_AirWaybillLine;
class Rule_MasterAirwayBillNumber;
class Rule_AirlinePrefix;
class Rule_AWBSerialNumber;
class Rule_OriginAndDestination;
class Rule_AirportCode;
class Rule_TotalConsignmentSummary;
class Rule_TotalPieceCount;
class Rule_WeightUnit;
class Rule_TotalWeight;
class Rule_VolumeUnit;
class Rule_VolumeAmount;
class Rule_FlightBookingsLine;
class Rule_RoutingLine;
class Rule_ShipperBlock;
class Rule_ShipperSubLine;
class Rule_ShipperNameLine;
class Rule_ShipperAddressLine;
class Rule_ShipperLocationLine;
class Rule_ShipperContLine;
class Rule_ConsigneeBlock;
class Rule_ConsigneeSubLine;
class Rule_ConsigneeNameLine;
class Rule_ConsigneeAddressLine;
class Rule_ConsigneeLocationLine;
class Rule_ConsigneeContLine;
class Rule_AgentLine;
class Rule_AgentTagLine;
class Rule_AgentContLine;
class Rule_AccountingLine;
class Rule_AccountingTagLine;
class Rule_AccountingContLine;
class Rule_CvdLine;
class Rule_RatingLine;
class Rule_RatingTagLine;
class Rule_RatingContLine;
class Rule_OtherChargesLine;
class Rule_OtherChargesTagLine;
class Rule_OtherChargesContLine;
class Rule_PrepaidLine;
class Rule_PrepaidTagLine;
class Rule_PrepaidContLine;
class Rule_CertificationLine;
class Rule_IssuanceLine;
class Rule_SupplementalLine;
class Rule_OsiBlock;
class Rule_OsiLine;
class Rule_OciBlock;
class Rule_OciLine;
class Rule_ContinuationLine;
class Rule_RefLine;
class Rule_SphLine;
class Rule_SsrLine;
class Rule_SsrTagLine;
class Rule_SsrContLine;
class Rule_NotifyBlock;
class Rule_NotifySubLine;
class Rule_NotifyNameLine;
class Rule_NotifyAddressLine;
class Rule_NotifyLocationLine;
class Rule_NotifyContLine;
class Rule_ArdLine;
class Rule_SriLine;
class Rule_LineChar;
class Rule_EOL;
class Rule_Slant;
class Rule_Hyphen;
class Rule_Digit;
class Rule_Upper;
class Terminal_StringValue;
class Terminal_NumericValue;

class Visitor
{
public:
  virtual void* visit(const Rule_FWB17* rule) = 0;
  virtual void* visit(const Rule_MessageHeader* rule) = 0;
  virtual void* visit(const Rule_AirWaybillLine* rule) = 0;
  virtual void* visit(const Rule_MasterAirwayBillNumber* rule) = 0;
  virtual void* visit(const Rule_AirlinePrefix* rule) = 0;
  virtual void* visit(const Rule_AWBSerialNumber* rule) = 0;
  virtual void* visit(const Rule_OriginAndDestination* rule) = 0;
  virtual void* visit(const Rule_AirportCode* rule) = 0;
  virtual void* visit(const Rule_TotalConsignmentSummary* rule) = 0;
  virtual void* visit(const Rule_TotalPieceCount* rule) = 0;
  virtual void* visit(const Rule_WeightUnit* rule) = 0;
  virtual void* visit(const Rule_TotalWeight* rule) = 0;
  virtual void* visit(const Rule_VolumeUnit* rule) = 0;
  virtual void* visit(const Rule_VolumeAmount* rule) = 0;
  virtual void* visit(const Rule_FlightBookingsLine* rule) = 0;
  virtual void* visit(const Rule_RoutingLine* rule) = 0;
  virtual void* visit(const Rule_ShipperBlock* rule) = 0;
  virtual void* visit(const Rule_ShipperSubLine* rule) = 0;
  virtual void* visit(const Rule_ShipperNameLine* rule) = 0;
  virtual void* visit(const Rule_ShipperAddressLine* rule) = 0;
  virtual void* visit(const Rule_ShipperLocationLine* rule) = 0;
  virtual void* visit(const Rule_ShipperContLine* rule) = 0;
  virtual void* visit(const Rule_ConsigneeBlock* rule) = 0;
  virtual void* visit(const Rule_ConsigneeSubLine* rule) = 0;
  virtual void* visit(const Rule_ConsigneeNameLine* rule) = 0;
  virtual void* visit(const Rule_ConsigneeAddressLine* rule) = 0;
  virtual void* visit(const Rule_ConsigneeLocationLine* rule) = 0;
  virtual void* visit(const Rule_ConsigneeContLine* rule) = 0;
  virtual void* visit(const Rule_AgentLine* rule) = 0;
  virtual void* visit(const Rule_AgentTagLine* rule) = 0;
  virtual void* visit(const Rule_AgentContLine* rule) = 0;
  virtual void* visit(const Rule_AccountingLine* rule) = 0;
  virtual void* visit(const Rule_AccountingTagLine* rule) = 0;
  virtual void* visit(const Rule_AccountingContLine* rule) = 0;
  virtual void* visit(const Rule_CvdLine* rule) = 0;
  virtual void* visit(const Rule_RatingLine* rule) = 0;
  virtual void* visit(const Rule_RatingTagLine* rule) = 0;
  virtual void* visit(const Rule_RatingContLine* rule) = 0;
  virtual void* visit(const Rule_OtherChargesLine* rule) = 0;
  virtual void* visit(const Rule_OtherChargesTagLine* rule) = 0;
  virtual void* visit(const Rule_OtherChargesContLine* rule) = 0;
  virtual void* visit(const Rule_PrepaidLine* rule) = 0;
  virtual void* visit(const Rule_PrepaidTagLine* rule) = 0;
  virtual void* visit(const Rule_PrepaidContLine* rule) = 0;
  virtual void* visit(const Rule_CertificationLine* rule) = 0;
  virtual void* visit(const Rule_IssuanceLine* rule) = 0;
  virtual void* visit(const Rule_SupplementalLine* rule) = 0;
  virtual void* visit(const Rule_OsiBlock* rule) = 0;
  virtual void* visit(const Rule_OsiLine* rule) = 0;
  virtual void* visit(const Rule_OciBlock* rule) = 0;
  virtual void* visit(const Rule_OciLine* rule) = 0;
  virtual void* visit(const Rule_ContinuationLine* rule) = 0;
  virtual void* visit(const Rule_RefLine* rule) = 0;
  virtual void* visit(const Rule_SphLine* rule) = 0;
  virtual void* visit(const Rule_SsrLine* rule) = 0;
  virtual void* visit(const Rule_SsrTagLine* rule) = 0;
  virtual void* visit(const Rule_SsrContLine* rule) = 0;
  virtual void* visit(const Rule_NotifyBlock* rule) = 0;
  virtual void* visit(const Rule_NotifySubLine* rule) = 0;
  virtual void* visit(const Rule_NotifyNameLine* rule) = 0;
  virtual void* visit(const Rule_NotifyAddressLine* rule) = 0;
  virtual void* visit(const Rule_NotifyLocationLine* rule) = 0;
  virtual void* visit(const Rule_NotifyContLine* rule) = 0;
  virtual void* visit(const Rule_ArdLine* rule) = 0;
  virtual void* visit(const Rule_SriLine* rule) = 0;
  virtual void* visit(const Rule_LineChar* rule) = 0;
  virtual void* visit(const Rule_EOL* rule) = 0;
  virtual void* visit(const Rule_Slant* rule) = 0;
  virtual void* visit(const Rule_Hyphen* rule) = 0;
  virtual void* visit(const Rule_Digit* rule) = 0;
  virtual void* visit(const Rule_Upper* rule) = 0;

  virtual void* visit(const Terminal_StringValue* value) = 0;
  virtual void* visit(const Terminal_NumericValue* value) = 0;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
