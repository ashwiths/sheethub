const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');

async function createPdf() {
  const pdfBytes = fs.readFileSync('valid.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;
  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    const text = `Page ${index + 1} of ${totalPages}`;
    page.drawText(text, {
      x: width / 2 - 50,
      y: 20,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });
  });
  const finalPdf = await pdfDoc.save();
  fs.writeFileSync('valid-numbered.pdf', finalPdf);
  console.log("Success");
}
createPdf().catch(console.error);
