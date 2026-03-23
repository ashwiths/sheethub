const fs = require("fs");
const sharp = require("sharp");
const { PDFDocument } = require("pdf-lib");

exports.cropFile = async (req, res) => {
  try {
    console.log("CROP API HIT");

    const { x, y, width, height } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const mime = req.file.mimetype;

    //--------------------------------------------------
    // IMAGE CROP
    //--------------------------------------------------
    if (mime.startsWith("image")) {
      const outputPath = filePath + "_cropped.png";

      await sharp(filePath)
        .extract({
          left: parseInt(x),
          top: parseInt(y),
          width: parseInt(width),
          height: parseInt(height),
        })
        .toFile(outputPath);

      const fileBuffer = fs.readFileSync(outputPath);

      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", "attachment; filename=cropped.png");

      res.send(fileBuffer);

      fs.unlinkSync(filePath);
      fs.unlinkSync(outputPath);
      return;
    }

    //--------------------------------------------------
    // PDF CROP
    //--------------------------------------------------
    if (mime === "application/pdf") {
      const pdfBytes = fs.readFileSync(filePath);
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const page = pdfDoc.getPages()[0];

      page.setCropBox(
        parseInt(x),
        parseInt(y),
        parseInt(width),
        parseInt(height)
      );

      const finalPdf = await pdfDoc.save();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=cropped.pdf");

      res.send(Buffer.from(finalPdf));

      fs.unlinkSync(filePath);
      return;
    }

    //--------------------------------------------------
    // INVALID TYPE
    //--------------------------------------------------
    res.status(400).json({
      error: "Unsupported file type",
    });

  } catch (error) {
    console.error("CROP ERROR:", error);
    res.status(500).json({
      error: "Crop failed",
      message: error.message,
    });
  }
};
