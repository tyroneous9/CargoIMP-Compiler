'use strict';

const express = require('express');
const messagesController = require('../controllers/messages-controller');

const router = express.Router();

router.get('/', messagesController.listMessages);

router.get('/:id', messagesController.getMessageById);

module.exports = router;
