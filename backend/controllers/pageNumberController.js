const fs = require("fs"); 
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib"); 

exports.addPageNumbers = async (req, res) => { 
  try { 
    console.log("PAGE NUMBER API HIT"); 

    if (!req.file) { 
      return res.status(400).json({ error: "No file uploaded" }); 
    } 

    const pdfBytes = fs.readFileSync(req.file.path); 

    // ignoreEncryption: true helps prevent errors with some PDF files
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true }); 
    const pages = pdfDoc.getPages(); 

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica); 

    const totalPages = pages.length; 

    pages.forEach((page, index) => { 
      const { width, height } = page.getSize(); 

      const text = `Page ${index + 1} of ${totalPages}`; 

      page.drawText(text, { 
        x: width / 2 - 50, 
        y: 20, 
        size: 10, 
        font: font, 
        color: rgb(0, 0, 0), 
      }); 
    }); 

    const finalPdf = await pdfDoc.save(); 

    res.setHeader("Content-Type", "application/pdf"); 
    res.setHeader("Content-Disposition", "attachment; filename=page-numbered.pdf"); 

    res.send(Buffer.from(finalPdf)); 

  } catch (error) { 
    console.error("PAGE NUMBER ERROR:", error?.stack || error); 
    res.status(500).json({ 
      error: "Failed to add page numbers", 
      message: error.message, 
    }); 
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error("Failed to clean up file:", cleanupError?.stack || cleanupError);
      }
    }
  }
}; 