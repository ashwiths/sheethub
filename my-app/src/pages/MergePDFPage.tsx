import ToolLayout from "../components/ToolLayout";
import { PDFDocument } from "pdf-lib";

export default function MergePDFPage() {
  const handleMerge = async (files: File[]): Promise<Blob> => {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    const pdfBytes = await mergedPdf.save();
    return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  };

  return (
    <ToolLayout
      toolId="merge-pdf"
      actionLabel="Merge PDFs"
      outputFileName="merged.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PDF files." },
        { num: "2", title: "Arrange", desc: "Reorder files to set the final page order." },
        { num: "3", title: "Merge", desc: "Click merge and download your combined PDF." },
      ]}
      features={[
        "Preserves formatting & fonts",
        "No size limit (up to 100MB each)",
        "Unlimited merges, always free",
      ]}
      isSortable={true}
      onProcess={handleMerge}
    />
  );
}
