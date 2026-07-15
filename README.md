# NCAParser

NCAParser reads IATA Cargo-IMP teletype messages (FFM, FWB, FHL, MVT) from an airline mailbox, parses them with grammar-generated C++ parsers, and produces normalized cargo reporting tables (MAWB / HAWB / ULD) that are published to Google Sheets.

## How it works

```
alimail (IMAP) → extract → parse (C++ binaries) → build CSV tables → upload to Google Sheets
```

1. **Extract** — poll an IMAP mailbox, pull FFM/FWB/FHL/MVT messages, store raw subject + body locally.
2. **Parse** — pipe each message body into the matching C++ parser binary, which emits structured JSON. The message type is taken from the message body itself (`cimpType`), not the subject line, since the two can disagree.
3. **Build tables** — assemble the three reporting CSVs (MAWB, HAWB, ULD) from parsed JSON.
4. **Upload** — push the CSVs to Google Sheets via a service account.

The pipeline is idempotent and re-runnable: each stage only processes new/changed input, and a full `--REBUILD` mode is available to regenerate everything from the raw email archive.

## Repository layout

```
cpp/                  Grammar-generated message parsers
  data/grammars/       ABNF grammars: ffm, fwb, fhl, mvt
  data/generated_parsers/  aParse-generated C++ (gitignored, built from grammars)
  data/input_tests/    Sample messages for each type
  src/                 Hand-written JSON extractor wrappers + CLI entrypoints
  scripts/             generate_parsers.sh (grammar -> generated C++), run_parser_with_input.sh
  tools/               aParse jars used to compile grammars into C++

server/               Node.js pipeline + backend
  src/server.js         Express app exposing sample parser output for debugging
  scripts/              extract_emails, parse_extracted_emails, build_cfs_csv_*,
                         upload_tables_to_sheets, run_pipeline (orchestrator)
  config/               env, IMAP, logger, message types, path constants
  data/                 Runtime output: raw emails, parsed JSON, CSV tables, logs (gitignored)

db/                   PostgreSQL schema (nca_cargo) for normalized storage/reporting views
docs/                 Format references, parsed-output JSON contract, project notes
client/               Placeholder for a future front end (not currently wired into the pipeline)
```

## Message types

| Type | Formats supported | Purpose |
|------|--------------------|---------|
| FFM  | FFM/4, FFM/5, FFM/8 | Freight manifest — flight, routing, ULDs, AWBs |
| FWB  | FWB/17 | Master air waybill (MAWB) details |
| FHL  | FHL/4, FHL/5 | House waybill (HAWB) details under a MAWB |
| MVT  | — | Flight movement events (used for actual departure/arrival times) |

Parser output is normalized to a canonical JSON contract documented in [docs/parsed-output-contract.md](docs/parsed-output-contract.md), with backward-compatible handling for older/legacy field shapes.

## Building the parsers

Grammars live in `cpp/data/grammars/*.abnf`. To (re)generate the C++ parser sources for a grammar:

```bash
cd cpp
bash scripts/generate_parsers.sh data/grammars/fwb_grammar.abnf
```

Then configure and build all parser executables with CMake:

```bash
cd cpp
cmake -S . -B build
cmake --build build
```

This produces one executable per message type in `cpp/build/` (e.g. `parser_fwb_json`). Each can be run directly against a sample or real message:

```bash
./build/parser_fwb_json -file data/input_tests/fwb_test.txt
./build/parser_ffm_json -file data/input_tests/ffm_test.txt
./build/parser_fhl_json -file data/input_tests/fhl_test.txt
```

## Running the server pipeline

```bash
cd server
npm install
cp ../docs/.env.example_server .env   # fill in IMAP + DB credentials
```

Required environment variables (see `docs/.env.example_server`):

- `ALIMAIL_NCA_USER`, `ALIMAIL_NCA_PASS` — IMAP mailbox credentials
- `DB_USER`, `DB_PASSWORD` — PostgreSQL credentials
- A Google service account key at `server/config/google_service_account.json` (for Sheets upload)

### Pipeline commands

| Command | Description |
|---|---|
| `npm run pipeline` | Run the full pipeline on a poll loop |
| `npm run pipeline:once` | Run one full pipeline pass and exit |
| `npm run pipeline:force` | Run once, forcing downstream builds even with no new data |
| `npm run pipeline:rebuild` | Clear all cached output and rebuild everything from scratch |
| `npm run extract:emails` | Extract new emails from IMAP only |
| `npm run parse:emails` | Parse already-extracted emails only |
| `npm run build:mawb` / `build:uld` / `build:hawb` | Build individual reporting CSVs |
| `npm run upload:sheets` | Upload built CSVs to Google Sheets |
| `npm start` | Start the Express debug server (`/results/ffm|fwb|fhl`, `/health`) |

`run_pipeline.js` writes a structured JSON report per run to `server/data/logs/pipeline-runs/`, guards against overlapping runs with a PID lock file, and retries each step once on failure.

## Database

`db/schema.sql` defines a PostgreSQL schema (`nca_cargo`) with raw email storage, per-message-type normalized tables, and reporting views (`report_mawb`, `report_hawb`, `report_uld`) that mirror the CSV outputs for direct querying.

## Known issues

- **Subject vs. body mismatch**: a message's subject line can claim one type (e.g. FFM8) while the body is actually another (e.g. FWB17). The parse stage always validates/derives type from the body.
- **HAWB-to-ULD linking**: when a MAWB is split across multiple ULDs, exact house-waybill-to-ULD weight/piece allocation is mathematically underdetermined from FFM/FHL data alone. ULDs are classified as `loose` or `uld` load type based on whether every MAWB in the ULD has a matching FWB; this can change as FWB messages arrive out of order.
