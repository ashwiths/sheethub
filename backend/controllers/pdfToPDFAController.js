const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

exports.pdfToPDFA = (req, res) => {
  try {
    console.log("PDF TO PDFA API HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = path.resolve(req.file.path);
    const outputPath = inputPath.replace(".pdf", "_pdfa.pdf");

    const command = `gs -dPDFA=2 -dBATCH -dNOPAUSE -sDEVICE=pdfwrite -sColorConversionStrategy=RGB -sProcessColorModel=DeviceRGB -sOutputFile="${outputPath}" "${inputPath}"`;

    console.log("Running:", command);

    exec(command, (error, stdout, stderr) => {
      // Allow execution to succeed if there are non-fatal warnings as long as the file is created
      if (error && !fs.existsSync(outputPath)) {
        console.error("GS ERROR:", stderr?.stack || stderr);
        return res.status(500).json({
          error: "PDF/A conversion failed",
          details: stderr,
        });
      }

      if (!fs.existsSync(outputPath)) {
        return res.status(500).json({
          error: "Output file not created",
        });
      }

      res.download(outputPath, "converted_pdfa.pdf", () => {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      });
    });

  } catch (err) {
    console.error("SERVER ERROR:", err?.stack || err);
    res.status(500).json({ error: "Server error" });
  }
};
