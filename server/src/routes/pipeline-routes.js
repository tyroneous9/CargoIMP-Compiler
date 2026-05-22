'use strict';

const express = require('express');
const pipelineController = require('../controllers/pipeline-controller');

const router = express.Router();

router.get('/runs', pipelineController.listRuns);

router.get('/runs/:id', pipelineController.getRunById);

module.exports = router;
