'use strict';

const reportRepository = require('../repositories/report-repository');

const NEW_MESSAGE_RECORD_TYPES = new Set(['uld', 'mawb', 'hawb']);
const HAWB_EDITABLE_COLUMNS = new Set(['archive_status', 'hawb_number', 'piece_count', 'weight_kg']);
const OFFICE_OPERATION_EDITABLE_COLUMNS = new Set([
  'archive_status',
  'ams_status',
  'p3',
  'hold',
  'isc',
  'notes',
]);
const ISC_VALUES = new Set(['ISC - NCA', 'ISC - TOLEAD', 'ISC + STORAGE', 'ISC - VFY_REQ']);
const MAWB_EDITABLE_COLUMNS = new Set([
  'archive_status',
  'mawb_number',
  'origin_airport_code',
  'destination_airport_code',
  'piece_count',
  'weight_kg',
]);
const ULD_EDITABLE_COLUMNS = new Set(['archive_status', 'uld_code', 'uld_weight']);
const PICKUP_EDITABLE_COLUMNS = new Set(['pickup_status']);
const PICKUP_STATUS_VALUES = new Set(['new', 'arranged', 'complete']);

function toPositiveInt(value, label) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    const error = new Error(`${label} must be a positive integer`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
}

function parsePagination(query) {
  if (!query || typeof query !== 'object') {
    const error = new Error('query parameters are required');
    error.statusCode = 400;
    throw error;
  }

  const limit = toPositiveInt(query.limit, 'limit');
  const offset = Number(query.offset);

  if (!Number.isInteger(offset) || offset < 0) {
    const error = new Error('offset must be a non-negative integer');
    error.statusCode = 400;
    throw error;
  }

  return {
    limit: Math.min(limit, 200),
    offset,
  };
}

function parseId(value, label) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    const error = new Error(`${label} must be a positive integer`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
}

function parseArchiveStatus(value) {
  if (typeof value !== 'boolean') {
    const error = new Error('archiveStatus must be true or false');
    error.statusCode = 400;
    throw error;
  }
  return value;
}

function parseNewMessageRecords(records) {
  if (!Array.isArray(records) || records.length === 0) {
    const error = new Error('records must be a non-empty array');
    error.statusCode = 400;
    throw error;
  }

  return records.map((record, index) => {
    if (!record || typeof record !== 'object') {
      const error = new Error(`records[${index}] must be an object`);
      error.statusCode = 400;
      throw error;
    }

    if (!NEW_MESSAGE_RECORD_TYPES.has(record.recordType)) {
      const error = new Error(`records[${index}].recordType must be one of: uld, mawb, hawb`);
      error.statusCode = 400;
      throw error;
    }

    return {
      recordType: record.recordType,
      recordId: parseId(record.recordId, `records[${index}].recordId`),
    };
  });
}

function parseRowUpdates(updates, editableColumns) {
  if (!Array.isArray(updates) || updates.length === 0) {
    const error = new Error('updates must be a non-empty array');
    error.statusCode = 400;
    throw error;
  }

  return updates.map((update, index) => {
    if (!update || typeof update !== 'object') {
      const error = new Error(`updates[${index}] must be an object`);
      error.statusCode = 400;
      throw error;
    }

    const id = parseId(update.id, `updates[${index}].id`);
    const changes = update.changes;
    if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
      const error = new Error(`updates[${index}].changes must be an object`);
      error.statusCode = 400;
      throw error;
    }

    const normalizedChanges = {};
    for (const [column, value] of Object.entries(changes)) {
      if (!editableColumns.has(column)) {
        const error = new Error(`updates[${index}].changes.${column} is not editable`);
        error.statusCode = 400;
        throw error;
      }

      if (column === 'archive_status') {
        normalizedChanges[column] = parseArchiveStatus(value);
      } else {
        normalizedChanges[column] = value;
      }
    }

    if (Object.keys(normalizedChanges).length === 0) {
      const error = new Error(`updates[${index}].changes must include at least one editable field`);
      error.statusCode = 400;
      throw error;
    }

    return { id, changes: normalizedChanges };
  });
}

