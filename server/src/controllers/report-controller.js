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

module.exports = {
  listMawbs,
  listUlds,
  listHawbs,
  listUldTableRows,
  listMawbTableRows,
};
