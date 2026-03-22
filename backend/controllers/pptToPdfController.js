const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

exports.pptToPdf = async (req, res) => {
  try {
    console.log("PPT TO PDF API HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", req.file.path);

    const inputPath = req.file.path;
    const outputDir = path.join(__dirname, "../output");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const command = `soffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Conversion error:", error);
        return res.status(500).json({
          error: "Conversion failed",
          message: error.message,
        });
      }

      const fileName = path.basename(inputPath).replace(/\.(ppt|pptx)$/i, ".pdf");
      const outputPath = path.join(outputDir, fileName);

      if (!fs.existsSync(outputPath)) {
        return res.status(500).json({
          error: "Conversion failed",
          message: "Output file not found",
        });
      }

      console.log("Conversion success:", outputPath);

      res.download(outputPath, fileName, (err) => {
        // Cleanup files
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);

        if (err) {
          console.error("Download error:", err);
        }
      });
    });

  } catch (error) {
    console.error("PPT TO PDF ERROR:", error);
    res.status(500).json({
      error: "Conversion failed",
      message: error.message,
    });
  }
};
