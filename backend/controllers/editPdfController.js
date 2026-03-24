const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");

exports.editPdf = async (req, res) => {
  try {
    console.log("EDIT PDF API HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = req.file.path;
    const editsRaw = req.body.edits; // JSON string

    if (!editsRaw) {
      return res.status(400).json({ error: "No edit data provided" });
    }

    let editData;
    try {
      editData = JSON.parse(editsRaw);
    } catch (e) {
      return res.status(400).json({ error: "Invalid edit data JSON" });
    }

    const { texts = [], images = [] } = editData;

    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    // In a production app, fonts might need to be explicitly embedded. Here we use standard Helvetica.
    const font = await pdfDoc.embedFont(require("pdf-lib").StandardFonts.Helvetica);

    // Apply text edits
    for (const t of texts) {
      const pageIndex = t.page || 0;
      if (pageIndex < pages.length) {
        const page = pages[pageIndex];
        // PDF-lib y-axis goes completely bottom-up (0,0 is bottom left).
        // The frontend will likely send x, y from top-left (fabric.js style)
        // We will do a generic naive apply relying on what the frontend calibrated. 
        page.drawText(t.text, {
          x: t.x,
          y: page.getHeight() - t.y - (t.size || 14), // rudimentary inversion
          size: t.size || 14,
          font: font,
          color: rgb(0, 0, 0),
        });
      }
    }

    // Apply image edits
    for (const img of images) {
      const pageIndex = img.page || 0;
      if (pageIndex < pages.length) {
        const page = pages[pageIndex];
        
        let embeddedImage;
        if (img.base64.startsWith("data:image/png")) {
          embeddedImage = await pdfDoc.embedPng(img.base64);
        } else if (img.base64.startsWith("data:image/jpeg") || img.base64.startsWith("data:image/jpg")) {
          embeddedImage = await pdfDoc.embedJpg(img.base64);
        } else {
          // Fallback guess
          embeddedImage = await pdfDoc.embedPng(img.base64);
        }

        page.drawImage(embeddedImage, {
          x: img.x,
          y: page.getHeight() - img.y - img.height, // invert y for top-left drawing
          width: img.width,
          height: img.height,
        });
      }
    }

    const modifiedPdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=edited.pdf");

    res.send(Buffer.from(modifiedPdfBytes));

    // Cleanup
    try { fs.unlinkSync(inputPath); } catch (e) {}

  } catch (error) {
    console.error("EDIT PDF ERROR:", error?.stack || error);
    res.status(500).json({
      error: "Failed to edit PDF",
      message: error.message,
    });
  }
};
