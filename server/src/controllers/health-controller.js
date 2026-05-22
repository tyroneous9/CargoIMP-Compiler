'use strict';

const { getDatabaseNow } = require('../repositories/system-repository');

async function getHealth(_req, res, next) {
  try {
    const now = await getDatabaseNow();
    res.json({
      status: 'ok',
      database: 'ok',
      databaseNow: now,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getHealth,
};
