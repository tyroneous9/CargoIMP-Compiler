#!/usr/bin/env node
/**
 * build_cfs_csv_uld.js
 *
 * Generates CFS tracking CSV from parsed CIMP email outputs.
 * One row per (MAWB, ULD/PMC#).
 *
 * Weight and TTL PCS reflect the portion of the MAWB loaded into that specific ULD,
 * as reported in the FFM ShipmentSummary.  POB is the MAWB total across all ULDs.
 *
 * MAWBs with no FFM match (no ULD info): one fallback row with blank PMC#,
 * weight/pieces from FWB/FHL.
 *
 * ShipmentSummary formats handled:
 *   T<pcs><KL><wt>MC...          → no ULD split; uld_pcs = total, uld_wt = total_wt
 *   [SPD]<pcs><KL><wt>MC...T<n>  → ULD split; uld_pcs = prefix num, total = T suffix
 *
 * LFD = scheduled arrival date (STA) + 2 calendar days
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { EMAILS_DIR, PARSED_EMAILS_DIR, PARSED_TABLES_DIR, TABLE_FILES } = require('../config/paths');

const OUTPUT_CSV = path.join(PARSED_TABLES_DIR, TABLE_FILES.uld);

// ── CSV header ────────────────────────────────────────────────────────────────

const HEADERS = [
  'email_rcvd', 'flight', 'std', 'sta', 'ata', 'lfd', 'mawb', 'weight', 'TTL PCS', 'pob',
  'PCS RCVD', 'pmc', 'PMC\nLOCATION', 'Consignee', 'AMS\nSTATUS',
  'P3', 'Trucking/Skid $', 'Storage', 'ISC',
  'Tolead→NCA\nRCF MESSAGE', 'Tolead→NCA\nNFD MESSAGE', 'Tolead→NCA\nDLV MESSAGE',
  'Tolead→Customer\nCargo Arrive Email', 'Tolead→Customer\nCargo Ready Email',
  'Tolead→Customer\nCargo Deliver Email',
  'Truck arrives at NCA location', 'Truck departs from NCA',
  'Truck arrives at Tolead location', 'Truck offloading complete',
  'Break down start', 'Break down complete',
  'Ready for pick-up', 'Cargo delivery', 'POD', 'PTT/DO', 'Note',
];

const TRAILING_EMPTY = HEADERS.length - 12;  // cols after Consignee+AMS STATUS

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

function formatMMDD(d) {
  return String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function addDays(d, n) {
  return new Date(d.getTime() + n * 86400000);
}

function getChicagoTimeZoneName(year, month, day, hour, minute) {
  const probe = new Date(Date.UTC(year, month, day, hour, minute, 0));
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    timeZoneName: 'short',
  }).formatToParts(probe);
  return (parts.find((part) => part.type === 'timeZoneName') || {}).value || 'CT';
}

function formatStaDateTimeToChicago(rawDateTime) {
  const match = typeof rawDateTime === 'string' && rawDateTime.match(/^(\d{2})([A-Z]{3})(\d{2})(\d{2})$/);
  if (!match) return rawDateTime || '';

  const baseDate = parseDDMON(rawDateTime);
  if (!baseDate) return rawDateTime;

  const hour = parseInt(match[3], 10);
  const minute = parseInt(match[4], 10);
  const timeZoneName = getChicagoTimeZoneName(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hour,
    minute,
  );

  return `${formatMMDD(baseDate)} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${timeZoneName}`;
}

function formatUtcDateTime6ToChicago(rawDateTime6, referenceDatePart) {
  const dtMatch = typeof rawDateTime6 === 'string' && rawDateTime6.match(/^(\d{2})(\d{2})(\d{2})$/);
  if (!dtMatch) return '';

  const refDate = parseDDMON(referenceDatePart || '');
  if (!refDate) return rawDateTime6;

  const day = parseInt(dtMatch[1], 10);
  const hour = parseInt(dtMatch[2], 10);
  const minute = parseInt(dtMatch[3], 10);
  const year = refDate.getFullYear();
  const month = refDate.getMonth();

  const utcInstant = new Date(Date.UTC(year, month, day, hour, minute, 0));
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  });
  const parts = formatter.formatToParts(utcInstant);
  const get = (type) => (parts.find((p) => p.type === type) || {}).value || '';

  return `${get('month')}-${get('day')} ${get('hour')}:${get('minute')} ${get('timeZoneName')}`.trim();
}

function formatIsoToChicago(iso) {
  if (typeof iso !== 'string' || !iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  });
  const parts = formatter.formatToParts(date);
  const get = (type) => (parts.find((p) => p.type === type) || {}).value || '';

  return `${get('month')}-${get('day')} ${get('hour')}:${get('minute')} ${get('timeZoneName')}`.trim();
}

// ── Summary parser ────────────────────────────────────────────────────────────

/**
 * Parse ShipmentSummary into per-ULD and MAWB-total figures.
 *
 * Returns { uldPcs, uldWt, wtUnit, totalPcs }
 * - uldPcs/uldWt: pieces and weight of this MAWB chunk in this ULD
 * - totalPcs: total master pieces on the whole MAWB (for POB column)
 * - wtUnit: 'K' or 'L'
 *
 * All values are null if not parseable.
 */
