'use strict';

const reportRepository = require('../repositories/report-repository');

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

module.exports = {
  listMawbs,
  listUlds,
  listHawbs,
  listUldTableRows,
  listMawbTableRows,
};
