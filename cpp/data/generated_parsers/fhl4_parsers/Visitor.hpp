/* -----------------------------------------------------------------------------
 * Visitor.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:36:00 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef visitor_hpp
#define visitor_hpp

class Rule_FHL4;
class Rule_MessageHeader;
class Rule_MasterBillLine;
class Rule_MasterAirwayBillNumber;
class Rule_AirlinePrefix;
class Rule_AWBSerialNumber;
class Rule_MasterOriginAndDestination;
class Rule_AirportCode;
class Rule_MasterBillSummary;
class Rule_MasterPieceCount;
class Rule_MasterWeightUnit;
class Rule_MasterWeight;
class Rule_HouseBillLine;
class Rule_HouseOriginAndDestination;
class Rule_HouseWaybillNumber;
class Rule_HousePieceCount;
class Rule_HouseWeightUnit;
class Rule_HouseWeight;
class Rule_DescriptionBlock;
class Rule_DescriptionTagLine;
class Rule_DescriptionContLine;
class Rule_HtsBlock;
class Rule_HtsLine;
class Rule_OciBlock;
class Rule_OciLine;
class Rule_OciContLine;
class Rule_ShipperBlock;
class Rule_ShipperTagLine;
class Rule_ShipperContLine;
class Rule_ConsigneeBlock;
class Rule_ConsigneeTagLine;
class Rule_ConsigneeContLine;
class Rule_CvdLine;
class Rule_LineChar;
class Rule_EOL;
class Rule_Slant;
class Rule_Hyphen;
class Rule_Digit;
class Rule_Upper;
class Rule_AlphaNum;
class Terminal_StringValue;
class Terminal_NumericValue;

class Visitor
{
public:
  virtual void* visit(const Rule_FHL4* rule) = 0;
  virtual void* visit(const Rule_MessageHeader* rule) = 0;
  virtual void* visit(const Rule_MasterBillLine* rule) = 0;
  virtual void* visit(const Rule_MasterAirwayBillNumber* rule) = 0;
  virtual void* visit(const Rule_AirlinePrefix* rule) = 0;
  virtual void* visit(const Rule_AWBSerialNumber* rule) = 0;
  virtual void* visit(const Rule_MasterOriginAndDestination* rule) = 0;
  virtual void* visit(const Rule_AirportCode* rule) = 0;
  virtual void* visit(const Rule_MasterBillSummary* rule) = 0;
  virtual void* visit(const Rule_MasterPieceCount* rule) = 0;
  virtual void* visit(const Rule_MasterWeightUnit* rule) = 0;
  virtual void* visit(const Rule_MasterWeight* rule) = 0;
  virtual void* visit(const Rule_HouseBillLine* rule) = 0;
  virtual void* visit(const Rule_HouseOriginAndDestination* rule) = 0;
  virtual void* visit(const Rule_HouseWaybillNumber* rule) = 0;
  virtual void* visit(const Rule_HousePieceCount* rule) = 0;
  virtual void* visit(const Rule_HouseWeightUnit* rule) = 0;
  virtual void* visit(const Rule_HouseWeight* rule) = 0;
  virtual void* visit(const Rule_DescriptionBlock* rule) = 0;
  virtual void* visit(const Rule_DescriptionTagLine* rule) = 0;
  virtual void* visit(const Rule_DescriptionContLine* rule) = 0;
  virtual void* visit(const Rule_HtsBlock* rule) = 0;
  virtual void* visit(const Rule_HtsLine* rule) = 0;
  virtual void* visit(const Rule_OciBlock* rule) = 0;
  virtual void* visit(const Rule_OciLine* rule) = 0;
  virtual void* visit(const Rule_OciContLine* rule) = 0;
  virtual void* visit(const Rule_ShipperBlock* rule) = 0;
  virtual void* visit(const Rule_ShipperTagLine* rule) = 0;
  virtual void* visit(const Rule_ShipperContLine* rule) = 0;
  virtual void* visit(const Rule_ConsigneeBlock* rule) = 0;
  virtual void* visit(const Rule_ConsigneeTagLine* rule) = 0;
  virtual void* visit(const Rule_ConsigneeContLine* rule) = 0;
  virtual void* visit(const Rule_CvdLine* rule) = 0;
  virtual void* visit(const Rule_LineChar* rule) = 0;
  virtual void* visit(const Rule_EOL* rule) = 0;
  virtual void* visit(const Rule_Slant* rule) = 0;
  virtual void* visit(const Rule_Hyphen* rule) = 0;
  virtual void* visit(const Rule_Digit* rule) = 0;
  virtual void* visit(const Rule_Upper* rule) = 0;
  virtual void* visit(const Rule_AlphaNum* rule) = 0;

  virtual void* visit(const Terminal_StringValue* value) = 0;
  virtual void* visit(const Terminal_NumericValue* value) = 0;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
