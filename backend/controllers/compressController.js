const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

exports.compressPDF = async (req, res) => {
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const level = req.body.level || 'recommended';
    console.log("Compression level:", level);

    // Map requested string levels to Ghostscript PDFSETTINGS
    const levelMapping = {
      extreme: '/screen',
      recommended: '/ebook',
      less: '/printer'
    };

    const pdfSetting = levelMapping[level] || '/ebook';

    // Ensure backend/output/ directory exists
    const outputDir = "/tmp";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const inputPath = req.file.path;
    outputPath = path.join(outputDir, `compressed_${Date.now()}.pdf`);

    // Build Ghostscript command (paths wrapped in quotes for safety)
    const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${pdfSetting} -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;

    // Execute Ghostscript compression
    await execPromise(gsCommand);

    // Send the compressed file back and clean up immediately after
    res.download(outputPath, 'compressed.pdf', (err) => {
      if (err) {
        console.error('Error sending compressed file:', err);
      }
      
      // Delete uploaded file after processing
      fs.unlink(inputPath, (unlinkErr) => {
        if (unlinkErr) console.error('Failed to delete uploaded PDF:', unlinkErr);
      });
      
      // Delete the generated compressed file
      fs.unlink(outputPath, (unlinkErr) => {
        if (unlinkErr) console.error('Failed to delete output PDF:', unlinkErr);
      });
    });

  } catch (error) {
    console.error('Compression Error:', error);
    
    // Clean up temporary files quietly upon an error execution
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, () => {});
    }
    if (outputPath && fs.existsSync(outputPath)) {
      fs.unlink(outputPath, () => {});
    }

    if (!res.headersSent) {
      res.status(500).json({ error: 'An error occurred while compressing the PDF' });
    }
  }
};
