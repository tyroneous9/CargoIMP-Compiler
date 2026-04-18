#!/usr/bin/env node
/**
 * build_cfs_csv_mawb.js
 *
 * Generates CFS tracking CSV from parsed CIMP email outputs.
 * One row per MAWB. HAWB column excluded.
 *
 * FFM merge rules:
 *   - Same (flightNum, flightDate): union all ULDs, take POB from T-value in summary
 *   - Truly different flights for same MAWB: use the flight group with highest email UID
 *
 * LFD = departure date from FlightIdentificationLine + 2 calendar days
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { PARSED_EMAILS_DIR, PARSED_TABLES_DIR } = require('../config/paths');
const { log } = require('../config/logger');

const OUTPUT_CSV = path.join(PARSED_TABLES_DIR, 'CFS_mawb.csv');

// ── CSV header ────────────────────────────────────────────────────────────────

const HEADERS = [
  'FLIGHT#', 'PMC#', 'MAWB#', 'STA', 'ATA', 'LFD', 'Weight', 'TTL PCS', 'POB',
  'PCS RCVD', 'PMC\nLOCATION', 'Consignee', 'AMS\nSTATUS',
  'P3', 'Trucking/Skid $', 'Storage', 'ISC',
  'Tolead→NCA\nRCF MESSAGE', 'Tolead→NCA\nNFD MESSAGE', 'Tolead→NCA\nDLV MESSAGE',
  'Tolead→Customer\nCargo Arrive Email', 'Tolead→Customer\nCargo Ready Email',
  'Tolead→Customer\nCargo Deliver Email',
  'Truck arrives at NCA location', 'Truck departs from NCA',
  'Truck arrives at Tolead location', 'Truck offloading complete',
  'Break down start', 'Break down complete',
  'Ready for pick-up', 'Cargo delivery', 'POD', 'PTT/DO', 'Note',
];

// ── Date helpers ──────────────────────────────────────────────────────────────

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function parseDDMON(s) {
  const m = s && s.match(/^(\d{2})([A-Z]{3})/);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const mon = MONTHS.indexOf(m[2]);
  if (mon < 0) return null;
  const now = new Date();
  let year = now.getFullYear();
  if (mon > now.getMonth() + 6) year--;
  return new Date(year, mon, day);
}

function formatDDMON(d) {
  return String(d.getDate()).padStart(2, '0') + MONTHS[d.getMonth()];
}

function addDays(d, n) {
  return new Date(d.getTime() + n * 86400000);
}

// ── Summary parser ────────────────────────────────────────────────────────────

/**
 * Parse ShipmentSummary — two known formats:
 *   Format 1 (no ULD split):  "T121K2159MC9.37"    → total=121
 *   Format 2 (split ULDs):    "S19K490.2MC2.28T75"  → piecesInUld=19, total=75
 */
function parseShipmentSummary(s) {
  const sIn  = s.match(/^S(\d+)/);
  const tEnd = s.match(/T(\d+)$/);
  const tStr = s.match(/^T(\d+)/);
  return {
    piecesInUld: sIn  ? parseInt(sIn[1], 10)  : tStr ? parseInt(tStr[1], 10) : null,
    totalOnMawb: tEnd ? parseInt(tEnd[1], 10) : tStr ? parseInt(tStr[1], 10) : null,
  };
}

// ── CSV formatter ─────────────────────────────────────────────────────────────

