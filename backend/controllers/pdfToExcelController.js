const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const XLSX = require("xlsx");

exports.pdfToExcel = async (req, res) => {
  let outputPath = null;

  try {
    console.log("PDF TO EXCEL API HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = req.file.path;
    const dataBuffer = fs.readFileSync(inputPath);

    // Extract text safely relying on our updated, stable pdf-parse install
    const pdfData = await pdfParse(dataBuffer);

    if (!pdfData || !pdfData.text || pdfData.text.trim() === "") {
      throw new Error("No readable text found in PDF (scanned documents not supported)");
    }

    // Convert text into rows stripping empty lines
    const lines = pdfData.text.split("\n").map(line => line.trim()).filter(line => line !== "");
    const rows = lines.map(line => [line]);

    // Build the Excel workbook
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Ensure output directory exists
    const outputDir = "/tmp";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save and transmit
    outputPath = path.join(outputDir, `converted_${Date.now()}.xlsx`);
    XLSX.writeFile(workbook, outputPath);

    res.download(outputPath, "converted.xlsx", (err) => {
      if (err) console.error("Error downloading Excel file:", err);

      try {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      } catch (cleanupError) {
        console.error("Cleanup error after download:", cleanupError);
      }
    });

  } catch (error) {
    console.error("PDF TO EXCEL ERROR:", error);

    // Rollback uploaded file
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }

    // Rollback output file
    if (outputPath && fs.existsSync(outputPath)) {
      try { fs.unlinkSync(outputPath); } catch (e) {}
    }

    if (!res.headersSent) {
      res.status(500).json({
        error: "Conversion failed",
        message: error.message
      });
    }
  }
};
