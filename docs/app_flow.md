# Backend App Flow

This document describes backend data flow in NCAParser, from IMAP extraction to API-facing report views.

## Scope

Covers:
- Backend service startup and API routing.
- Pipeline runner lifecycle.
- Email extraction, classification, parsing, normalization, and reporting projections.
- Error handling and where parse failures are stored.

## High-Level Architecture

```mermaid
flowchart TD
  A[IMAP mailbox] --> B[extract_to_db]
  B --> C[(emails_raw)]
  C --> D[parse_to_db]
  D --> E[cpp/build/parser_*_json binaries]
  E --> F[(messages_parsed)]
  F --> G[(normalized tables: ffm_*, fwb_*, fhl_*, mvt_event)]
  G --> H[(report_* and *_list views)]
  H --> I[/api/reports/*]
  C --> J[(mawb_notification_status)]
  J --> H
  F --> K[/api/messages/*]
  L[(pipeline_runs + pipeline_run_steps)] --> M[/api/pipeline/runs*]
```

## Backend Runtime Flow

1. HTTP server starts in `server/src/server.js`.
2. Express app is created in `server/src/app.js`.
3. API routes are mounted under `/api` in `server/src/routes/index.js`:
- `/health`
- `/pipeline`
- `/messages`
- `/reports`
4. DB pool is initialized in `server/config/db.js` and closed on `SIGINT` and `SIGTERM`.

## Pipeline Runtime Model

Pipeline entrypoint:
- `server/scripts/run_pipeline.js`

Core implementation:
- `server/scripts/pipeline/workflow.js`

Execution modes:
- `--once`: run a single cycle.
- default polling mode: periodic cycles using configured interval.
- `--force`: parse candidate selection changes (re-processes a limited batch of typed raw rows).

Run safety and observability:
- Single-process lock file: `server/data/logs/pipeline.lock.json`.
- Per-run JSON reports: `server/data/logs/pipeline-runs/`.
- DB run tracking: `pipeline_runs` and `pipeline_run_steps`.

## Step 1: `extract_to_db` (IMAP -> `emails_raw`)

### Incremental mailbox scan

Extraction is incremental by mailbox:
1. Read latest stored UID from `emails_raw` for the configured mailbox.
2. Search IMAP by UID range `latest_uid + 1 : *`.
3. Sort ascending by UID and apply `extractEmailLimit` (if configured).
4. Process UIDs in chunks (current chunk size is 200) to avoid oversized fetch requests.

This avoids full mailbox rescans on each run.

### Header-first classification

For each candidate message, the pipeline fetches envelope metadata first (`subject`, `from`, `to`, `internalDate`):
1. Detect body-parse message type from subject header form (`FFM/*`, `FWB/*`, `FHL/*`, `MVT`).
2. Detect subject-only notification events from subject patterns (`RCF`, `Arrival Notice`, `Delivery Complete`, `Ready For Pick Up`, `DLV`, `NFD`) with MAWB.
3. Skip only when neither a supported body-parse type nor a recognized notification is found.

### Conditional full MIME parsing

The full MIME source is fetched and parsed with `mailparser` only for supported body-parse types:
- body is normalized and persisted for parser input.
- sender/recipient are enriched from parsed MIME fields when available.

For subject-only notification emails:
- full MIME parsing is skipped.
- body remains `NULL`.
- notification metadata is persisted in `raw_json.recognizedNotification`.

### Persistence rule for raw emails

A row is upserted into `emails_raw` when either condition is true:
- recognized supported parser message type, or
- recognized notification subject event.

Persisted fields include:
- `mailbox`, `uid`
- `message_type` (nullable for notification-only messages)
- `subject`, `sender`, `received_at`
- `body` (nullable for notification-only messages)
- `raw_json` (includes `subjectMessageType` and `recognizedNotification` when applicable)

## Step 2: `parse_to_db` (`emails_raw` -> `messages_parsed`)

Candidate row selection:
- Normal mode: typed raw emails (`message_type IS NOT NULL`) that do not yet have a parse attempt (`NOT EXISTS` in `messages_parsed`).
- Force mode: typed raw emails ordered by `uid ASC` up to parse batch limit.

For each selected raw email:
1. Resolve message type from `emails_raw.message_type`.
2. Resolve parser binary from `PARSER_BINARIES`.
3. Execute parser binary with email body payload.
4. Insert parse attempt row into `messages_parsed`.

Parser result contract:
- `status`: `ok` or `error`
- `stdout`
- `stderr`
- parsed fields (`payload_json`) only when `status = ok`

### Parsed Payload Field Reference

This section describes the semantic meaning of parser output fields stored in `messages_parsed.payload_json`.

#### FFM payload fields

