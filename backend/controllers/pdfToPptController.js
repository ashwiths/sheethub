const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const pptxgen = require('pptxgenjs');

exports.pdfToPpt = async (req, res) => {
  let outputImagesDir = null;
  let pptxOutputPath = null;

  try {
    console.log("PDF TO PPT API HIT");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const baseOutputName = `slide_${Date.now()}`;
    
    // Ensure directories exist
    const outputDir = '/tmp';
    outputImagesDir = path.join(outputDir, 'images', baseOutputName);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    if (!fs.existsSync(outputImagesDir)) {
      fs.mkdirSync(outputImagesDir, { recursive: true });
    }

    // Convert PDF to images using native Ghostscript
    // We already know Ghostscript is installed and working from the Compress PDF feature
    const gsCommand = `gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r150 -q -sOutputFile="${path.join(outputImagesDir, 'page-%d.png')}" "${filePath}"`;
    await exec(gsCommand);

    // Read generated images
    const files = fs.readdirSync(outputImagesDir);
    
    // Sort files correctly to match original PDF sequence
    const images = files
      .filter(f => f.endsWith('.png'))
      .sort((a, b) => {
        const numA = parseInt(a.replace(/[^0-9]/g, '')) || 0;
        const numB = parseInt(b.replace(/[^0-9]/g, '')) || 0;
        return numA - numB;
      });

    const count = images.length;
    console.log("Pages converted:", count);

    if (count === 0) {
      throw new Error("No pages could be extracted from the PDF");
    }

    // Create PowerPoint
    const pres = new pptxgen();
    pres.layout = 'LAYOUT_16x9';

    for (const imgName of images) {
      const slide = pres.addSlide();
      slide.addImage({ 
        path: path.join(outputImagesDir, imgName), 
        x: 0, 
        y: 0, 
        w: '100%', 
        h: '100%' 
      });
    }

    // Save PPTX
    pptxOutputPath = path.join(outputDir, `converted_${Date.now()}.pptx`);
    await pres.writeFile({ fileName: pptxOutputPath });

    // Send response and cleanup
    res.download(pptxOutputPath, "converted.pptx", (err) => {
      if (err) {
        console.error("Download Error:", err?.stack || err);
      }
      
      // Cleanup logic
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (fs.existsSync(pptxOutputPath)) fs.unlinkSync(pptxOutputPath);
        
        if (fs.existsSync(outputImagesDir)) {
          const imgs = fs.readdirSync(outputImagesDir);
          for (const img of imgs) {
            fs.unlinkSync(path.join(outputImagesDir, img));
          }
          fs.rmdirSync(outputImagesDir);
        }
      } catch (cleanupError) {
        console.error("Cleanup error after download:", cleanupError?.stack || cleanupError);
      }
    });

  } catch (error) {
    console.error("PDF TO PPT ERROR:", error?.stack || error);

    // Error Rollback cleanups
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch(e){}
    }
    
    if (pptxOutputPath && fs.existsSync(pptxOutputPath)) {
      try { fs.unlinkSync(pptxOutputPath); } catch(e){}
    }

    if (outputImagesDir && fs.existsSync(outputImagesDir)) {
      try {
        const imgs = fs.readdirSync(outputImagesDir);
        for (const img of imgs) {
          fs.unlinkSync(path.join(outputImagesDir, img));
        }
        fs.rmdirSync(outputImagesDir);
      } catch(e){}
    }

    if (!res.headersSent) {
      res.status(500).json({
        error: "Conversion failed",
        message: error.message
      });
    }
  }
};
