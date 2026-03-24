const { PDFDocument, degrees } = require("pdf-lib");
const fs = require("fs");

exports.rotatePdf = async (req, res) => {
  try {
    console.log("ROTATE PDF API HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const angle = parseInt(req.body.angle) || 90;

    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();

    pages.forEach(page => {
      // Get current rotation, add new angle, and set. 
      // Some PDFs already have rotation metadata.
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + angle));
    });

    const modifiedPdf = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=rotated.pdf");

    res.send(Buffer.from(modifiedPdf));

    try { fs.unlinkSync(req.file.path); } catch (e) {}

  } catch (error) {
    console.error("ROTATE PDF ERROR:", error?.stack || error);
    res.status(500).json({
      error: "Rotation failed",
      message: error.message,
    });
  }
};
