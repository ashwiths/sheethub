const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

exports.unlockPdf = (req, res) => {
  try {
    console.log("UNLOCK PDF API HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const password = req.body.password;

    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    const inputPath = path.resolve(req.file.path);
    const outputPath = inputPath.replace(".pdf", "_unlocked.pdf");

    const command = `qpdf --password="${password}" --decrypt "${inputPath}" "${outputPath}"`;

    console.log("Running:", command);

    exec(command, (error, stdout, stderr) => {
      // Safely ignore code 3 (warnings) if the output file was generated successfully
      if (error && (error.code !== 3 || !fs.existsSync(outputPath))) {
        console.error("QPDF ERROR:", stderr?.stack || stderr);

        // Wrong password handling
        if (stderr.includes("invalid password")) {
          return res.status(400).json({
            error: "Incorrect password",
          });
        }

        return res.status(500).json({
          error: "Failed to unlock PDF",
          details: stderr,
        });
      }

      // Check output file
      if (!fs.existsSync(outputPath)) {
        return res.status(500).json({
          error: "Output file not created",
        });
      }

      res.download(outputPath, "unlocked.pdf", () => {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      });
    });

  } catch (err) {
    console.error("SERVER ERROR:", err?.stack || err);
    res.status(500).json({ error: "Server error" });
  }
};
