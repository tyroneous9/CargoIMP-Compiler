# NCAParser

NCAParser reads IATA Cargo-IMP teletype messages (FFM, FWB, FHL, MVT) from an airline mailbox, parses them with grammar-generated C++ parsers, normalizes them into PostgreSQL, and serves the results through an Express API to a React front end for day-to-day cargo operations (MAWB/HAWB/ULD tracking, office operations, pickup status).

## How it works

```
alimail (IMAP) → extract to DB → parse to DB (C++ binaries) → normalize → Postgres → REST API → React client
```

1. **Extract** (`extract_to_db`) — incrementally scan the IMAP mailbox by UID, classify each email from its subject line (parser types like `FFM/*`, `FWB/*`, `FHL/*`, `MVT`, or notification types like `RCF`/`Arrival Notice`/`DLV`/`NFD`). Successfully classified parser type emails additionally have their body text extracted and inserted into `emails_raw`.
2. **Parse** (`parse_to_db`) — for raw rows with a known `message_type`, run the matching C++ parser binary against the stored body and insert the result (`ok`/`error`, stdout/stderr, `payload_json`) into `messages_parsed`.
3. **Normalize** — on successful parses, decompose `payload_json` into per-type relational tables (`ffm_*`, `fwb_*`, `fhl_*`, `mvt_event`), all inside one DB transaction per message.
4. **Serve** — an Express API (`/api/pipeline`, `/api/messages`, `/api/reports`) reads from reporting views/tables in Postgres.
5. **Display/edit** — a React (Vite) client renders operational tables (MAWB, HAWB, ULD, office operations, pickup, breakdown manifest, new messages, parse errors) and can write back edits (e.g. AMS/notes/storage, pickup status, archive state) via `PATCH` endpoints.

The message type is always resolved from the message body/subject captured at extraction time, not re-guessed later — see [docs/app_flow.md](docs/app_flow.md) for the full backend data-flow spec, including the field-by-field parsed payload reference for FFM/FWB/FHL/MVT.

## Repository layout

```
cpp/                  Grammar-generated message parsers
  data/grammars/       ABNF grammars: ffm, fwb, fhl, mvt
  data/generated_parsers/  aParse-generated C++ (gitignored, built from grammars)
  data/input_tests/    Sample messages for each type
  src/                 Hand-written JSON extractor wrappers + CLI entrypoints
  scripts/             generate_parsers.sh (grammar -> generated C++), run_parser_with_input.sh
  tools/               aParse jars used to compile grammars into C++

server/               Express API + ingestion pipeline (npm workspace: ncaparser-server)
  src/
    server.js           HTTP entrypoint
    app.js               Express app wiring
    routes/              /api/pipeline, /api/messages, /api/reports
    controllers/         Request handling per route group
    services/            Business logic
    repositories/         SQL/query layer
    middleware/          error-handler, not-found
  scripts/
    run_pipeline.js       Pipeline orchestrator entrypoint (polling / --once / --force)
    pipeline/             workflow.js, parser-runner.js, normalizers.js, persistence.js, message-format.js
    migrate.js, migrate-baseline.js
  migrations/           node-pg-migrate migrations (schema evolution history)
  config/               db, env, imap, logger, messageTypes, parser, paths, pipeline
  data/                 Runtime output: raw emails, parsed JSON, logs, pipeline-run reports (gitignored)

client/               React + Vite front end (npm workspace: ncaparser-client)
  src/
    App.jsx              Path-based routing to each page
    pages/               IndexPage, NewMessagesPage, ParseErrorsPage, MawbTablePage, HawbTablePage,
                         UldTablePage, EmailXxxTablePage, OfficeOperationPage, PickupPage,
                         BreakdownManifestPage, NotFoundPage
    components/          DataTablePage.jsx (shared editable table component)
    constants/           Per-page column/table definitions
    lib/                 readJson.js, tableEdits.js (diff-based batch update builder)

db/                   PostgreSQL reference SQL
  schema.sql            Full schema/tables/views (source of truth for structure, also used by migrate-baseline)
  init.sql              One-time DB role/privilege setup for nca_cargo_user
  scripts.sql            Ad hoc reporting queries

docs/                 Design references
  app_flow.md           Authoritative backend data-flow spec (extraction -> parse -> normalize -> API)
  parsed-output-contract.md  (legacy) canonical parser JSON contract
  cimp-input-differences.md, CIMP-34thEdition2014.pdf/.txt  IATA Cargo-IMP format references
  todo.md               Working notes on in-progress/planned features
```

