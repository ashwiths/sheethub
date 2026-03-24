const fs = require("fs");
const pdf = require("pdf-parse");
const { diffLines } = require("diff");

exports.comparePdf = async (req, res) => {
  try {
    console.log("COMPARE PDF API HIT");

    if (!req.files || req.files.length !== 2) {
      return res.status(400).json({
        error: "Please upload exactly two PDF files"
      });
    }

    const file1Buffer = fs.readFileSync(req.files[0].path);
    const file2Buffer = fs.readFileSync(req.files[1].path);

    const data1 = await pdf(file1Buffer);
    const data2 = await pdf(file2Buffer);

    const diff = diffLines(data1.text, data2.text);

    const formatted = diff.map(part => ({
      type: part.added ? "added" : part.removed ? "removed" : "unchanged",
      text: part.value
    }));

    res.json({
      message: "Comparison complete",
      differences: formatted
    });

    // cleanup
    fs.unlinkSync(req.files[0].path);
    fs.unlinkSync(req.files[1].path);

  } catch (error) {
    console.error("COMPARE ERROR:", error?.stack || error);
    res.status(500).json({
      error: "Comparison failed",
      message: error.message
    });
  }
};
