# NCAParser

This repository contains these project components:

- `server/` - Node.js backend API and pipeline worker
- `client/` - Vite React frontend
- `db/` - SQL schema and initialization scripts
- `cpp/` - C++ parser binaries and grammar tooling
- `docs/` - project documentation and references

## Quick Start

### 1) Install dependencies

You can install dependencies per package:

```bash
cd server && npm install
cd ../client && npm install
```

Or from repo root (workspace-aware npm):

```bash
npm install
```

### 2) Run backend

```bash
npm run server:start
```

### 3) Run frontend

```bash
npm run client:dev
```

Frontend runs on Vite dev server and proxies `/api` calls to backend `http://127.0.0.1:3000`.

## Useful Commands

- `npm run client:build`
- `npm run server:pipeline`
- `npm run server:pipeline:once`
- `npm run server:pipeline:force`

## Environment

- Backend runtime env file: `server/.env`
- Example env keys: `docs/.env.example`
