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
const { PARSED_TABLES_DIR, GOOGLE_SERVICE_ACCOUNT_FILE, TABLE_FILES } = require('../config/paths');
const { log } = require('../config/logger');
// ── Credentials ───────────────────────────────────────────────────────────────────
const CREDENTIALS_FILE = GOOGLE_SERVICE_ACCOUNT_FILE;
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
    file:          TABLE_FILES.mawb,
    spreadsheetId: '1jzyEDGNmtubDM0Uj1HIKEiy0bkSO2ad4r2Z6N95vpzs',
    sheetName:     'CFS_by_MAWB',
    clearRange:    'A:AZ',
    writeRange:    'A1',
  },
  uld: {
    file:          TABLE_FILES.uld,
    spreadsheetId: '1jzyEDGNmtubDM0Uj1HIKEiy0bkSO2ad4r2Z6N95vpzs',
    sheetName:     'CFS_by_ULD',
    clearRange:    'A:AZ',
    writeRange:    'A1',
  },
  hawb: {
    file:          TABLE_FILES.hawb,
    spreadsheetId: '1jzyEDGNmtubDM0Uj1HIKEiy0bkSO2ad4r2Z6N95vpzs',
    sheetName:     'CFS_by_HAWB',
    clearRange:    'A:AZ',
    writeRange:    'A1',
  },
};
// ── Auth ──────────────────────────────────────────────────────────────────────
async function getAuthClient() {
  const auth = new googleAuth.GoogleAuth({
    keyFile: CREDENTIALS_FILE,
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
// ── Sheet formatting ─────────────────────────────────────────────────────────
async function getSheetId(sheetsClient, spreadsheetId, sheetName) {
  const res = await sheetsClient.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets(properties(sheetId,title))',
  });
  const sheet = (res.data.sheets || []).find(s => s.properties?.title === sheetName);
  return sheet?.properties?.sheetId ?? null;
}
function normalizeHeaderName(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function findColumnIndex(headerRow, columnNameOrAliases) {
  if (!Array.isArray(headerRow)) return -1;

  const aliases = Array.isArray(columnNameOrAliases)
    ? columnNameOrAliases
    : [columnNameOrAliases];
  const normalizedAliases = new Set(aliases.map(normalizeHeaderName));

  return headerRow.findIndex((cell) => normalizedAliases.has(normalizeHeaderName(cell)));
}

function sortSpecsForKey(key, headerRow) {
  const sortColumnsByKey = {
    mawb: [['flight', 'FLIGHT#'], ['mawb', 'MAWB#']],
    uld: [['uld', 'pmc', 'PMC#'], ['flight', 'FLIGHT#'], ['mawb', 'MAWB#']],
    hawb: [['mawb', 'MAWB#'], ['hawb', 'HAWB#'], ['pmc', 'PMC#'], ['flight', 'FLIGHT#']],
  };

  return (sortColumnsByKey[key] || [])
    .map((columnName) => findColumnIndex(headerRow, columnName))
    .filter((dimensionIndex) => dimensionIndex >= 0)
    .map((dimensionIndex) => ({ dimensionIndex, sortOrder: 'ASCENDING' }));
}

async function applyGroupingFormatting(key, config, sheetsClient, values) {
  const sheetId = await getSheetId(sheetsClient, config.spreadsheetId, config.sheetName);
  if (sheetId == null || values.length < 2) return;

  const groupingColumnByKey = {
    hawb: { aliases: ['mawb', 'MAWB#'], label: 'MAWB' },
    uld: { aliases: ['uld', 'pmc', 'PMC#'], label: 'ULD' },
  };
  const grouping = groupingColumnByKey[key];
  if (!grouping) return;

  const groupColIndex = findColumnIndex(values[0], grouping.aliases);
  if (groupColIndex < 0) {
    log('warn', `[${key}] Could not find ${grouping.label} column; skipping grouping formatting`);
    return;
  }

  const color1 = { red: 1.0, green: 1.0, blue: 1.0 };
  const color2 = { red: 0.95, green: 0.95, blue: 0.98 };
  const requests = [];

  let currentColor = color1;
  let groupStartRow = 1;
  let currentGroupValue = String(values[1]?.[groupColIndex] || '').trim();

  for (let i = 1; i < values.length; i++) {
    const groupValue = String(values[i]?.[groupColIndex] || '').trim();
    if (groupValue !== currentGroupValue) {
      if (currentGroupValue) {
        requests.push({
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: groupStartRow,
              endRowIndex: i,
              startColumnIndex: 0,
              endColumnIndex: values[0].length,
            },
            cell: {
              userEnteredFormat: { backgroundColor: currentColor },
            },
            fields: 'userEnteredFormat.backgroundColor',
          },
        });
        currentColor = currentColor === color1 ? color2 : color1;
      }

      groupStartRow = i;
      currentGroupValue = groupValue;
    }
  }

  if (currentGroupValue) {
    requests.push({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: groupStartRow,
          endRowIndex: values.length,
          startColumnIndex: 0,
          endColumnIndex: values[0].length,
        },
        cell: {
          userEnteredFormat: { backgroundColor: currentColor },
        },
        fields: 'userEnteredFormat.backgroundColor',
      },
    });
  }

  if (requests.length > 0) {
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId: config.spreadsheetId,
      requestBody: { requests },
    });
    log('log', `[${key}] Applied ${grouping.label} grouping formatting (${requests.length} ${grouping.label} blocks)`);
  }
}

