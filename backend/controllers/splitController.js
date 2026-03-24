const { PDFDocument } = require('pdf-lib');
const fsPromises = require('fs').promises;
const path = require('path');

exports.splitPDF = async (req, res) => {
  let outputPath = null;
  console.log("Split API hit");

  try {
    // 1. Check for File
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const { pages } = req.body;
    if (!pages) {
      await fsPromises.unlink(req.file.path).catch(console.error);
      return res.status(400).json({ error: 'Pages parameter is required (e.g., "1-3" or "2,5")' });
    }

    // 2. Input Validation
    // Validates formats like "1-3", "2,5", "1-3,5" avoiding invalid strings like "abc", "-1", "1000" (handled later by range check)
    const isValidFormat = /^(\d+(-\d+)?)(,\s*\d+(-\d+)?)*$/.test(pages.replace(/\s+/g, ''));
    if (!isValidFormat) {
      await fsPromises.unlink(req.file.path).catch(console.error);
      return res.status(400).json({ error: 'Invalid pages format. Only numbers, commas, and hyphens are allowed (e.g. "1-3", "2,5").' });
    }

    // Read the uploaded file
    const fileBuffer = await fsPromises.readFile(req.file.path);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const totalPages = pdfDoc.getPageCount();

    // 3. Page Range Validation
    const pagesToExtract = new Set();
    const parts = pages.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);

        if (start < 1 || end > totalPages || start > end) {
          await fsPromises.unlink(req.file.path).catch(console.error);
          return res.status(400).json({ error: `Page range out of bounds: ${trimmed}. Document has ${totalPages} pages.` });
        }
        for (let i = start; i <= end; i++) {
          pagesToExtract.add(i - 1); // 0-indexed for pdf-lib
        }
      } else {
        const pageNum = parseInt(trimmed, 10);
        if (pageNum < 1 || pageNum > totalPages) {
          await fsPromises.unlink(req.file.path).catch(console.error);
          return res.status(400).json({ error: `Page number out of bounds: ${trimmed}. Document has ${totalPages} pages.` });
        }
        pagesToExtract.add(pageNum - 1);
      }
    }

    const sortedPages = Array.from(pagesToExtract).sort((a, b) => a - b);
    
    if (sortedPages.length === 0) {
      await fsPromises.unlink(req.file.path).catch(console.error);
      return res.status(400).json({ error: 'No valid pages selected' });
    }

    // Create a new PDF and copy the selected pages
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(pdfDoc, sortedPages);
    
    copiedPages.forEach((page) => {
      newPdf.addPage(page);
    });

    const pdfBytes = await newPdf.save();

    // 4. Safe File Deletion using res.download
    outputPath = path.join(path.dirname(req.file.path), `split_${Date.now()}.pdf`);
    await fsPromises.writeFile(outputPath, pdfBytes);

    // Send the file and trigger cleanup AFTER sending
    res.download(outputPath, 'split.pdf', async (err) => {
      if (err) {
        console.error('Error sending file to client:', err?.stack || err);
      }
      
      // Delete uploaded file inside the callback AFTER response
      await fsPromises.unlink(req.file.path).catch(console.error);
      
      // Delete the generated output file
      if (outputPath) {
        await fsPromises.unlink(outputPath).catch(console.error);
      }
    });

  } catch (error) {
    // 5. Error Handling
    console.error('Split PDF Error:', error?.stack || error);
    
    // Clean up files safely on exception
    if (req.file) {
      await fsPromises.unlink(req.file.path).catch(console.error);
    }
    if (outputPath) {
      await fsPromises.unlink(outputPath).catch(console.error);
    }
    
    if (!res.headersSent) {
      res.status(500).json({ error: 'An internal error occurred while splitting the PDF' });
    }
  }
};
