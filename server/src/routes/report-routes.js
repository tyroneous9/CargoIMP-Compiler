'use strict';

const express = require('express');
const reportController = require('../controllers/report-controller');

const router = express.Router();

router.get('/mawbs', reportController.listMawbs);
router.get('/ulds', reportController.listUlds);
router.get('/hawbs', reportController.listHawbs);
router.get('/hawbs-table', reportController.listHawbTableRows);
router.get('/mawbs-table', reportController.listMawbTableRows);
router.get('/email-xxx-table', reportController.listEmailXxxRows);
router.get('/new-messages', reportController.listNewMessages);
router.get('/ulds-table', reportController.listUldTableRows);
router.patch('/new-messages/archive', reportController.archiveNewMessages);
router.patch('/hawbs-table/batch', reportController.updateHawbRows);
router.patch('/mawbs-table/batch', reportController.updateMawbRows);
router.patch('/ulds-table/batch', reportController.updateUldRows);
router.patch('/ulds/:ffmUldId/processing-status', reportController.updateUldProcessingStatus);
router.patch('/mawbs/:fwbMasterId/processing-status', reportController.updateMawbProcessingStatus);
router.patch('/hawbs/:fhlHouseId/processing-status', reportController.updateHawbProcessingStatus);
router.get('/office-operation-table', reportController.listOfficeOperationRows);
router.patch('/office-operation-table/batch', reportController.upsertOfficeOperationRows);
router.get('/breakdown-manifest-table', reportController.listBreakdownManifestRows);

module.exports = router;
