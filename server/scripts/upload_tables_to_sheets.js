#!/usr/bin/env node
/**
 * upload_tables_to_sheets.js
 *
 * Uploads CSV tables from parsed_tables/ to their configured Google Sheets
 * destinations using the Google Sheets API v4.
 *
 * Auth: Service Account
 *   Setup (one time):
 *     1. Google Cloud Console → IAM & Admin → Service Accounts → Create
 *     2. Keys → Add Key → JSON → save as server/config/google_service_account.json
 *     3. Share the target Google Sheet with the service account email → Editor
 *     4. Set GOOGLE_SERVICE_ACCOUNT_FILE in .env (see below)
 *   No browser auth, no token files, no expiry to manage.
 *
 * Usage:
 *   node upload_tables_to_sheets.js              # upload all configured tables
 *   node upload_tables_to_sheets.js mawb         # upload only the 'mawb' table
 *   node upload_tables_to_sheets.js mawb uld     # upload specific tables
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { auth: googleAuth, sheets: sheetsFactory } = require('@googleapis/sheets');
const { PARSED_TABLES_DIR, ENV_FILE } = require('../config/paths');
const { log } = require('../config/logger');

// ── Load environment ──────────────────────────────────────────────────────────

require('dotenv').config({ path: ENV_FILE });

const CREDENTIALS_FILE = process.env.GOOGLE_SERVICE_ACCOUNT_FILE;

if (!CREDENTIALS_FILE) {
  log('error', 'GOOGLE_SERVICE_ACCOUNT_FILE is not set in .env');
  process.exit(1);
}

// ── Table → Sheet map ─────────────────────────────────────────────────────────

/**
 * Each entry defines one CSV-to-sheet upload target.
 *
 * Fields:
 *   file        — filename inside parsed_tables/ (must match what the build script writes)
 *   spreadsheetId — the Google Sheets ID from the sheet URL:
 *                   https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit
 *   sheetName   — the tab name within the spreadsheet to write to
 *   clearRange  — the range to clear before writing (how many columns to clear?)
 *   writeRange  — the top-left cell to start writing from
 */
const TABLE_MAP = {
  mawb: {
    file:          'CFS - output-mawb.csv',
    spreadsheetId: '1jzyEDGNmtubDM0Uj1HIKEiy0bkSO2ad4r2Z6N95vpzs',
    sheetName:     'CFS_by_MAWB',
    clearRange:    'A:AG',   // 33 columns
    writeRange:    'A1',
  },
  uld: {
    file:          'CFS - output-uld.csv',
    spreadsheetId: '1jzyEDGNmtubDM0Uj1HIKEiy0bkSO2ad4r2Z6N95vpzs',
    sheetName:     'CFS_by_ULD',
    clearRange:    'A:AG',   // 33 columns
    writeRange:    'A1',
  },
};

// ── Auth ──────────────────────────────────────────────────────────────────────

async function getAuthClient() {
  const keyFile = path.isAbsolute(CREDENTIALS_FILE)
    ? CREDENTIALS_FILE
    : path.resolve(path.dirname(ENV_FILE), CREDENTIALS_FILE);

  const auth = new googleAuth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth.getClient();
}

// ── CSV → 2D array ────────────────────────────────────────────────────────────

function parseCsv(csvText) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];

    if (inQuotes) {
      if (ch === '"' && csvText[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else if (ch === '\r') {
      // skip bare CR
    } else {
      field += ch;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  // Drop trailing empty row that may result from trailing newline
  if (rows.length && rows[rows.length - 1].every(c => c === '')) rows.pop();
  return rows;
}

// ── Upload one table ──────────────────────────────────────────────────────────

async function uploadTable(key, config, sheetsClient) {
  const csvPath = path.join(PARSED_TABLES_DIR, config.file);

  if (!fs.existsSync(csvPath)) {
    log('warn', `[${key}] File not found, skipping: ${csvPath}`);
    return;
  }

  const values = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const sheetRef = `'${config.sheetName}'`;

  log('log', `[${key}] Clearing ${sheetRef}!${config.clearRange} …`);
  await sheetsClient.spreadsheets.values.clear({
    spreadsheetId: config.spreadsheetId,
    range:         `${sheetRef}!${config.clearRange}`,
  });

  log('log', `[${key}] Writing ${values.length} rows → ${sheetRef}!${config.writeRange} …`);
  await sheetsClient.spreadsheets.values.update({
    spreadsheetId:     config.spreadsheetId,
    range:             `${sheetRef}!${config.writeRange}`,
    valueInputOption:  'USER_ENTERED',
    requestBody:       { values },
  });

  log('log', `[${key}] Done — ${values.length - 1} data rows uploaded.`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const authClient  = await getAuthClient();
  const sheetsClient = sheetsFactory({ version: 'v4', auth: authClient });

  const targets = process.argv.slice(2);
  const keys = targets.length > 0 ? targets : Object.keys(TABLE_MAP);

  for (const key of keys) {
    const config = TABLE_MAP[key];
    if (!config) {
      log('error', `Unknown table key "${key}". Available: ${Object.keys(TABLE_MAP).join(', ')}`);
      process.exit(1);
    }
    await uploadTable(key, config, sheetsClient);
  }
}

main().catch(err => {
  log('error', `Upload failed: ${err.message}`);
  process.exit(1);
});
