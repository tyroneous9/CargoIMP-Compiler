'use strict';

const express = require('express');
const reportController = require('../controllers/report-controller');

const router = express.Router();

router.get('/mawbs', reportController.listMawbs);
router.get('/ulds', reportController.listUlds);
router.get('/hawbs', reportController.listHawbs);

module.exports = router;
