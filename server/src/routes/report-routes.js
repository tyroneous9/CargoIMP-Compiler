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
router.patch('/ulds/:ffmUldId/archive-status', reportController.updateUldArchiveStatus);
router.patch('/mawbs/:fwbMasterId/archive-status', reportController.updateMawbArchiveStatus);
router.patch('/hawbs/:fhlHouseId/archive-status', reportController.updateHawbArchiveStatus);
router.get('/office-operation-table', reportController.listOfficeOperationRows);
router.patch('/office-operation-table/batch', reportController.upsertOfficeOperationRows);
router.get('/breakdown-manifest-table', reportController.listBreakdownManifestRows);
router.get('/pickup-table', reportController.listPickupRows);
router.patch('/pickup-table/batch', reportController.updatePickupRows);

module.exports = router;
