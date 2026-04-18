# Parsed Output Contract

## Purpose

This document defines the canonical parsed-email JSON contract written by:

- `server/scripts/parse_extracted_emails.js`

It applies to all parsed files under:

- `server/data/outputs/parsed_emails/`

The parser stage normalizes fields to this contract even when legacy parser output is encountered.

## Top-Level Shape

```json
{
  "cimpType": "ffm|fwb|fhl",
  "status": "ok|error",
  "fields": { "...": "..." },
  "stderr": ""
}
```

For `status: "error"`, `fields` may be absent and `stdout` may be present.

## Canonical Rules

1. Structured fields are preferred over raw composite lines.
2. Redundant raw lines are removed once lossless structured fields exist.
3. Compatibility fallback is supported in the parser pipeline for older files.

## FFM Contract

### Canonical fields

- `MessageHeader`
- `FlightIdentification`:
  - `MessageFunctionCode`
  - `CarrierFlightNumber`
  - `DayMonthTime`
  - `BoardPoint`
  - `AircraftRegistration`
- `Routes`: array of
  - `AirportCode`
  - `RouteKind` (`Direct`, `TransitNIL`, `DestinationOnly`)
  - `ScheduledArrivalTime`
  - `ScheduledDepartureTime`
- `ULDs` map with AWBs containing decomposed fields

### Removed as redundant

- `AWBs[].AirWaybillLine`

### Backward compatibility handling

If legacy `FlightIdentificationLine` or `RouteLine` is found, the parser stage derives canonical `FlightIdentification` and `Routes`.

## FWB Contract

### Canonical fields

- `MasterAirwayBillNumber`
- `OriginAndDestination`
- `TotalPieceCount`
- `WeightUnit`
- `TotalWeight`
- optional: `VolumeUnit`, `VolumeAmount`
- `FlightBookings`: array of
  - `CarrierFlightNumber`
  - `Day`
- `Routing`: array of
  - `AirportCode`
  - `CarrierCode`
- `ChargesDeclaration`:
  - `CurrencyCode`
  - `WeightValuation`
  - `OtherCharges`
  - `DeclaredValueForCarriage`
  - `DeclaredValueForCustoms`
  - `InsuranceValue`
- existing party and supplemental fields (Shipper, Consignee, Agent, Accounting, Rating, OtherCharges, Prepaid, Certification, Issuance, OsiLines, OciLines, RefLines, SphLine)

### Removed as redundant

- `TotalConsignmentSummary`
- `FlightBookingsLine`
- `RoutingLine`
- `CvdLine`

### Backward compatibility handling

If legacy line-level fields are present, the parser stage derives canonical structured fields and drops the raw lines.

## FHL Contract

### Canonical fields

- `MasterAirwayBillNumber`
- `MasterOriginAndDestination`
- `MasterPieceCount`
- `MasterWeightUnit`
- `MasterWeight`
- `HouseBills[]` with decomposed house fields:
  - `HouseOriginAndDestination`
  - `HouseWaybillNumber`
  - `HousePieceCount`
  - `HouseWeightUnit`
  - `HouseWeight`
  - description/HTS/OCI fields
- `Shipper`
- `Consignee`
- `ChargesDeclaration`:
  - `CurrencyCode`
  - `WeightValuation`
  - `DeclaredValueForCarriage`
  - `DeclaredValueForCustoms`
  - `InsuranceValue`

### Removed as redundant

- `MasterBillLine`
- `MasterBillSummary`
- `HouseBills[].HouseBillLine`
- `CvdLine`

### Backward compatibility handling

If legacy redundant fields appear, the parser stage removes them after deriving canonical fields.

## Consumer Guidance

Consumers should read canonical structured fields first and avoid dependency on removed legacy raw-line fields.
