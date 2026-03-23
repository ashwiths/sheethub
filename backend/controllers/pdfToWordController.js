const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { Document, Packer, Paragraph, TextRun } = require("docx");

exports.pdfToWord = async (req, res) => {
  let outputPath = null;

  try {
    console.log("PDF TO WORD API HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    console.log("File received:", filePath);

    // Read PDF file
    const dataBuffer = fs.readFileSync(filePath);

    // Extract text from PDF
    const pdfData = await pdfParse(dataBuffer);

    // Handle empty or scanned PDFs
    if (!pdfData || !pdfData.text || pdfData.text.trim() === "") {
      throw new Error("No extractable text (scanned PDF)");
    }

    console.log("Text length:", pdfData.text.length);

    // Split text into lines/paragraphs
    const lines = pdfData.text.split("\n");

    // Convert to Word document
    const doc = new Document({
      sections: [
        {
          children: lines.map((line) => {
            return new Paragraph({
              children: [new TextRun(line)],
            });
          }),
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    // Ensure output directory exists
    const outputDir = "/tmp";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save Output file with unique name
    outputPath = path.join(outputDir, `converted_${Date.now()}.docx`);
    fs.writeFileSync(outputPath, buffer);

    // Send file and perform cleanup
    res.download(outputPath, "converted.docx", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
      }

      // Delete uploaded file and output file after response
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError);
      }
    });

  } catch (error) {
    console.error("PDF TO WORD ERROR:", error);

    // Cleanup input file if something fails
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // ignore
      }
    }

    // Cleanup output file if something fails
    if (outputPath && fs.existsSync(outputPath)) {
      try {
        fs.unlinkSync(outputPath);
      } catch (e) {
        // ignore
      }
    }

    // Return the expected error format
    if (!res.headersSent) {
      res.status(500).json({
        error: "Conversion failed",
        message: error.message,
      });
    }
  }
};