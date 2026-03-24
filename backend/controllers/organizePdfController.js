const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

exports.organizePdf = async (req, res) => {
  try {
    console.log("ORGANIZE PDF API HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const order = JSON.parse(req.body.order || "[]");

    if (!order.length) {
      return res.status(400).json({ error: "Page order required" });
    }

    const pdfBytes = fs.readFileSync(req.file.path);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();

    const pages = await newPdf.copyPages(pdfDoc, order);

    pages.forEach((page) => newPdf.addPage(page));

    const finalPdf = await newPdf.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=organized.pdf");

    res.send(Buffer.from(finalPdf));

    fs.unlinkSync(req.file.path);

  } catch (error) {
    console.error("ORGANIZE PDF ERROR:", error?.stack || error);
    res.status(500).json({
      error: "Failed to organize PDF",
      message: error.message,
    });
  }
};
