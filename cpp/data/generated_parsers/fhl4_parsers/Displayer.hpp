/* -----------------------------------------------------------------------------
 * Displayer.hpp
 * -----------------------------------------------------------------------------
 *
 * Producer : com.parse2.aparse.Parser 2.5
 * Produced : Mon Apr 13 21:33:05 CDT 2026
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
  void* visit(const Rule_FHL4* rule);
  void* visit(const Rule_MessageHeader* rule);
  void* visit(const Rule_MasterBillLine* rule);
  void* visit(const Rule_MasterAirwayBillNumber* rule);
  void* visit(const Rule_AirlinePrefix* rule);
  void* visit(const Rule_AWBSerialNumber* rule);
  void* visit(const Rule_MasterOriginAndDestination* rule);
  void* visit(const Rule_AirportCode* rule);
  void* visit(const Rule_MasterBillSummary* rule);
  void* visit(const Rule_MasterPieceCount* rule);
  void* visit(const Rule_MasterWeightUnit* rule);
  void* visit(const Rule_MasterWeight* rule);
  void* visit(const Rule_HouseBillLine* rule);
  void* visit(const Rule_HouseOriginAndDestination* rule);
  void* visit(const Rule_HouseWaybillNumber* rule);
  void* visit(const Rule_HousePieceCount* rule);
  void* visit(const Rule_HouseWeightUnit* rule);
  void* visit(const Rule_HouseWeight* rule);
  void* visit(const Rule_DescriptionBlock* rule);
  void* visit(const Rule_DescriptionTagLine* rule);
  void* visit(const Rule_DescriptionContLine* rule);
  void* visit(const Rule_ShipperBlock* rule);
  void* visit(const Rule_ShipperTagLine* rule);
  void* visit(const Rule_ShipperContLine* rule);
  void* visit(const Rule_ConsigneeBlock* rule);
  void* visit(const Rule_ConsigneeTagLine* rule);
  void* visit(const Rule_ConsigneeContLine* rule);
  void* visit(const Rule_CvdLine* rule);
  void* visit(const Rule_LineChar* rule);
  void* visit(const Rule_EOL* rule);
  void* visit(const Rule_Slant* rule);
  void* visit(const Rule_Hyphen* rule);
  void* visit(const Rule_Digit* rule);
  void* visit(const Rule_Upper* rule);
  void* visit(const Rule_AlphaNum* rule);

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
