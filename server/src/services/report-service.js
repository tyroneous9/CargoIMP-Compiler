'use strict';

const reportRepository = require('../repositories/report-repository');

const PROCESSING_STATUS_VALUES = new Set(['new', 'complete']);

function toPositiveInt(value, fallback) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function parsePagination(query) {
  return {
    limit: Math.min(toPositiveInt(query.limit, 25), 200),
    offset: toPositiveInt(query.offset, 0),
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

async function listMawbs(query) {
  const { limit, offset } = parsePagination(query || {});
  return reportRepository.listMawbs(limit, offset);
}

async function listUlds(query) {
  const { limit, offset } = parsePagination(query || {});
  return reportRepository.listUlds(limit, offset);
}

async function listHawbs(query) {
  const { limit, offset } = parsePagination(query || {});
  return reportRepository.listHawbs(limit, offset);
}

async function listUldTableRows(query) {
  const { limit, offset } = parsePagination(query || {});
  return reportRepository.listUldTableRows(limit, offset);
}

async function listMawbTableRows(query) {
  const { limit, offset } = parsePagination(query || {});
  return reportRepository.listMawbTableRows(limit, offset);
}

async function listHawbTableRows(query) {
  const { limit, offset } = parsePagination(query || {});
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
};
