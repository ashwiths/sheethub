const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

exports.repairPdf = (req, res) => {
  try {
    console.log("REPAIR PDF API HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = path.resolve(req.file.path);
    const outputPath = inputPath.replace(".pdf", "_repaired.pdf");

    // qpdf repair command
    const command = `qpdf --linearize "${inputPath}" "${outputPath}"`;

    console.log("Running:", command);

    exec(command, (error, stdout, stderr) => {
      console.log("QPDF STDERR:", stderr);

      // 🔥 KEY FIX: ignore warnings if output exists
      if (!fs.existsSync(outputPath)) {
        console.error("QPDF FAILED:", stderr);

        return res.status(500).json({
          error: "Repair failed",
          details: stderr,
        });
      }

      // ✅ SUCCESS EVEN WITH WARNINGS
      res.download(outputPath, "repaired.pdf", () => {
        // Clean up files after download
        try {
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (cleanupErr) {
          console.error("Error during cleanup:", cleanupErr);
        }
      });
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};