function parseShipmentSummary(s) {
  // Split-ULD formats: S/P/D prefix → "[SPD]<uld_pcs><KL><uld_wt>MC<vol>T<total>"
  const splitMatch = s.match(/^[SPD](\d+)([KL])([\d.]+)MC[\d.]+T(\d+)/);
  if (splitMatch) {
    return {
      uldPcs:   parseInt(splitMatch[1], 10),
      uldWt:    parseFloat(splitMatch[3]),
      wtUnit:   splitMatch[2],
      totalPcs: parseInt(splitMatch[4], 10),
    };
  }
  // No-split format: "T<total_pcs><KL><total_wt>MC<vol>"
  const totalMatch = s.match(/^T(\d+)([KL])([\d.]+)/);
  if (totalMatch) {
    return {
      uldPcs:   parseInt(totalMatch[1], 10),
      uldWt:    parseFloat(totalMatch[3]),
      wtUnit:   totalMatch[2],
      totalPcs: parseInt(totalMatch[1], 10),
    };
  }
  return { uldPcs: null, uldWt: null, wtUnit: '', totalPcs: null };
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
 *   maxUid, flightNum, datePart, sta, lfd,
 *   ulds: Map<uldKey, { uid, uldPcs, uldWt, wtUnit, totalPcs }>
 * }>>
 */
const ffmIndex = new Map();

/** fwbIndex: Map<mawb, { uid, weight, weightUnit, pieces, consignee }> */
const fwbIndex = new Map();

/** fhlIndex: Map<mawb, { uid, masterPieces, masterWeight, masterWeightUnit, consignee }> */
const fhlIndex = new Map();

/** mvtIndex: Map<flightNum, { uid, ata }> */
const mvtIndex = new Map();

/** emailReceivedIndex: Map<uid, formattedDateTime> */
const emailReceivedIndex = new Map();

