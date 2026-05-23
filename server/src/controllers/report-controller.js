'use strict';

const reportService = require('../services/report-service');

async function listMawbs(req, res, next) {
  try {
    const items = await reportService.listMawbs(req.query || {});
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function listUlds(req, res, next) {
  try {
    const items = await reportService.listUlds(req.query || {});
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function listHawbs(req, res, next) {
  try {
    const items = await reportService.listHawbs(req.query || {});
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function listUldTableRows(req, res, next) {
  try {
    const items = await reportService.listUldTableRows(req.query || {});
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function listMawbTableRows(req, res, next) {
  try {
    const items = await reportService.listMawbTableRows(req.query || {});
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function listHawbTableRows(req, res, next) {
  try {
    const items = await reportService.listHawbTableRows(req.query || {});
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function updateUldProcessingStatus(req, res, next) {
  try {
    const updated = await reportService.updateUldProcessingStatus(
      req.params.ffmUldId,
      req.body?.processingStatus
    );
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function updateMawbProcessingStatus(req, res, next) {
  try {
    const updated = await reportService.updateMawbProcessingStatus(
      req.params.fwbMasterId,
      req.body?.processingStatus
    );
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function updateHawbProcessingStatus(req, res, next) {
  try {
    const updated = await reportService.updateHawbProcessingStatus(
      req.params.fhlHouseId,
      req.body?.processingStatus
    );
    res.json(updated);
  } catch (error) {
    next(error);
  }
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
