const express = require('express');
const router = express.Router();

// Import controllers
const mergeController = require('../controllers/mergeController');
const { splitPDF } = require('../controllers/splitController');
const compressController = require('../controllers/compressController');
const { pdfToWord } = require("../controllers/pdfToWordController");


// Import middleware
const upload = require('../middleware/upload');

console.log("PDF routes loaded");

// PDF routes
// POST /api/pdf/merge - Merge multiple PDFs (max 10)
router.post('/merge', upload.array('files', 10), mergeController.mergePDFs);

// POST /api/pdf/split - Split a single PDF
router.post('/split', upload.single('file'), splitPDF);


router.post('/compress', upload.single('file'), compressController.compressPDF);

router.post("/pdf-to-word", upload.single("file"), pdfToWord);

module.exports = router;