## Message types

| Type | Formats supported | Purpose |
|------|--------------------|---------|
| FFM  | FFM/4, FFM/5, FFM/8 | Freight manifest — flight, routing, ULDs, AWBs |
| FWB  | FWB/17 | Master air waybill (MAWB) details |
| FHL  | FHL/4, FHL/5 | House waybill (HAWB) details under a MAWB |
| MVT  | — | Flight movement events (actual departure/arrival times) |

Subject-only notification events (`RCF`, `Arrival Notice`, `Delivery Complete`, `Ready For Pick Up`, `DLV`, `NFD`) are also recognized and recorded against a MAWB without going through a CIMP parser; they roll up into `mawb_notification_status` / `has_*` flags used by the New Messages and MAWB pages.

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
./build/parser_mvt_json -file data/input_tests/mvt_test.txt
```

## Setup

This is an npm workspace with two packages: `server` and `client`.

```bash
npm install   # installs both workspaces from the repo root
```

### Environment

Create `server/.env` with:

```bash
ALIMAIL_NCA_USER=...     # IMAP mailbox user
ALIMAIL_NCA_PASS=...     # IMAP mailbox password
DB_USER=...              # Postgres role (see db/init.sql)
DB_PASSWORD=...
PARSER_VERSION=...       # optional, recorded alongside parse attempts
```

Postgres connection defaults (host `127.0.0.1`, port `5432`, database `nca_cargo`) are fixed in `server/config/db.js`. Provision the database and role first with `db/init.sql`, then apply schema via migrations (below).

### Database

Schema evolves through `node-pg-migrate` migrations in `server/migrations/`. `db/schema.sql` is a full reference snapshot of the resulting structure/views.

```bash
npm run db:migrate            # apply pending migrations
npm run db:migrate:down       # roll back one migration
npm run db:migrate:baseline   # baseline an existing DB against db/schema.sql
npm run db:migrate:create -- <name>   # scaffold a new migration
```

## Running

```bash
npm start              # start the Express API (server/src/server.js)
npm run dev             # start the Vite dev server for the client

npm run server:pipeline         # run the ingestion pipeline on a poll loop
npm run server:pipeline:once    # run one full pipeline cycle and exit
npm run server:pipeline:force   # run once, reprocessing a batch of already-typed raw rows
```

`run_pipeline.js` guards against overlapping runs with `server/data/logs/pipeline.lock.json`, retries each step once, and records both a per-run JSON report (`server/data/logs/pipeline-runs/`) and DB-tracked run/step rows (`pipeline_runs`, `pipeline_run_steps`).

## API

All routes are mounted under `/api` (`server/src/routes/index.js`):

- `GET /health` — DB reachability check
- `GET /pipeline/runs`, `GET /pipeline/runs/:id` — pipeline run history/detail
- `GET /messages`, `GET /messages/:id` — parsed messages + parse diagnostics (joins `messages_parsed` with `emails_raw`)
- `GET /reports/mawbs` / `/hawbs` / `/ulds` and their `-table` variants — reporting views backing each client page
- `GET /reports/new-messages`, `GET /reports/email-xxx-table` — notification/event rollups
- `GET /reports/office-operation-table`, `GET /reports/pickup-table`, `GET /reports/breakdown-manifest-table` — operational tables
- `PATCH .../batch`, `PATCH .../archive-status`, `PATCH new-messages/archive` — editable-table write-back used by the client's diff-based batch updates (`client/src/lib/tableEdits.js`)

See [docs/app_flow.md](docs/app_flow.md) for the full request/data flow, including which fields come from which parser payload.

## Known complexities

- **Subject vs. body mismatch**: a message's subject can claim one type (e.g. FFM8) while the body is actually another. Extraction classifies from the subject to pick a candidate type/parser, but notification-only messages never enter the CIMP parser path, and parse failures are preserved (`messages_parsed.status = 'error'`, `stderr`) rather than silently dropped.
- **HAWB-to-ULD linking**: when a MAWB is split across multiple ULDs, exact house-waybill-to-ULD weight/piece allocation is mathematically underdetermined from FFM/FHL data alone. ULD load-type classification (`loose` vs. `uld`) depends on whether every MAWB in the ULD has a matching FWB, which can change as FWB messages arrive out of order.