if (fs.existsSync(EMAILS_DIR)) {
  const emailFilenames = fs.readdirSync(EMAILS_DIR)
    .filter((f) => f.endsWith('.json'));
  for (const filename of emailFilenames) {
    const uidMatch = filename.match(/uid-(\d+)/);
    if (!uidMatch) continue;
    const uid = parseInt(uidMatch[1], 10);
    if (emailReceivedIndex.has(uid)) continue;

    try {
      const emailDoc = JSON.parse(fs.readFileSync(path.join(EMAILS_DIR, filename), 'utf8'));
      const formatted = formatIsoToChicago(emailDoc.date);
      if (formatted) emailReceivedIndex.set(uid, formatted);
    } catch (_) {
      // Ignore malformed files; missing EMAIL-RCVD is acceptable fallback.
    }
  }
}

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
  if (doc.messageType === 'ffm') {
    const flightId = fields.FlightIdentification || {};
    const rawFlight = fields.FlightIdentificationLine || '';
    const parts = rawFlight.split('/');

    const flightNum = flightId.CarrierFlightNumber || parts[1] || '';
    const datePart = flightId.DayMonthTime || parts[2] || '';

    // STD = scheduled departure time
    // Prefer new ScheduledDepartureDateTime from refactored grammar, fall back to DayMonthTime
    let std = flightId.ScheduledDepartureDateTime || flightId.DayMonthTime || '';
    const formattedStd = formatStaDateTimeToChicago(std);

    // STA = scheduled arrival at ORD, prefer new structured Routes with ScheduledArrivalDateTime, then fall back.
    let sta = '';
    if (Array.isArray(fields.Routes)) {
      const ordRoute = fields.Routes.find(r => r && r.AirportCode === 'ORD' && 
        (r.ScheduledArrivalDateTime || r.ScheduledArrivalTime));
      if (ordRoute) sta = ordRoute.ScheduledArrivalDateTime || ordRoute.ScheduledArrivalTime || '';
    }
    if (!sta) {
      for (const seg of (fields.RouteLine || '').split('\n')) {
        const m = seg.match(/^ORD\/\/([\d]{2}[A-Z]{3}\d{4})/);
        if (m) { sta = m[1]; break; }
      }
    }

    const formattedSta = formatStaDateTimeToChicago(sta);

    // LFD = STA + 2 calendar days
    const staDate = parseDDMON(sta);
    const lfd     = staDate ? formatMMDD(addDays(staDate, 2)) : '';

    const flightKey = `${flightNum}/${datePart.slice(0, 5)}`;

    for (const [uldKey, uld] of Object.entries(fields.ULDs || {})) {
      for (const awb of (uld.AWBs || [])) {
        const mawb = awb.MasterAirwayBillNumber;
        if (!mawb) continue;

        const summary = parseShipmentSummary(awb.ShipmentSummary || '');

        if (!ffmIndex.has(mawb)) ffmIndex.set(mawb, new Map());
        const flightMap = ffmIndex.get(mawb);

        if (!flightMap.has(flightKey)) {
          flightMap.set(flightKey, {
            maxUid: uid,
            flightNum,
            datePart,
            std: formattedStd,
            sta: formattedSta,
            lfd,
            emailRcvd: emailReceivedIndex.get(uid) || '',
            ulds: new Map(),
          });
        }
        const entry = flightMap.get(flightKey);
        if (uid > entry.maxUid) {
          entry.maxUid = uid;
          entry.emailRcvd = emailReceivedIndex.get(uid) || entry.emailRcvd || '';
        }

        // Keep highest-UID record per ULD (handles FFM revision emails)
        const existing = entry.ulds.get(uldKey);
        if (!existing || uid > existing.uid) {
          entry.ulds.set(uldKey, { uid, ...summary });
        }
      }
    }

  // ── FWB ──────────────────────────────────────────────────────────────────
  } else if (doc.messageType === 'fwb') {
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
  } else if (doc.messageType === 'fhl') {
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

  // ── MVT ──────────────────────────────────────────────────────────────────
  } else if (doc.messageType === 'mvt') {
    const flightId = fields.FlightIdentification || {};
    const event = fields.Event || {};
    const flightNum = flightId.CarrierFlightNumber || '';
    const ata = event.ActualArrivalDateTime || '';
    if (!flightNum || !ata) continue;

    const existing = mvtIndex.get(flightNum);
    if (!existing || uid > existing.uid) {
      mvtIndex.set(flightNum, { uid, ata });
    }
  }
}

// ── Resolve best FFM record per MAWB ─────────────────────────────────────────

/**
 * Returns the flight group with the highest maxUid for this MAWB,
 * or null if no FFM exists.
 */
