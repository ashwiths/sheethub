import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function test() {
  const sourcePdf = await PDFDocument.create();
  sourcePdf.addPage();
  sourcePdf.addPage();
  sourcePdf.addPage();
  const sourceBytes = await sourcePdf.save();

  const loaded = await PDFDocument.load(sourceBytes);
  const totalPages = loaded.getPageCount();
  console.log('total pages', totalPages);

  const splitPdf = await PDFDocument.create();
  const copiedPages = await splitPdf.copyPages(loaded, [0]);
  copiedPages.forEach(p => splitPdf.addPage(p));
  
  const finalBytes = await splitPdf.save();
  const finalLoaded = await PDFDocument.load(finalBytes);
  console.log('split pages', finalLoaded.getPageCount());
}
test().catch(console.error);
