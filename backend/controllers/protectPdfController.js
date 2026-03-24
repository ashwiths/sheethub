const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

exports.protectPdf = (req, res) => {
  try {
    console.log("PROTECT PDF API HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const password = req.body.password;

    if (!password) {
      return res.status(400).json({ error: "Password required" });
    }

    const inputPath = path.resolve(req.file.path);
    const repairPath = inputPath.replace(".pdf", "_repaired.pdf");
    const outputPath = inputPath.replace(".pdf", "_protected.pdf");

    // Ensure input file exists
    if (!fs.existsSync(inputPath)) {
      return res.status(400).json({ error: "Input file not found" });
    }

    // Step 1: Repair
    const repairCommand = `qpdf --linearize "${inputPath}" "${repairPath}"`;

    // Step 2: Encrypt
    const encryptCommand = `qpdf --encrypt "${password}" "${password}" 256 -- "${repairPath}" "${outputPath}"`;

    console.log("Running:", repairCommand);

    exec(repairCommand, (repairError, stdout, stderr) => {
      // qpdf exits with code 3 for warnings but still successfully outputs the file.
      if (repairError && repairError.code !== 3 && !fs.existsSync(repairPath)) {
        console.error("REPAIR ERROR:", stderr?.stack || stderr);
        return res.status(500).json({ error: "PDF repair failed" });
      }

      console.log("Running:", encryptCommand);

      exec(encryptCommand, (encryptError, stdout2, stderr2) => {
        // Again, ignore code 3 if the output file is generated
        if (encryptError && encryptError.code !== 3 && !fs.existsSync(outputPath)) {
          console.error("ENCRYPT ERROR:", stderr2?.stack || stderr2);
          return res.status(500).json({ error: "Encryption failed" });
        }

        // Ensure output exists
        if (!fs.existsSync(outputPath)) {
          return res.status(500).json({
            error: "Output file not created",
          });
        }

        res.download(outputPath, "protected.pdf", () => {
          // Clean up all temporary files safely
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          if (fs.existsSync(repairPath)) fs.unlinkSync(repairPath);
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });

      });

    });

  } catch (err) {
    console.error("SERVER ERROR:", err?.stack || err);
    res.status(500).json({ error: "Server error" });
  }
};
