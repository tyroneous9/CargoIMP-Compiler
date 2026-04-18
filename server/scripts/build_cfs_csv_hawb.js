#!/usr/bin/env node
/**
 * build_cfs_csv.js
 *
 * Generates CFS tracking CSV from parsed CIMP email outputs.
 *
 * !!! DOES NOT WORK, HAWB IMPOSSIBLE TO LINK TO ULD OR FLIGHT
 * 
 * Row granularity:
 *   - MAWBs with FHL → one row per HAWB (using house bill weight/pieces)
 *   - MAWBs with FWB but no FHL → one row per MAWB
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
const { PARSED_EMAILS_DIR, PARSED_TABLES_DIR, TABLE_FILES } = require('../config/paths');
const { log } = require('../config/logger');

const OUTPUT_CSV = path.join(PARSED_TABLES_DIR, TABLE_FILES.hawb);

// ── CSV header (matches CFS - temp.csv column order) ─────────────────────────

const HEADERS = [
  'FLIGHT#', 'PMC#', 'MAWB#', 'HAWB#', 'STA', 'ATA', 'LFD', 'Weight', 'TTL PCS', 'POB',
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

/**
 * Parse "DDMON" or "DDMONHHMM" → Date (year inferred from current year).
 * Returns null if not parseable.
 */
function parseDDMON(s) {
  const m = s && s.match(/^(\d{2})([A-Z]{3})/);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const mon = MONTHS.indexOf(m[2]);
  if (mon < 0) return null;
  // Infer year: if the month is ahead of the current month by more than 6, assume last year
  const now = new Date();
  let year = now.getFullYear();
  if (mon > now.getMonth() + 6) year--;
  return new Date(year, mon, day);
}

/** Format Date → "DDMON" */
function formatDDMON(d) {
  return String(d.getDate()).padStart(2, '0') + MONTHS[d.getMonth()];
}

/** Add N calendar days to a Date, return new Date */
function addDays(d, n) {
  return new Date(d.getTime() + n * 86400000);
}

// ── Summary parser ────────────────────────────────────────────────────────────

/**
 * Parse ShipmentSummary — two known formats:
 *   Format 1 (no ULD split):  "T121K2159MC9.37"   → total=121
 *   Format 2 (split ULDs):    "S19K490.2MC2.28T75" → piecesInUld=19, total=75
 * Returns { piecesInUld, totalOnMawb }
 */
