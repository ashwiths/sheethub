const express = require('express');
const router = express.Router();

// Import controllers
const mergeController = require('../controllers/mergeController');

// Import middleware
const upload = require('../middleware/upload');

// PDF routes
// POST /api/pdf/merge - Merge multiple PDFs (max 10)
router.post('/merge', upload.array('files', 10), mergeController.mergePDFs);

module.exports = router;
