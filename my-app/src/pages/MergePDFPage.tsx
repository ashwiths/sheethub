import ToolLayout from "../components/ToolLayout";
import { mergePDFs } from "../api/pdfApi";

export default function MergePDFPage() {
  const handleMerge = async (files: File[]): Promise<Blob> => {
    // 1. Validate at least 2 files
    if (files.length < 2) {
      throw new Error("Upload at least 2 PDF files");
    }
    // 2. Validate max 10 files
    if (files.length > 10) {
      throw new Error("Maximum 10 files allowed");
    }

    try {
      console.log(`Sending ${files.length} files to backend for merging...`);
      const mergedBlob = await mergePDFs(files);
      console.log("Successfully received merged blob from backend!");
      return mergedBlob; 
    } catch (error: any) {
      throw new Error(error.message || "Failed to merge PDFs via backend API.");
    }
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
        "Handled securely by backend API",
        "Unlimited merges, always free",
      ]}
      isSortable={true}
      onProcess={handleMerge}
    />
  );
}