function parseShipmentSummary(s) {
  const sIn  = s.match(/^S(\d+)/);    // format 2: pieces in this ULD
  const tEnd = s.match(/T(\d+)$/);    // format 2: MAWB total at end
  const tStr = s.match(/^T(\d+)/);    // format 1: total at start
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

/**
 * ffmIndex: Map<mawb, Map<flightKey, {
 *   maxUid, flightNum, sta, lfd, pmcs: Map<uldKey, {uid, pob}> }>>
 * where flightKey = "FLIGHTNUM/DATE"
 */
const ffmIndex  = new Map();

/**
 * fwbIndex: Map<mawb, { uid, weight, weightUnit, pieces, consignee }>
 * Keeps the record with the highest UID (latest email = most current).
 */
const fwbIndex  = new Map();

/**
 * fhlIndex: Map<mawb, { uid, masterPieces, masterWeight, masterWeightUnit,
 *                        consignee, houseBills[] }>
 * Keeps the record with the highest UID.
 */
const fhlIndex  = new Map();

fs.mkdirSync(PARSED_EMAILS_DIR, { recursive: true });

const filenames = fs.readdirSync(PARSED_EMAILS_DIR)
  .filter(f => f.endsWith('.json'))
  .sort();  // deterministic order

for (const filename of filenames) {
  const doc = JSON.parse(fs.readFileSync(path.join(PARSED_EMAILS_DIR, filename), 'utf8'));
  if (doc.status !== 'ok') continue;

  const uidMatch = filename.match(/uid-(\d+)/);
  const uid = uidMatch ? parseInt(uidMatch[1], 10) : 0;
  const fields = doc.fields;

  // ── FFM ──────────────────────────────────────────────────────────────────
  if (doc.messageType === 'ffm') {
    const flightId = fields.FlightIdentification || {};
    const rawFlight = fields.FlightIdentificationLine || '';
    const parts = rawFlight.split('/');

    const flightNum = flightId.CarrierFlightNumber || parts[1] || '';
    const datePart = flightId.DayMonthTime || parts[2] || '';

    // LFD = departure date + 2 days
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
        const m = seg.match(/^ORD\/\/(\d{2}[A-Z]{3}\d{4})/);
        if (m) { sta = m[1]; break; }
      }
    }

    const flightKey = `${flightNum}/${datePart.slice(0, 5)}`; // e.g. "NH8422/06APR"

    for (const [uldKey, uld] of Object.entries(fields.ULDs || {})) {
      for (const awb of (uld.AWBs || [])) {
        const mawb = awb.MasterAirwayBillNumber;
        if (!mawb) continue;

        const summary = parseShipmentSummary(awb.ShipmentSummary || '');

        if (!ffmIndex.has(mawb)) ffmIndex.set(mawb, new Map());
        const flightMap = ffmIndex.get(mawb);

        if (!flightMap.has(flightKey)) {
          flightMap.set(flightKey, {
            maxUid: uid, flightNum, sta, lfd,
            pmcs: new Map(),
          });
        }
        const entry = flightMap.get(flightKey);
        if (uid > entry.maxUid) entry.maxUid = uid;

        // For each ULD, keep highest-UID record (true revision case)
        const uldEntry = entry.pmcs.get(uldKey);
        if (!uldEntry || uid > uldEntry.uid) {
          entry.pmcs.set(uldKey, { uid, pob: summary.totalOnMawb ?? summary.piecesInUld });
        }
      }
    }

  // ── FWB ──────────────────────────────────────────────────────────────────
  } else if (doc.messageType === 'fwb') {
    const mawb = fields.MasterAirwayBillNumber;
    if (!mawb) continue;
    const existing = fwbIndex.get(mawb);
    if (existing && uid <= existing.uid) continue;

    const rawName   = fields.Consignee?.NameLine || '';
    const consignee = rawName.replace(/^NAM\//, '').trim();

    fwbIndex.set(mawb, {
      uid,
      weight:     fields.TotalWeight     || '',
      weightUnit: fields.TotalWeightUnit || fields.WeightUnit || 'K',
      pieces:     fields.TotalPieceCount || '',
      consignee,
    });

  // ── FHL ──────────────────────────────────────────────────────────────────
  } else if (doc.messageType === 'fhl') {
    const mawb = fields.MasterAirwayBillNumber;
    if (!mawb) continue;
    const existing = fhlIndex.get(mawb);
    if (existing && uid <= existing.uid) continue;

    const rawCne   = fields.Consignee?.ConsigneeLine || '';
    const consignee = rawCne.replace(/^CNE\//, '').trim();

    fhlIndex.set(mawb, {
      uid,
      masterPieces:     fields.MasterPieceCount  || '',
      masterWeight:     fields.MasterWeight      || '',
      masterWeightUnit: fields.MasterWeightUnit  || 'K',
      consignee,
      houseBills: fields.HouseBills || [],
    });
  }
}

// ── Resolve aggregated FFM records per MAWB ──────────────────────────────────

/**
 * For each MAWB, aggregate all flight groups so one row can show multiple
 * flights and multiple PMCs when HAWB-to-ULD linkage is not deterministic.
 */
function resolveFfm(mawb) {
  const flightMap = ffmIndex.get(mawb);
  if (!flightMap) return null;

  const flights = [];
  const stas = [];
  const lfds = [];
  const pmcSet = new Set();
  let bestPob = null;
  let bestPobUid = -1;

  for (const [, entry] of flightMap) {
    if (entry.flightNum) flights.push(entry.flightNum);
    if (entry.sta) stas.push(entry.sta);
    if (entry.lfd) lfds.push(entry.lfd);

    for (const [uldKey, uldEntry] of entry.pmcs) {
      if (uldKey) pmcSet.add(uldKey);
      if (uldEntry && uldEntry.pob != null && uldEntry.uid > bestPobUid) {
        bestPobUid = uldEntry.uid;
        bestPob = String(uldEntry.pob);
      }
    }
  }

  const uniqSorted = (arr) => [...new Set(arr)].sort();

  return {
    flightNum: uniqSorted(flights).join(', '),
    sta:       uniqSorted(stas).join(', '),
    lfd:       uniqSorted(lfds).join(', '),
    pmcs:      [...pmcSet].sort().join(', '),
    pob:       bestPob ?? '',
  };
}

// ── Generate rows ─────────────────────────────────────────────────────────────

const rows = [];

// All MAWBs: FHL ∪ FWB ∪ FFM
const allMawbs = new Set([...fhlIndex.keys(), ...fwbIndex.keys(), ...ffmIndex.keys()]);

for (const mawb of [...allMawbs].sort()) {
  const ffm = resolveFfm(mawb);
  const fwb = fwbIndex.get(mawb);
  const fhl = fhlIndex.get(mawb);

  const flight     = ffm?.flightNum ?? '';
  const sta        = ffm?.sta       ?? '';
  const lfd        = ffm?.lfd       ?? '';
  const pmcs       = ffm?.pmcs      ?? '';
  const pob        = ffm?.pob       ?? '';

  // Consignee: prefer FWB (most complete), fall back to FHL
  const consignee  = fwb?.consignee || fhl?.consignee || '';

  // Master-level weight/pieces from FWB (most authoritative), fallback to FHL
  const mawbWeight = fwb
    ? `${fwb.weight}${fwb.weightUnit}`
    : fhl ? `${fhl.masterWeight}${fhl.masterWeightUnit}` : '';
  const mawbPieces = fwb?.pieces || fhl?.masterPieces || '';

  const emptyFields = new Array(HEADERS.length - 13).fill('');

  if (fhl && fhl.houseBills.length > 0) {
    // One row per HAWB
    for (const hb of fhl.houseBills) {
      const hawb        = hb.HouseWaybillNumber || '';
      const houseWeight = hb.HouseWeight
        ? `${hb.HouseWeight}${hb.HouseWeightUnit || fhl.masterWeightUnit || 'K'}`
        : mawbWeight;
      const housePieces = hb.HousePieceCount || mawbPieces;

      rows.push([
        flight, pmcs, mawb, hawb, sta, '', lfd,
        houseWeight, housePieces, pob,
        '',    // PCS RCVD
        '', consignee, '',
        ...emptyFields,
      ]);
    }
  } else {
    // MAWB-only row (no FHL received)
    rows.push([
      flight, pmcs, mawb, '', sta, '', lfd,
      mawbWeight, mawbPieces, pob,
      '',    // PCS RCVD
      '', consignee, '',
      ...emptyFields,
    ]);
  }
}

// ── Write CSV ─────────────────────────────────────────────────────────────────

const lines = [csvRow(HEADERS), ...rows.map(csvRow)];
fs.mkdirSync(path.dirname(OUTPUT_CSV), { recursive: true });
fs.writeFileSync(OUTPUT_CSV, lines.join('\n') + '\n', 'utf8');

log('log', `Written ${rows.length} rows to ${path.basename(OUTPUT_CSV)}`);

// Quick summary
const hawbRows  = rows.filter(r => r[3] !== '').length;
const mawbRows  = rows.length - hawbRows;
const noFfm     = rows.filter(r => r[0] === '').length;
log('log', `  HAWB rows: ${hawbRows}`);
log('log', `  MAWB-only rows: ${mawbRows}`);
log('log', `  Rows with no FFM match (no flight data): ${noFfm}`);