async function applySheetFormatting(key, config, sheetsClient, values, colCount) {
  const rowCount = values.length;
  const sheetId = await getSheetId(sheetsClient, config.spreadsheetId, config.sheetName);
  if (sheetId == null) {
    log('warn', `[${key}] Could not resolve sheetId for tab ${config.sheetName}; skipping formatting`);
    return;
  }
  if (rowCount <= 0 || colCount <= 0) {
    log('warn', `[${key}] No data range to format (rows=${rowCount}, cols=${colCount})`);
    return;
  }
  const requests = [
    {
      updateSheetProperties: {
        properties: {
          sheetId,
          gridProperties: {
            frozenRowCount: 1,
            frozenColumnCount: Math.min(3, colCount),
          },
        },
        fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount',
      },
    },
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: colCount,
        },
        cell: {
          userEnteredFormat: {
            textFormat: { bold: true },
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE',
            wrapStrategy: 'WRAP',
            backgroundColor: { red: 0.93, green: 0.96, blue: 1.0 },
          },
        },
        fields: 'userEnteredFormat(textFormat,horizontalAlignment,verticalAlignment,wrapStrategy,backgroundColor)',
      },
    },
    {
      autoResizeDimensions: {
        dimensions: {
          sheetId,
          dimension: 'COLUMNS',
          startIndex: 0,
          endIndex: colCount,
        },
      },
    },
    {
      setBasicFilter: {
        filter: {
          range: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: rowCount,
            startColumnIndex: 0,
            endColumnIndex: colCount,
          },
        },
      },
    },
  ];
  if (rowCount > 1) {
    const sortSpecs = sortSpecsForKey(key, values[0]);
    requests.push({
      sortRange: {
        range: {
          sheetId,
          startRowIndex: 1,
          endRowIndex: rowCount,
          startColumnIndex: 0,
          endColumnIndex: colCount,
        },
        sortSpecs,
      },
    });
  }
  await sheetsClient.spreadsheets.batchUpdate({
    spreadsheetId: config.spreadsheetId,
    requestBody: { requests },
  });
  log('log', `[${key}] Applied sheet formatting and sorting`);
}
// ── Upload one table ──────────────────────────────────────────────────────────
async function uploadTable(key, config, sheetsClient) {
  const csvPath = path.join(PARSED_TABLES_DIR, config.file);
  if (!fs.existsSync(csvPath)) {
    const msg = `[${key}] File not found: ${csvPath}`;
    log('error', msg);
    throw new Error(msg);
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
    valueInputOption:  'RAW',
    requestBody:       { values },
  });
  const colCount = values.reduce((max, row) => Math.max(max, row.length), 0);
  await applySheetFormatting(key, config, sheetsClient, values, colCount);
  // Apply alternating row groups for sheets that use a primary grouping column.
  if (key === 'hawb' || key === 'uld') {
    await applyGroupingFormatting(key, config, sheetsClient, values);
  }

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
