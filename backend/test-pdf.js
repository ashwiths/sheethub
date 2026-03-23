const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage([600, 400]);
  pdfDoc.addPage([600, 400]);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('valid.pdf', pdfBytes);
}
createPdf();
