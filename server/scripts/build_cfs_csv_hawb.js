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
const { PARSED_DIR, OUTPUTS_DIR } = require('../config/paths');

const OUTPUT_CSV = path.join(OUTPUTS_DIR, 'temp', 'CFS - output.csv');

// ── CSV header (matches CFS - temp.csv column order) ─────────────────────────

const HEADERS = [
  'FLIGHT#', 'ATA', 'LFD', 'MAWB', 'HAWB', 'Weight', 'TTL PCS', 'POB',
  'PCS RCVD', 'PMC#', 'PMC\nLOCATION', 'Consignee', 'AMS\nSTATUS',
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
 *   maxUid, flightNum, ata, lfd, pmcs: Map<uldKey, {uid, pob}> }>>
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

const filenames = fs.readdirSync(PARSED_DIR)
  .filter(f => f.endsWith('.json'))
  .sort();  // deterministic order

for (const filename of filenames) {
  const doc = JSON.parse(fs.readFileSync(path.join(PARSED_DIR, filename), 'utf8'));
  if (doc.status !== 'ok') continue;

  const uidMatch = filename.match(/uid-(\d+)/);
  const uid = uidMatch ? parseInt(uidMatch[1], 10) : 0;
  const fields = doc.fields;

  // ── FFM ──────────────────────────────────────────────────────────────────
  if (doc.cimpType === 'ffm') {
    const rawFlight = fields.FlightIdentificationLine || '';
    const parts     = rawFlight.split('/');
    const flightNum = parts[1] || '';
    const datePart  = parts[2] || '';

    // LFD = departure date + 2 days
    const depDate   = parseDDMON(datePart);
    const lfd       = depDate ? formatDDMON(addDays(depDate, 2)) : '';

    // ATA = ORD arrival timestamp from RouteLine
    let ata = '';
    for (const seg of (fields.RouteLine || '').split('\n')) {
      const m = seg.match(/^ORD\/\/(\d{2}[A-Z]{3}\d{4})/);
      if (m) { ata = m[1]; break; }
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
            maxUid: uid, flightNum, ata, lfd,
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
  } else if (doc.cimpType === 'fwb') {
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
  } else if (doc.cimpType === 'fhl') {
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

// ── Resolve best FFM record per MAWB ─────────────────────────────────────────

/**
 * For each MAWB in ffmIndex, pick the flight group with the highest maxUid,
 * then aggregate all its ULDs.
 */
function resolveFfm(mawb) {
  const flightMap = ffmIndex.get(mawb);
  if (!flightMap) return null;

  // Pick the flight group with the highest maxUid
  let best = null;
  for (const [, entry] of flightMap) {
    if (!best || entry.maxUid > best.maxUid) best = entry;
  }
  if (!best) return null;

  const pmcs = [...best.pmcs.keys()].filter(k => k !== '');
  // POB = value from any ULD entry (T-value is MAWB-total, same across ULDs for same AWB)
  const pobEntry = [...best.pmcs.values()].find(v => v.pob != null);

  return {
    flightNum: best.flightNum,
    ata:       best.ata,
    lfd:       best.lfd,
    pmcs:      pmcs.join(', '),
    pob:       pobEntry ? String(pobEntry.pob) : '',
  };
}

// ── Generate rows ─────────────────────────────────────────────────────────────

const rows = [];

// All MAWBs: FHL ∪ FWB (these are shipments Tolead is acting as agent for)
const allMawbs = new Set([...fhlIndex.keys(), ...fwbIndex.keys()]);

for (const mawb of [...allMawbs].sort()) {
  const ffm = resolveFfm(mawb);
  const fwb = fwbIndex.get(mawb);
  const fhl = fhlIndex.get(mawb);

  const flight     = ffm?.flightNum ?? '';
  const ata        = ffm?.ata       ?? '';
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
        flight, ata, lfd, mawb, hawb,
        houseWeight, housePieces, pob,
        '',    // PCS RCVD
        pmcs, '', consignee, '',
        ...emptyFields,
      ]);
    }
  } else {
    // MAWB-only row (no FHL received)
    rows.push([
      flight, ata, lfd, mawb, '',
      mawbWeight, mawbPieces, pob,
      '',    // PCS RCVD
      pmcs, '', consignee, '',
      ...emptyFields,
    ]);
  }
}

// ── Write CSV ─────────────────────────────────────────────────────────────────

const lines = [csvRow(HEADERS), ...rows.map(csvRow)];
fs.writeFileSync(OUTPUT_CSV, lines.join('\n') + '\n', 'utf8');

console.log(`Written ${rows.length} rows to ${OUTPUT_CSV}`);

// Quick summary
const hawbRows  = rows.filter(r => r[4] !== '').length;
const mawbRows  = rows.length - hawbRows;
const noFfm     = rows.filter(r => r[0] === '').length;
console.log(`  HAWB rows: ${hawbRows}`);
console.log(`  MAWB-only rows: ${mawbRows}`);
console.log(`  Rows with no FFM match (no flight data): ${noFfm}`);
