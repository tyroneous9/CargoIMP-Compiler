'use strict';

const reportRepository = require('../repositories/report-repository');

const PROCESSING_STATUS_VALUES = new Set(['new', 'complete']);
const NEW_MESSAGE_RECORD_TYPES = new Set(['uld', 'mawb', 'hawb']);
const HAWB_EDITABLE_COLUMNS = new Set(['processing_status', 'hawb_number', 'piece_count', 'weight_kg']);
const OFFICE_OPERATION_EDITABLE_COLUMNS = new Set([
  'ams_status',
  'p3',
  'freight_charge',
  'storage',
  'isc',
]);
const ISC_VALUES = new Set(['TOLEAD', 'NCA', 'STORAGE', 'VFY_REQ']);
const MAWB_EDITABLE_COLUMNS = new Set([
  'processing_status',
  'mawb_number',
  'origin_airport_code',
  'destination_airport_code',
  'piece_count',
  'weight_kg',
]);
const ULD_EDITABLE_COLUMNS = new Set(['processing_status', 'uld_code', 'uld_weight']);

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

function parseProcessingStatus(value) {
  if (!PROCESSING_STATUS_VALUES.has(value)) {
    const error = new Error('processingStatus must be one of: new, complete');
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

      if (column === 'processing_status') {
        normalizedChanges[column] = parseProcessingStatus(value);
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

async function updateUldProcessingStatus(ffmUldId, processingStatus) {
  const parsedId = parseId(ffmUldId, 'ffmUldId');
  const parsedStatus = parseProcessingStatus(processingStatus);
  const updated = await reportRepository.updateUldProcessingStatus(parsedId, parsedStatus);
  if (!updated) {
    const error = new Error('ULD record not found');
    error.statusCode = 404;
    throw error;
  }
  return updated;
}

async function updateMawbProcessingStatus(fwbMasterId, processingStatus) {
  const parsedId = parseId(fwbMasterId, 'fwbMasterId');
  const parsedStatus = parseProcessingStatus(processingStatus);
  const updated = await reportRepository.updateMawbProcessingStatus(parsedId, parsedStatus);
  if (!updated) {
    const error = new Error('MAWB record not found');
    error.statusCode = 404;
    throw error;
  }
  return updated;
}

async function updateHawbProcessingStatus(fhlHouseId, processingStatus) {
  const parsedId = parseId(fhlHouseId, 'fhlHouseId');
  const parsedStatus = parseProcessingStatus(processingStatus);
  const updated = await reportRepository.updateHawbProcessingStatus(parsedId, parsedStatus);
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
      if (column === 'isc' && value !== null && !ISC_VALUES.has(value)) {
        const error = new Error(`updates[${index}].changes.isc must be one of: TOLEAD, NCA, STORAGE, VFY_REQ`);
        error.statusCode = 400;
        throw error;
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
  updateUldProcessingStatus,
  updateMawbProcessingStatus,
  updateHawbProcessingStatus,
  listNewMessages,
  archiveNewMessages,
  updateHawbRows,
  updateMawbRows,
  updateUldRows,
  listOfficeOperationRows,
  upsertOfficeOperationRows,
};
