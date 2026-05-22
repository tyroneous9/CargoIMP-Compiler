'use strict';

const express = require('express');
const healthRoutes = require('./health-routes');
const pipelineRoutes = require('./pipeline-routes');
const messagesRoutes = require('./messages-routes');
const reportRoutes = require('./report-routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/pipeline', pipelineRoutes);
router.use('/messages', messagesRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
