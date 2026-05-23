# Backend App Flow

This document describes backend data flow in NCAParser, with emphasis on the pipeline from email extraction through database persistence.

## Scope

Covers:
- Backend service startup and API routing.
- Pipeline runner lifecycle.
- Email extraction, type detection, parsing, normalization, and reporting projections.
- Error handling and where parser failures are stored.

## High-Level Architecture

```mermaid
flowchart TD
  A[IMAP mailbox] --> B[server/scripts/run_pipeline.js extract_to_db]
  B --> C[(emails_raw)]
  C --> D[parse_to_db step]
  D --> E[cpp/build/parser_*_json binaries]
  E --> F[(messages_parsed)]
  F --> G[(normalized tables: ffm_*, fwb_*, fhl_*, mvt_event)]
  G --> H[(report_* and *_list views)]
  H --> I[/api/reports/*]
  F --> J[/api/messages/*]
  K[(pipeline_runs + pipeline_run_steps)] --> L[/api/pipeline/runs*]
```

## Backend Runtime Flow

1. HTTP server starts in server/src/server.js.
2. Express app is created in server/src/app.js.
3. API routes are mounted under /api in server/src/routes/index.js:
- /health
- /pipeline
- /messages
- /reports
4. DB pool is initialized by server/config/db.js and closed on SIGINT/SIGTERM.

## Pipeline Runtime Model

Pipeline implementation: server/scripts/run_pipeline.js.

Execution modes:
- --once: run a single cycle.
- default polling mode: periodic cycles using configured interval.
- --force: parse selection behavior changes (re-reads recent raw rows regardless of prior parse state).

Run safety and observability:
- Single-process lock file in server/data/logs/pipeline.lock.json.
- Per-run JSON report files in server/data/logs/pipeline-runs/.
- DB tracking in pipeline_runs and pipeline_run_steps.

## Step 1: extract_to_db (IMAP -> emails_raw)

### Source and parsing

For each fetched IMAP message:
1. Parse MIME using mailparser simpleParser.
2. Build normalized body:
- prefer text body
- fallback to html string
- normalize line endings

### Message type detection

Type detection uses body only:
- first body line is inspected
- CIMP header pattern like FFM/8, FWB/17, FHL/5
- MVT header literal MVT

Important:
- Subject is not used to detect message type.
- Subject is captured as metadata.

### Current persistence rule for raw emails

Only recognized message types are persisted.

If type is unrecognized:
- message is skipped
- warning is logged
- no row is inserted into emails_raw

If type is recognized:
- row is upserted into emails_raw with:
- mailbox, uid
- message_type
- subject
- sender
- received_at
- body
- raw_json

Table: emails_raw in db/schema.sql.

## Step 2: parse_to_db (emails_raw -> messages_parsed)

Candidate row selection:
- Normal mode: raw emails with no previous parse attempt.
- Force mode: latest rows by uid up to parse batch limit.

For each selected raw email:
1. Determine type from emails_raw.message_type (fallback to body detection if needed).
2. Resolve parser binary via PARSER_BINARIES map.
3. Execute parser binary with temp input file.

Parser result contract:
- status: ok or error
- stdout
- stderr
- parsed fields (only on ok)

Write parse attempt row into messages_parsed:
- parser_name, parser_version
- message_type
- status
- stderr, stdout
- result_json (always object)
- payload_json (required when status=ok)

Table: messages_parsed in db/schema.sql.

## Step 3: Normalize Parsed Payloads (status=ok only)

When parse status is ok, payload_json is transformed into normalized relational tables.

### FFM path
- ffm_flight
- ffm_route
- ffm_uld
- ffm_awb

### FWB path
- fwb_master
- fwb_flight_booking
- fwb_routing_leg

### FHL path
- fhl_master
- fhl_house

### MVT path
- mvt_event

If parse status is error:
- no normalized rows are written
- error remains queryable via messages_parsed.stderr

## Reporting and Query Projections

Reporting views are built from normalized tables filtered to successful parse lineage (mp.status = 'ok'):
- report_mawb
- report_hawb
- report_uld

Simple identifier list views:
- mawb_list
- hawb_list
- uld_list

Defined in db/schema.sql.

## API Data Access Flow

### Health
- GET /api/health
- Controller queries DB current time to prove DB reachability.

### Pipeline runs
- GET /api/pipeline/runs
- GET /api/pipeline/runs/:id
- Reads from pipeline_runs and pipeline_run_steps.

### Parsed messages and parse errors
- GET /api/messages
- GET /api/messages/:id
- Joins messages_parsed with emails_raw.
- Includes subject plus parse status/stderr for diagnostics.

### Reports
- GET /api/reports/mawbs
- GET /api/reports/ulds
- GET /api/reports/hawbs
- GET /api/reports/ulds-table
- Reads from report/list views.

## Subject Handling Summary

How subject is used:
- stored in emails_raw.subject
- returned by /api/messages endpoints for diagnostics and UI context

How subject is not used:
- not used for parser selection
- not used for message type detection
- not used for normalized persistence routing

Routing decisions are based on recognized body header type.

## Error Storage and Access

Parser and parse-step errors are persisted in messages_parsed:
- status = error
- stderr contains parser failure details
- stdout retains parser output (if any)

Access paths:
- SQL queries on messages_parsed
- API queries through /api/messages?status=error and /api/messages/:id

Pipeline run-level step failures are tracked separately in:
- pipeline_runs
- pipeline_run_steps
- plus JSON reports in server/data/logs/pipeline-runs
