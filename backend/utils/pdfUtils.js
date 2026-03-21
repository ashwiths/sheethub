const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

/**
 * Merge multiple PDF files into a single PDF
 * @param {string[]} filePaths - Array of file paths to merge
 * @param {string} outputPath - Output file path for the merged PDF
 */
const mergePDFFiles = async (filePaths, outputPath) => {
  const mergedPdf = await PDFDocument.create();

  for (const filePath of filePaths) {
    const fileBuffer = fs.readFileSync(filePath);
    const pdf = await PDFDocument.load(fileBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(outputPath, mergedPdfBytes);
};

module.exports = { mergePDFFiles };
