'use strict';

const reportRepository = require('../repositories/report-repository');

const PROCESSING_STATUS_VALUES = new Set(['new', 'complete']);
const NEW_MESSAGE_RECORD_TYPES = new Set(['uld', 'mawb', 'hawb']);

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

module.exports = {
  listMawbs,
  listUlds,
  listHawbs,
  listUldTableRows,
  listMawbTableRows,
  listHawbTableRows,
  updateUldProcessingStatus,
  updateMawbProcessingStatus,
  updateHawbProcessingStatus,
  listNewMessages,
  archiveNewMessages,
};