function csvEscape(v) {
  const s = v == null ? '' : String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function csvRow(fields) {
  return fields.map(csvEscape).join(',');
}

// ── Build indices ─────────────────────────────────────────────────────────────

const ffmIndex = new Map();  // mawb → Map<flightKey, { maxUid, flightNum, sta, lfd, pmcs: Map<uldKey, {uid, pob}> }>
const fwbIndex = new Map();  // mawb → { uid, weight, weightUnit, pieces, consignee }
const fhlIndex = new Map();  // mawb → { uid, masterPieces, masterWeight, masterWeightUnit, consignee }

fs.mkdirSync(PARSED_EMAILS_DIR, { recursive: true });

const filenames = fs.readdirSync(PARSED_EMAILS_DIR)
  .filter(f => f.endsWith('.json'))
  .sort();

for (const filename of filenames) {
  const doc = JSON.parse(fs.readFileSync(path.join(PARSED_EMAILS_DIR, filename), 'utf8'));
  if (doc.status !== 'ok') continue;

  const uidMatch = filename.match(/uid-(\d+)/);
  const uid = uidMatch ? parseInt(uidMatch[1], 10) : 0;
  const fields = doc.fields;

  // ── FFM ──────────────────────────────────────────────────────────────────
  if (doc.cimpType === 'ffm') {
    const flightId = fields.FlightIdentification || {};
    const rawFlight = fields.FlightIdentificationLine || '';
    const parts = rawFlight.split('/');

    const flightNum = flightId.CarrierFlightNumber || parts[1] || '';
    const datePart = flightId.DayMonthTime || parts[2] || '';

    const depDate   = parseDDMON(datePart);
    const lfd       = depDate ? formatDDMON(addDays(depDate, 2)) : '';

    // STA = scheduled arrival at ORD, prefer structured Routes then fall back.
    let sta = '';
    if (Array.isArray(fields.Routes)) {
      const ordRoute = fields.Routes.find(r => r && r.AirportCode === 'ORD' && r.ScheduledArrivalTime);
      if (ordRoute) sta = ordRoute.ScheduledArrivalTime;
    }
    if (!sta) {
      for (const seg of (fields.RouteLine || '').split('\n')) {
        const m = seg.match(/^ORD\/\/([\d]{2}[A-Z]{3}\d{4})/);
        if (m) { sta = m[1]; break; }
      }
    }

    const flightKey = `${flightNum}/${datePart.slice(0, 5)}`;

    for (const [uldKey, uld] of Object.entries(fields.ULDs || {})) {
      for (const awb of (uld.AWBs || [])) {
        const mawb = awb.MasterAirwayBillNumber;
        if (!mawb) continue;

        const summary = parseShipmentSummary(awb.ShipmentSummary || '');

        if (!ffmIndex.has(mawb)) ffmIndex.set(mawb, new Map());
        const flightMap = ffmIndex.get(mawb);

        if (!flightMap.has(flightKey)) {
          flightMap.set(flightKey, { maxUid: uid, flightNum, sta, lfd, pmcs: new Map() });
        }
        const entry = flightMap.get(flightKey);
        if (uid > entry.maxUid) entry.maxUid = uid;

        const uldEntry = entry.pmcs.get(uldKey);
        if (!uldEntry || uid > uldEntry.uid) {
          entry.pmcs.set(uldKey, { uid, pob: summary.totalOnMawb ?? summary.piecesInUld });
        }
      }
    }

  // ── FWB ──────────────────────────────────────────────────────────────────
  } else if (doc.cimpType === 'fwb') {
    const mawb = fields.MasterAirwayBillNumber;
    if (!mawb) continue;
    const existing = fwbIndex.get(mawb);
    if (existing && uid <= existing.uid) continue;

    const consignee = (fields.Consignee?.NameLine || '').replace(/^NAM\//, '').trim();

    fwbIndex.set(mawb, {
      uid,
      weight:     fields.TotalWeight     || '',
      weightUnit: fields.TotalWeightUnit || fields.WeightUnit || 'K',
      pieces:     fields.TotalPieceCount || '',
      consignee,
    });

  // ── FHL ──────────────────────────────────────────────────────────────────
  } else if (doc.cimpType === 'fhl') {
    const mawb = fields.MasterAirwayBillNumber;
    if (!mawb) continue;
    const existing = fhlIndex.get(mawb);
    if (existing && uid <= existing.uid) continue;

    const consignee = (fields.Consignee?.ConsigneeLine || '').replace(/^CNE\//, '').trim();

    fhlIndex.set(mawb, {
      uid,
      masterPieces:     fields.MasterPieceCount || '',
      masterWeight:     fields.MasterWeight     || '',
      masterWeightUnit: fields.MasterWeightUnit || 'K',
      consignee,
    });
  }
}

// ── Resolve best FFM record per MAWB ─────────────────────────────────────────

function resolveFfm(mawb) {
  const flightMap = ffmIndex.get(mawb);
  if (!flightMap) return null;

  let best = null;
  for (const [, entry] of flightMap) {
    if (!best || entry.maxUid > best.maxUid) best = entry;
  }
  if (!best) return null;

  const pmcs    = [...best.pmcs.keys()].filter(k => k !== '');
  const pobEntry = [...best.pmcs.values()].find(v => v.pob != null);

  return {
    flightNum: best.flightNum,
    sta:       best.sta,
    lfd:       best.lfd,
    pmcs:      pmcs.join(', '),
    pob:       pobEntry ? String(pobEntry.pob) : '',
  };
}

// ── Generate rows (one per MAWB) ──────────────────────────────────────────────

const rows = [];

// col 0–7 filled, col 8 blank (PCS RCVD), col 9 blank (PMC LOC),
// col 10 filled, col 11 blank (AMS), cols 12–32 blank (21 empty)
const TRAILING_EMPTY = HEADERS.length - 12;

const allMawbs = new Set([...fhlIndex.keys(), ...fwbIndex.keys(), ...ffmIndex.keys()]);

for (const mawb of [...allMawbs].sort()) {
  const ffm = resolveFfm(mawb);
  const fwb = fwbIndex.get(mawb);
  const fhl = fhlIndex.get(mawb);

  const flight    = ffm?.flightNum ?? '';
  const sta       = ffm?.sta       ?? '';
  const lfd       = ffm?.lfd       ?? '';
  const pmcs      = ffm?.pmcs      ?? '';
  const pob       = ffm?.pob       ?? '';

  // Consignee: FWB preferred (more complete), fall back to FHL
  const consignee = fwb?.consignee || fhl?.consignee || '';

  // Weight/pieces: FWB is authoritative (item-level counts); FHL master as fallback
  const weight = fwb
    ? `${fwb.weight}${fwb.weightUnit}`
    : fhl ? `${fhl.masterWeight}${fhl.masterWeightUnit}` : '';
  const pieces = fwb?.pieces || fhl?.masterPieces || '';

  rows.push([
    flight, pmcs, mawb, sta, '', lfd,
    weight, pieces, pob,
    '',  // PCS RCVD — human input
    '',  // PMC LOCATION
    consignee, '',  // Consignee, AMS STATUS
    ...new Array(TRAILING_EMPTY).fill(''),
  ]);
}

// ── Write CSV ─────────────────────────────────────────────────────────────────

const lines = [csvRow(HEADERS), ...rows.map(csvRow)];
fs.mkdirSync(path.dirname(OUTPUT_CSV), { recursive: true });
fs.writeFileSync(OUTPUT_CSV, lines.join('\n') + '\n', 'utf8');

log('log', `Written ${rows.length} rows to ${path.basename(OUTPUT_CSV)}`);
const noFfm = rows.filter(r => r[0] === '').length;
log('log', `  Rows with no FFM match (no flight data): ${noFfm}`);
