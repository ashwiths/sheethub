const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

exports.wordToPdf = (req, res) => {

  console.log("WORD TO PDF API HIT");

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = req.file.path;
    const outputDir = "/tmp";

    // Ensure output folder exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // IMPORTANT: quotes handle spaces in file paths
    const command = `soffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;

    exec(command, (error) => {

      if (error) {
        console.error("Conversion error:", error?.stack || error);

        // cleanup input file
        try { fs.unlinkSync(inputPath); } catch {}

        return res.status(500).json({
          error: "Conversion failed"
        });
      }

      const baseName = path.basename(inputPath).replace(/\.(docx?|odt)$/i, "");
      const outputPath = path.join(outputDir, `${baseName}.pdf`);

      console.log("Converted file:", outputPath);

      res.download(outputPath, `${baseName}.pdf`, () => {

        // cleanup files after download
        try { fs.unlinkSync(inputPath); } catch {}
        try { fs.unlinkSync(outputPath); } catch {}

      });

    });

  } catch (err) {

    console.error("WORD TO PDF ERROR:", err?.stack || err);

    return res.status(500).json({
      error: "Conversion failed",
      message: err.message
    });

  }
};
