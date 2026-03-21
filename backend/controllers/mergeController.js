const { mergePDFFiles } = require('../utils/pdfUtils');
const path = require('path');
const fs = require('fs');

/**
 * Merge multiple PDF files into one
 */
const mergePDFs = async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'At least 2 PDF files are required.' });
    }

    const filePaths = req.files.map((file) => file.path);
    const outputFileName = `merged_${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, '../output', outputFileName);

    await mergePDFFiles(filePaths, outputPath);

    // Clean up uploaded files
    filePaths.forEach((filePath) => {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    });

    res.download(outputPath, outputFileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Clean up output file after sending
      fs.unlink(outputPath, () => {});
    });
  } catch (error) {
    console.error('Merge error:', error);
    res.status(500).json({ error: 'Failed to merge PDFs.' });
  }
};

module.exports = { mergePDFs };
