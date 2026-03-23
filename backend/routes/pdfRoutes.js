const express = require('express');
const router = express.Router();

// Import middleware first
const upload = require('../middleware/upload');

// Import controllers
const mergeController = require('../controllers/mergeController');
const { splitPDF } = require('../controllers/splitController');
const compressController = require('../controllers/compressController');
const { pdfToWord } = require("../controllers/pdfToWordController");
const { pdfToPpt } = require("../controllers/pdfToPptController");
const { pdfToExcel } = require("../controllers/pdfToExcelController");
const { wordToPdf } = require("../controllers/wordToPdfController");
const { pptToPdf } = require("../controllers/pptToPdfController");
const { excelToPdf } = require("../controllers/excelToPdfController");
const { pdfToJpg } = require("../controllers/pdfToJpgController");
const { jpgToPdf } = require("../controllers/jpgToPdfController");
const { rotatePdf } = require("../controllers/rotatePdfController");
// const { htmlToPdf } = require("../controllers/htmlToPdfController");
const { protectPdf } = require("../controllers/protectPdfController");
const { unlockPdf } = require("../controllers/unlockPdfController");
const { organizePdf } = require("../controllers/organizePdfController");
const { pdfToPDFA } = require("../controllers/pdfToPDFAController");
const { repairPdf } = require("../controllers/repairPdfController");
const { addPageNumbers } = require("../controllers/pageNumberController");

console.log("PDF routes loaded");

// PDF routes

// POST /api/pdf/merge - Merge multiple PDFs (max 10)
router.post('/merge', upload.array('files', 10), mergeController.mergePDFs);

// POST /api/pdf/split - Split a single PDF
router.post('/split', upload.single('file'), splitPDF);

// POST /api/pdf/compress - Compress PDF
router.post('/compress', upload.single('file'), compressController.compressPDF);

// POST /api/pdf/pdf-to-word - Convert PDF to Word
router.post("/pdf-to-word", upload.single("file"), pdfToWord);

// POST /api/pdf/pdf-to-ppt - Convert PDF to PowerPoint
router.post("/pdf-to-ppt", upload.single("file"), pdfToPpt);

// POST /api/pdf/pdf-to-excel - Convert PDF to Excel
router.post("/pdf-to-excel", upload.single("file"), pdfToExcel);

// POST /api/pdf/word-to-pdf - Convert Word to PDF
router.post("/word-to-pdf", upload.single("file"), wordToPdf);

// POST /api/pdf/ppt-to-pdf - Convert PPT to PDF
router.post("/ppt-to-pdf", upload.single("file"), pptToPdf);

// POST /api/pdf/excel-to-pdf - Convert Excel to PDF
router.post("/excel-to-pdf", upload.single("file"), excelToPdf);

// POST /api/pdf/pdf-to-jpg - Convert PDF to JPG
router.post("/pdf-to-jpg", upload.single("file"), pdfToJpg);

// POST /api/pdf/jpg-to-pdf - Convert JPG to PDF
router.post("/jpg-to-pdf", upload.array("file"), jpgToPdf);

// POST /api/pdf/rotate-pdf - Rotate PDF pages
router.post("/rotate-pdf", upload.single("file"), rotatePdf);

// POST /api/pdf/html-to-pdf - Convert HTML to PDF
// router.post("/html-to-pdf", express.json(), htmlToPdf);

// POST /api/pdf/protect-pdf - Protect PDF
router.post("/protect-pdf", upload.single("file"), protectPdf);

// POST /api/pdf/unlock-pdf - Unlock PDF
router.post("/unlock-pdf", upload.single("file"), unlockPdf);

// POST /api/pdf/organize-pdf - Organize PDF
router.post("/organize-pdf", upload.single("file"), organizePdf);

// POST /api/pdf/pdf-to-pdfa - Convert PDF to PDF/A
router.post("/pdf-to-pdfa", upload.single("file"), pdfToPDFA);

// POST /api/pdf/repair-pdf - Repair PDF
router.post("/repair-pdf", upload.single("file"), repairPdf);

// POST /api/pdf/page-numbers - Add Page Numbers
router.post("/page-numbers", upload.single("file"), addPageNumbers);

module.exports = router;