async function listMawbs(query) {
  const { limit, offset } = parsePagination(query);
  return reportRepository.listMawbs(limit, offset);
}

async function listUlds(query) {
  const { limit, offset } = parsePagination(query);
  return reportRepository.listUlds(limit, offset);
}

async function listHawbs(query) {
  const { limit, offset } = parsePagination(query);
  return reportRepository.listHawbs(limit, offset);
}

async function listUldTableRows(query) {
  const { limit, offset } = parsePagination(query);
  return reportRepository.listUldTableRows(limit, offset);
}

async function listMawbTableRows(query) {
  const { limit, offset } = parsePagination(query);
  return reportRepository.listMawbTableRows(limit, offset);
}

async function listEmailXxxRows(query) {
  const { limit, offset } = parsePagination(query);
  return reportRepository.listEmailXxxRows(limit, offset);
}

async function listHawbTableRows(query) {
  const { limit, offset } = parsePagination(query);
  return reportRepository.listHawbTableRows(limit, offset);
}

async function updateUldArchiveStatus(ffmUldId, archiveStatus) {
  const parsedId = parseId(ffmUldId, 'ffmUldId');
  const parsedStatus = parseArchiveStatus(archiveStatus);
  const updated = await reportRepository.updateUldArchiveStatus(parsedId, parsedStatus);
  if (!updated) {
    const error = new Error('ULD record not found');
    error.statusCode = 404;
    throw error;
  }
  return updated;
}

async function updateMawbArchiveStatus(fwbMasterId, archiveStatus) {
  const parsedId = parseId(fwbMasterId, 'fwbMasterId');
  const parsedStatus = parseArchiveStatus(archiveStatus);
  const updated = await reportRepository.updateMawbArchiveStatus(parsedId, parsedStatus);
  if (!updated) {
    const error = new Error('MAWB record not found');
    error.statusCode = 404;
    throw error;
  }
  return updated;
}

async function updateHawbArchiveStatus(fhlHouseId, archiveStatus) {
  const parsedId = parseId(fhlHouseId, 'fhlHouseId');
  const parsedStatus = parseArchiveStatus(archiveStatus);
  const updated = await reportRepository.updateHawbArchiveStatus(parsedId, parsedStatus);
  if (!updated) {
    const error = new Error('HAWB record not found');
    error.statusCode = 404;
    throw error;
  }
  return updated;
}

async function listNewMessages(query) {
  const { limit, offset } = parsePagination(query);
  return reportRepository.listNewMessages(limit, offset);
}

async function archiveNewMessages(records) {
  const parsedRecords = parseNewMessageRecords(records);
  return reportRepository.archiveNewMessages(parsedRecords);
}

async function updateHawbRows(updates) {
  const parsedUpdates = parseRowUpdates(updates, HAWB_EDITABLE_COLUMNS);
  return reportRepository.updateHawbRows(parsedUpdates);
}

async function updateMawbRows(updates) {
  const parsedUpdates = parseRowUpdates(updates, MAWB_EDITABLE_COLUMNS);
  return reportRepository.updateMawbRows(parsedUpdates);
}

async function updateUldRows(updates) {
  const parsedUpdates = parseRowUpdates(updates, ULD_EDITABLE_COLUMNS);
  return reportRepository.updateUldRows(parsedUpdates);
}

async function listOfficeOperationRows(query) {
  const { limit, offset } = parsePagination(query);
  return reportRepository.listOfficeOperationRows(limit, offset);
}

async function listBreakdownManifestRows(query) {
  const { limit, offset } = parsePagination(query);
  return reportRepository.listBreakdownManifestRows(limit, offset);
}

async function listPickupRows(query) {
  const { limit, offset } = parsePagination(query);
  return reportRepository.listPickupRows(limit, offset);
}