- `FlightIdentification`: flight-level header details.
- `FlightIdentification.MessagePageNumber`: message page index for multipart FFM.
- `FlightIdentification.CarrierFlightNumber`: carrier code + flight number.
- `FlightIdentification.ScheduledDepartureDateTime`: planned departure date/time text from the message.
- `FlightIdentification.ScheduledDepartureDate`: planned departure date token.
- `FlightIdentification.ScheduledDepartureTime`: planned departure time token.
- `FlightIdentification.DepartureAirportCode`: departure airport (board point).
- `FlightIdentification.AircraftRegistration`: aircraft registration/tail.
- `Routes[]`: ordered route legs.
- `Routes[].ArrivalAirportCode`: arrival airport for the leg.
- `Routes[].ScheduledArrivalDateTime`: leg arrival date/time text.
- `Routes[].ScheduledArrivalDate`: leg arrival date token.
- `Routes[].ScheduledArrivalClockTime`: leg arrival time token.
- `Routes[].ScheduledOnwardDepartureDateTime`: onward departure date/time text.
- `Routes[].ScheduledOnwardDepartureDate`: onward departure date token.
- `Routes[].ScheduledOnwardDepartureTime`: onward departure time token.
- `ULDs`: object keyed by ULD code.
- `ULDs[code].ULDDetailText`: free-text ULD details.
- `ULDs[code].ULDWeight`: ULD-level reported weight.
- `ULDs[code].ULDDetailCode`: ULD detail/type code.
- `ULDs[code].AWBs[]`: AWB entries loaded in the ULD.
- `AWBs[].MasterAirwayBillNumber`: MAWB number linked to this ULD.
- `AWBs[].OriginAndDestination`: AWB origin/destination token.
- `AWBs[].ShipmentSummary`: shipment summary token.
- `AWBs[].FreeText`: AWB free-text segment.
- `AWBs[].OSI[]`, `AWBs[].OCI[]`, `AWBs[].SCI[]`, `AWBs[].Qualifiers[]`, `AWBs[].Continuations[]`: supplemental line groups retained from the parser output.

#### FWB payload fields

- `MasterAirwayBillNumber`: MAWB identifier.
- `OriginAndDestination`: origin and destination airport pair token.
- `TotalPieceCount`: MAWB total pieces.
- `WeightUnit`: MAWB weight unit (for example `K` or `L`).
- `TotalWeight`: MAWB total weight.
- `VolumeUnit`: optional volume unit.
- `VolumeAmount`: optional volume value.
- `NatureOfGoods`: nature-of-goods text.
- `FlightBookings[]`: booked flight segments.
- `FlightBookings[].CarrierFlightNumber`: booked carrier flight number.
- `FlightBookings[].Day`: booked day token.
- `Routing[]`: routing legs.
- `Routing[].AirportCode`: airport code in route sequence.
- `Routing[].CarrierCode`: carrier code for that leg.
- `Shipper`: shipper party block.
- `Shipper.NameLine`: shipper name line (usually `NAM/...`).
- `Shipper.AddressLine`: shipper address line (usually `ADR/...`).
- `Shipper.LocationLine`: shipper location line (usually `LOC/...`).
- `Shipper.Continuations[]`: continuation lines for shipper block.
- `Consignee`: consignee party block.
- `Consignee.NameLine`: consignee name line (usually `NAM/...`).
- `Consignee.AddressLine`: consignee address line (usually `ADR/...`).
- `Consignee.LocationLine`: consignee location line (usually `LOC/...`).
- `Consignee.Continuations[]`: continuation lines for consignee block.
- `ChargesDeclaration`: charge declaration breakdown.
- `ChargesDeclaration.CurrencyCode`: charge currency.
- `ChargesDeclaration.WeightValuation`: weight valuation code.
- `ChargesDeclaration.OtherCharges`: other-charges code.
- `ChargesDeclaration.DeclaredValueForCarriage`: declared value for carriage.
- `ChargesDeclaration.DeclaredValueForCustoms`: declared value for customs.
- `ChargesDeclaration.InsuranceValue`: insurance value token.
- `AgentLine`, `AgentContinuations[]`, `AccountingLine`, `RatingLine`, `RatingContinuations[]`, `OtherChargesLine`, `OtherChargesContinuations[]`, `PrepaidLine`, `PrepaidContinuations[]`, `CertificationLine`, `IssuanceLine`, `OsiLines[]`, `OciLines[]`, `RefLines[]`, `SphLine`: additional declared segments preserved for diagnostics and later enrichment.

#### FHL payload fields