function resolveFfm(mawb) {
  const flightMap = ffmIndex.get(mawb);
  if (!flightMap) return null;

  let best = null;
  for (const [, entry] of flightMap) {
    if (!best || entry.maxUid > best.maxUid) best = entry;
  }
  return best;
}

function resolveAta(flightNum, referenceDatePart) {
  if (!flightNum) return '';
  const match = mvtIndex.get(flightNum);
  if (!match) return '';
  return formatUtcDateTime6ToChicago(match.ata, referenceDatePart);
}

// ── Generate rows (one per MAWB+ULD) ─────────────────────────────────────────

const rows = [];

const allMawbs = new Set([...fhlIndex.keys(), ...fwbIndex.keys()]);

for (const mawb of [...allMawbs].sort()) {
  const ffm = resolveFfm(mawb);
  const fwb = fwbIndex.get(mawb);
  const fhl = fhlIndex.get(mawb);

  const flight = ffm?.flightNum ?? '';
  const std    = ffm?.std       ?? '';
  const sta    = ffm?.sta       ?? '';
  const ata    = resolveAta(ffm?.flightNum ?? '', ffm?.datePart ?? '');
  const lfd    = ffm?.lfd       ?? '';
  const emailRcvd = ffm?.emailRcvd ?? '';

  // Consignee: FWB preferred, FHL fallback
  const consignee = fwb?.consignee || fhl?.consignee || '';

  // MAWB-level fallback weight/pieces (used when no FFM ULD data)
  const fallbackWeight = fwb
    ? `${fwb.weight}${fwb.weightUnit}`
    : fhl ? `${fhl.masterWeight}${fhl.masterWeightUnit}` : '';
  const fallbackPieces = fwb?.pieces || fhl?.masterPieces || '';

  if (ffm && ffm.ulds.size > 0) {
    // One row per ULD, sorted by PMC# for visual grouping
    const sortedUlds = [...ffm.ulds.entries()]
      .filter(([k]) => k !== '')
      .sort(([a], [b]) => a.localeCompare(b));

    // Determine POB (MAWB total) from any ULD entry that has it
    const pobEntry    = [...ffm.ulds.values()].find(v => v.totalPcs != null);
    const pob         = pobEntry ? String(pobEntry.totalPcs) : '';

    for (const [uldKey, uldInfo] of sortedUlds) {
      const uldWeight = uldInfo.uldWt != null
        ? `${uldInfo.uldWt}${uldInfo.wtUnit}`
        : fallbackWeight;
      const uldPcs = uldInfo.uldPcs != null
        ? String(uldInfo.uldPcs)
        : fallbackPieces;

      rows.push([
        emailRcvd, flight, std, sta, ata, lfd, mawb,
        uldWeight, uldPcs, pob,
        '',         // PCS RCVD — human input
        uldKey, '', // PMC#, PMC LOCATION
        consignee, '',  // Consignee, AMS STATUS
        ...new Array(TRAILING_EMPTY).fill(''),
      ]);
    }
  } else {
    // No FFM or no ULD info: single fallback row with blank PMC#
    rows.push([
      emailRcvd, flight, std, sta, ata, lfd, mawb,
      fallbackWeight, fallbackPieces, '',
      '',    // PCS RCVD
      '', '', consignee, '',
      ...new Array(TRAILING_EMPTY).fill(''),
    ]);
  }
}

// ── Write CSV ─────────────────────────────────────────────────────────────────

const lines = [csvRow(HEADERS), ...rows.map(csvRow)];
fs.mkdirSync(path.dirname(OUTPUT_CSV), { recursive: true });
fs.writeFileSync(OUTPUT_CSV, lines.join('\n') + '\n', 'utf8');

console.log(`Written ${rows.length} rows to ${OUTPUT_CSV}`);
const noFfm   = rows.filter(r => r[1] === '').length;
const multiUld = rows.length - [...allMawbs].length;
console.log(`  Rows with no FFM match: ${noFfm}`);
console.log(`  Extra rows from MAWBs split across multiple ULDs: ${multiUld}`);