function parsePickupUpdates(updates) {
  const parsedUpdates = parseRowUpdates(updates, PICKUP_EDITABLE_COLUMNS);

  return parsedUpdates.map((update, index) => {
    const status = update.changes.pickup_status;
    if (typeof status !== 'string' || !PICKUP_STATUS_VALUES.has(status)) {
      const error = new Error(
        `updates[${index}].changes.pickup_status must be one of: new, arranged, complete`
      );
      error.statusCode = 400;
      throw error;
    }

    return {
      id: update.id,
      changes: {
        pickup_status: status,
      },
    };
  });
}

async function updatePickupRows(updates) {
  const parsedUpdates = parsePickupUpdates(updates);
  return reportRepository.updatePickupRows(parsedUpdates);
}

function parseOfficeOperationUpdates(updates) {
  if (!Array.isArray(updates) || updates.length === 0) {
    const error = new Error('updates must be a non-empty array');
    error.statusCode = 400;
    throw error;
  }

  return updates.map((update, index) => {
    if (!update || typeof update !== 'object') {
      const error = new Error(`updates[${index}] must be an object`);
      error.statusCode = 400;
      throw error;
    }
    if (typeof update.mawb_number !== 'string' || update.mawb_number.trim() === '') {
      const error = new Error(`updates[${index}].mawb_number is required`);
      error.statusCode = 400;
      throw error;
    }

    const changes = update.changes;
    if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
      const error = new Error(`updates[${index}].changes must be an object`);
      error.statusCode = 400;
      throw error;
    }

    const normalizedChanges = {};
    for (const [column, value] of Object.entries(changes)) {
      if (!OFFICE_OPERATION_EDITABLE_COLUMNS.has(column)) {
        const error = new Error(`updates[${index}].changes.${column} is not editable`);
        error.statusCode = 400;
        throw error;
      }
      if (column === 'archive_status') {
        normalizedChanges[column] = parseArchiveStatus(value);
        continue;
      }
      if (column === 'p3' && typeof value !== 'boolean') {
        const error = new Error(`updates[${index}].changes.p3 must be true or false`);
        error.statusCode = 400;
        throw error;
      }
      if (column === 'isc' && value !== null && !ISC_VALUES.has(value)) {
        const error = new Error(
          `updates[${index}].changes.isc must be one of: ISC - NCA, ISC - TOLEAD, ISC + STORAGE, ISC - VFY_REQ`
        );
        error.statusCode = 400;
        throw error;
      }
      if (column === 'notes' && value !== null && typeof value !== 'string') {
        const error = new Error(`updates[${index}].changes.notes must be a string`);
        error.statusCode = 400;
        throw error;
      }
      if (column === 'notes') {
        normalizedChanges[column] = value ?? '';
        continue;
      }
      normalizedChanges[column] = value;
    }

    if (Object.keys(normalizedChanges).length === 0) {
      const error = new Error(`updates[${index}].changes must include at least one editable field`);
      error.statusCode = 400;
      throw error;
    }

    return { mawb_number: update.mawb_number.trim(), changes: normalizedChanges };
  });
}

async function upsertOfficeOperationRows(updates) {
  const parsedUpdates = parseOfficeOperationUpdates(updates);
  return reportRepository.upsertOfficeOperationRows(parsedUpdates);
}

module.exports = {
  listMawbs,
  listUlds,
  listHawbs,
  listUldTableRows,
  listMawbTableRows,
  listEmailXxxRows,
  listHawbTableRows,
  updateUldArchiveStatus,
  updateMawbArchiveStatus,
  updateHawbArchiveStatus,
  listNewMessages,
  archiveNewMessages,
  updateHawbRows,
  updateMawbRows,
  updateUldRows,
  listOfficeOperationRows,
  upsertOfficeOperationRows,
  listBreakdownManifestRows,
  listPickupRows,
  updatePickupRows,
};