- `MasterAirwayBillNumber`: parent MAWB identifier.
- `MasterOriginAndDestination`: master origin/destination pair token.
- `MasterPieceCount`: master piece count.
- `MasterWeightUnit`: master weight unit.
- `MasterWeight`: master weight.
- `HouseBills[]`: house shipment groups.
- `HouseBills[].HouseOriginAndDestination`: house origin/destination pair token.
- `HouseBills[].HouseWaybillNumber`: HAWB number.
- `HouseBills[].HousePieceCount`: house piece count.
- `HouseBills[].HouseSlac`: SLAC token.
- `HouseBills[].HouseWeightUnit`: house weight unit.
- `HouseBills[].HouseWeight`: house weight.
- `HouseBills[].DescriptionLine`: house goods description line.
- `HouseBills[].DescriptionContinuations[]`: continuation lines for description.
- `HouseBills[].HtsLines[]`: HTS lines.
- `HouseBills[].OciLines[]`: OCI lines.
- `Shipper`: message-level shipper party block.
- `Shipper.ShipperLine`: shipper line (typically `SHP/...`).
- `Shipper.Continuations[]`: shipper continuation lines.
- `Consignee`: message-level consignee party block.
- `Consignee.ConsigneeLine`: consignee line (typically `CNE/...`).
- `Consignee.Continuations[]`: consignee continuation lines.
- `ChargesDeclaration`: charge declaration block.
- `ChargesDeclaration.CurrencyCode`: charge currency.
- `ChargesDeclaration.WeightValuation`: weight valuation code.
- `ChargesDeclaration.DeclaredValueForCarriage`: declared value for carriage.
- `ChargesDeclaration.DeclaredValueForCustoms`: declared value for customs.
- `ChargesDeclaration.InsuranceValue`: insurance value token.

#### MVT payload fields

- `EventType` or `MovementType`: movement event code (for example `EA`, `AA`, `DEP`, etc.).
- `CarrierFlightNumber` or `FlightNumber`: target flight number.
- `BoardPoint`: board/departure point.
- `OffPoint`: off/arrival point.
- `EventDateTime`: event date-time text.
- `EventDate`: event date token.
- `EventTime`: event time token.
- `Registration`: aircraft registration.
- `ServiceType`: service-type token.
- `DiversionAirportCode`: diversion airport when present.
- `DelayAirportCode`: delay airport when present.
- `DelayReasonCode`: delay reason code.
- `DelayDurationMinutes`: delay duration in minutes.

Transactional behavior:
- each parse write and normalization write happens inside a DB transaction (`BEGIN`/`COMMIT`, rollback on failure).

Important:
- Notification-only raw emails (`message_type IS NULL`) are not parsed by CIMP parsers.

## Step 3: Normalize Parsed Payloads (status = `ok` only)

When parse status is `ok`, `payload_json` is transformed into normalized relational tables.

FFM path:
- `ffm_flight`
- `ffm_route`
- `ffm_uld`
- `ffm_awb`

FWB path:
- `fwb_master`
- `fwb_flight_booking`
- `fwb_routing_leg`

FHL path:
- `fhl_master`
- `fhl_house`

MVT path:
- `mvt_event`

If parse status is `error`:
- no normalized rows are written.
- failure details remain in `messages_parsed.stderr`.

## Reporting and Query Projections

Views are defined in `db/schema.sql`.

Primary report/list views:
- `report_mawb`
- `report_hawb`
- `report_uld`
- `mawb_list`
- `hawb_list`
- `uld_list`

Notification rollup:
- `mawb_notification_status` is derived from `emails_raw.raw_json.recognizedNotification`.
- includes booleans such as `has_rcf`, `has_arrival_notice`, `has_delivery_complete`, `has_ready_for_pick_up`, `has_dlv`, `has_nfd`.
- `report_mawb` includes `has_arrival_notice` via join to notification status.

## API Data Access Flow

Health:
- `GET /api/health`
- validates DB reachability (simple DB query).

Pipeline runs:
- `GET /api/pipeline/runs`
- `GET /api/pipeline/runs/:id`
- reads from `pipeline_runs` and `pipeline_run_steps`.

Parsed messages and parse diagnostics:
- `GET /api/messages`
- `GET /api/messages/:id`
- joins `messages_parsed` with `emails_raw`.
- includes subject and parser status/error fields for diagnostics.

Reports:
- `GET /api/reports/mawbs`
- `GET /api/reports/ulds`
- `GET /api/reports/hawbs`
- `GET /api/reports/ulds-table`
- reads from report/list views.

## Subject Handling Summary

How subject is used:
- classification at extraction time for:
  - parser message type candidates (`FFM/*`, `FWB/*`, `FHL/*`, `MVT`), and
  - notification-only events (`RCF`, `Arrival Notice`, `Delivery Complete`, `Ready For Pick Up`, `DLV`, `NFD`) with MAWB.
- persisted to `emails_raw.subject`.
- returned in diagnostics via messages APIs.

How subject is not used:
- it does not directly choose a parser binary for rows without `message_type`.
- notification-only messages do not go through CIMP parser binaries.

## Error Storage and Access

Parser failures are persisted in `messages_parsed`:
- `status = error`
- `stderr` contains parser failure detail
- `stdout` retains parser output when present

Access paths:
- direct SQL on `messages_parsed`
- API queries such as `/api/messages?status=error` and `/api/messages/:id`

Pipeline step-level failures are tracked in:
- `pipeline_runs`
- `pipeline_run_steps`
- per-run JSON report files in `server/data/logs/pipeline-runs/`
