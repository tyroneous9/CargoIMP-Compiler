/* -----------------------------------------------------------------------------
 * Visitor.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Tue Apr 14 23:40:11 CDT 2026
 *
 * -----------------------------------------------------------------------------
 */

#ifndef visitor_hpp
#define visitor_hpp

class Rule_FFM8;
class Rule_MessageHeader;
class Rule_FlightIdentificationLine;
class Rule_RouteLine;
class Rule_UldSection;
class Rule_AwbBlock;
class Rule_SupplementLine;
class Rule_ULDLine;
class Rule_AirWaybillLine;
class Rule_OsiLine;
class Rule_OciLine;
class Rule_CorLine;
class Rule_SlashQualifierLine;
class Rule_ContinuationLine;
class Rule_TrailerLine;
class Rule_MessageFunctionCode;
class Rule_CarrierFlightNumber;
class Rule_DayMonthTime;
class Rule_AircraftRegistration;
class Rule_MasterAirwayBillNumber;
class Rule_AirlinePrefix;
class Rule_AWBSerialNumber;
class Rule_OriginAndDestination;
class Rule_AirportCode;
class Rule_ULDIdentifier;
class Rule_ULDDetailText;
class Rule_ShipmentSummary;
class Rule_SummaryType;
class Rule_PieceCount;
class Rule_TotalPieceCount;
class Rule_WeightUnit;
class Rule_WeightValue;
class Rule_VolumeUnit;
class Rule_VolumeAmount;
class Rule_Month;
class Rule_FreeText;
class Rule_ULDChar;
class Rule_SummaryChar;
class Rule_QualifierToken;
class Rule_NoSlashChar;
class Rule_LineChar;
class Rule_Slant;
class Rule_Hyphen;
class Rule_Dot;
class Rule_Digit;
class Rule_Upper;
class Rule_AlphaNum;
class Rule_EOL;
class Terminal_StringValue;
class Terminal_NumericValue;

class Visitor
{
public:
  virtual void* visit(const Rule_FFM8* rule) = 0;
  virtual void* visit(const Rule_MessageHeader* rule) = 0;
  virtual void* visit(const Rule_FlightIdentificationLine* rule) = 0;
  virtual void* visit(const Rule_RouteLine* rule) = 0;
  virtual void* visit(const Rule_UldSection* rule) = 0;
  virtual void* visit(const Rule_AwbBlock* rule) = 0;
  virtual void* visit(const Rule_SupplementLine* rule) = 0;
  virtual void* visit(const Rule_ULDLine* rule) = 0;
  virtual void* visit(const Rule_AirWaybillLine* rule) = 0;
  virtual void* visit(const Rule_OsiLine* rule) = 0;
  virtual void* visit(const Rule_OciLine* rule) = 0;
  virtual void* visit(const Rule_CorLine* rule) = 0;
  virtual void* visit(const Rule_SlashQualifierLine* rule) = 0;
  virtual void* visit(const Rule_ContinuationLine* rule) = 0;
  virtual void* visit(const Rule_TrailerLine* rule) = 0;
  virtual void* visit(const Rule_MessageFunctionCode* rule) = 0;
  virtual void* visit(const Rule_CarrierFlightNumber* rule) = 0;
  virtual void* visit(const Rule_DayMonthTime* rule) = 0;
  virtual void* visit(const Rule_AircraftRegistration* rule) = 0;
  virtual void* visit(const Rule_MasterAirwayBillNumber* rule) = 0;
  virtual void* visit(const Rule_AirlinePrefix* rule) = 0;
  virtual void* visit(const Rule_AWBSerialNumber* rule) = 0;
  virtual void* visit(const Rule_OriginAndDestination* rule) = 0;
  virtual void* visit(const Rule_AirportCode* rule) = 0;
  virtual void* visit(const Rule_ULDIdentifier* rule) = 0;
  virtual void* visit(const Rule_ULDDetailText* rule) = 0;
  virtual void* visit(const Rule_ShipmentSummary* rule) = 0;
  virtual void* visit(const Rule_SummaryType* rule) = 0;
  virtual void* visit(const Rule_PieceCount* rule) = 0;
  virtual void* visit(const Rule_TotalPieceCount* rule) = 0;
  virtual void* visit(const Rule_WeightUnit* rule) = 0;
  virtual void* visit(const Rule_WeightValue* rule) = 0;
  virtual void* visit(const Rule_VolumeUnit* rule) = 0;
  virtual void* visit(const Rule_VolumeAmount* rule) = 0;
  virtual void* visit(const Rule_Month* rule) = 0;
  virtual void* visit(const Rule_FreeText* rule) = 0;
  virtual void* visit(const Rule_ULDChar* rule) = 0;
  virtual void* visit(const Rule_SummaryChar* rule) = 0;
  virtual void* visit(const Rule_QualifierToken* rule) = 0;
  virtual void* visit(const Rule_NoSlashChar* rule) = 0;
  virtual void* visit(const Rule_LineChar* rule) = 0;
  virtual void* visit(const Rule_Slant* rule) = 0;
  virtual void* visit(const Rule_Hyphen* rule) = 0;
  virtual void* visit(const Rule_Dot* rule) = 0;
  virtual void* visit(const Rule_Digit* rule) = 0;
  virtual void* visit(const Rule_Upper* rule) = 0;
  virtual void* visit(const Rule_AlphaNum* rule) = 0;
  virtual void* visit(const Rule_EOL* rule) = 0;

  virtual void* visit(const Terminal_StringValue* value) = 0;
  virtual void* visit(const Terminal_NumericValue* value) = 0;
};

#endif
/* -----------------------------------------------------------------------------
 * eof
 * -----------------------------------------------------------------------------
 */
