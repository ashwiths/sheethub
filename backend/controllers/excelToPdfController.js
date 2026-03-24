const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

exports.excelToPdf = async (req, res) => {
  try {
    console.log("EXCEL TO PDF API HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = req.file.path;
    console.log("File received:", inputPath);

    const outputDir = "/tmp";

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const command = `soffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Conversion error:", error?.stack || error);
        return res.status(500).json({
          error: "Conversion failed",
          message: error.message,
        });
      }

      const fileName = path.basename(inputPath).replace(/\.(xls|xlsx)$/i, ".pdf");
      const outputPath = path.join(outputDir, fileName);

      if (!fs.existsSync(outputPath)) {
        return res.status(500).json({
          error: "Conversion failed",
          message: "Output file not found",
        });
      }

      console.log("EXCEL → PDF success:", outputPath);

      res.download(outputPath, fileName, (err) => {
        try {
          // Cleanup
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError?.stack || cleanupError);
        }

        if (err) {
          console.error("Download error:", err?.stack || err);
        }
      });
    });

  } catch (error) {
    console.error("EXCEL TO PDF ERROR:", error?.stack || error);
    res.status(500).json({
      error: "Conversion failed",
      message: error.message,
    });
  }
};
