'use strict';

const messageService = require('../services/message-service');

async function listMessages(req, res, next) {
  try {
    const items = await messageService.listMessages(req.query || {});
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function getMessageById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid message id' });
    }

    const item = await messageService.getMessage(id);
    if (!item) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Message not found' });
    }

    return res.json(item);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listMessages,
  getMessageById,
};
