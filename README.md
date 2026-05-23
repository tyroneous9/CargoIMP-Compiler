# NCAParser

This repository contains these project components:

- `server/` - Node.js backend API and pipeline worker
- `client/` - Vite React frontend
- `db/` - SQL schema and initialization scripts
- `cpp/` - C++ parser binaries and grammar tooling
- `docs/` - project documentation and references

## Quick Start

### 1) Setup project

Install dependencies:
```bash
npm install
```

Setup database user from init:
Modify the init script by replacing the password placeholder (`{{DB_PASSWORD}}`) with your own password.
```bash
psql -h 127.0.0.1 -p 5432 -U postgres -d nca_cargo -f ./db/init.sql
```

Create database from schema:
```bash
psql -h 127.0.0.1 -p 5432 -U nca_cargo_user -d nca_cargo -f ./db/schema.sql
```

Schema updates:
When pulling backend/schema changes, re-run the same schema command above to apply new/updated views and idempotent table changes.

### 2) Run backend

```bash
npm run server:start
```

### 3) Run frontend

```bash
npm run client:dev
```

Frontend runs on Vite dev server and proxies `/api` calls to backend `http://127.0.0.1:3000`.

Current frontend pages:
- `/` (index)
- `/health`
- `/new-messages`
- `/hawb-table`
- `/mawb-table`
- `/uld-table`

## Useful Commands

- `npm run client:build`
- `npm run server:pipeline`
- `npm run server:pipeline:once`
- `npm run server:pipeline:force`

## Environment

- Backend runtime env file: `server/.env`
- Example env keys: `docs/.env.example`
- Required DB runtime keys for backend: `DB_USER`, `DB_PASSWORD`
