const express = require('express');
const router = express.Router();

// Import controllers
const mergeController = require('../controllers/mergeController');

// Import middleware
const upload = require('../middleware/upload');

// PDF routes
// POST /api/pdf/merge - Merge multiple PDFs
router.post('/merge', upload.array('pdfs'), mergeController.mergePDFs);

module.exports = router;
