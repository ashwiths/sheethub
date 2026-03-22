const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const archiver = require("archiver");

exports.pdfToJpg = async (req, res) => {
  console.log("PDF TO JPG API HIT");

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = req.file.path;
    console.log("File received:", inputPath);

    const timestamp = Date.now();
    const outputDir = path.join(__dirname, `../output/images_${timestamp}`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const command = `pdftoppm -jpeg "${inputPath}" "${path.join(outputDir, "page")}"`;
    await new Promise((resolve, reject) => {
      exec(command, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    const files = fs.readdirSync(outputDir).filter(f => f.endsWith(".jpg") || f.endsWith(".jpeg"));
    console.log(`Pages converted: ${files.length}`);

    if (files.length === 0) {
      throw new Error("No images were generated");
    }

    if (files.length === 1) {
      // Single page -> Download JPG directly
      const singleImagePath = path.join(outputDir, files[0]);
      res.setHeader("Content-Type", "image/jpeg");
      res.download(singleImagePath, "converted.jpg", (err) => {
        // Cleanup
        try { fs.unlinkSync(inputPath); } catch (e) {}
        try { fs.unlinkSync(singleImagePath); } catch (e) {}
        try { fs.rmdirSync(outputDir); } catch (e) {}
        
        if (err) console.error("Download error:", err);
      });
    } else {
      // Multiple pages -> Zip directly to response
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=images.zip");

      const archive = archiver("zip", { zlib: { level: 9 } });

      archive.pipe(res);

      files.forEach((file) => {
        archive.file(path.join(outputDir, file), { name: file });
      });

      archive.on("error", (err) => {
        throw err;
      });

      res.on("close", () => {
        try {
          fs.unlinkSync(inputPath);
          files.forEach(f => fs.unlinkSync(path.join(outputDir, f)));
          fs.rmdirSync(outputDir);
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      });

      await archive.finalize();
    }

  } catch (error) {
    console.error("PDF TO JPG ERROR:", error);
    res.status(500).json({
      error: "Conversion failed",
      message: error.message,
    });
  }
};
