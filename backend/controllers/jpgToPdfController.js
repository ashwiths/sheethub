const { PDFDocument } = require("pdf-lib");
const fs = require("fs");

exports.jpgToPdf = async (req, res) => {
  try {
    console.log("JPG TO PDF API HIT");

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      const imgBytes = fs.readFileSync(file.path);

      let image;
      if (file.mimetype === "image/png") {
        image = await pdfDoc.embedPng(imgBytes);
      } else {
        image = await pdfDoc.embedJpg(imgBytes);
      }

      const { width, height } = image.scale(1);

      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");

    res.send(Buffer.from(pdfBytes));

    // cleanup
    req.files.forEach(file => {
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        console.error("Cleanup error:", e?.stack || e);
      }
    });

  } catch (error) {
    console.error("JPG TO PDF ERROR:", error?.stack || error);
    res.status(500).json({
      error: "Conversion failed",
      message: error.message,
    });
  }
};
