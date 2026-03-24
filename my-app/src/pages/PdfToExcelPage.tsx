import ToolLayout from "../components/ToolLayout";

export default function PdfToExcelPage() {
  const handleConvert = async (files: any[]) => {
    if (!files || files.length === 0) {
      throw new Error("Please upload a PDF file first.");
    }
    
    // Extract file safely from ToolLayout
    const file = files[0].file || files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pdf/pdf-to-excel`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const blob = await response.blob();
      
      // Return blob — SuccessCard handles download with user-typed filename
      return blob;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to convert PDF to Excel");
    }
  };

  return (
    <ToolLayout
      toolId="pdf-to-excel"
      actionLabel="Convert to Excel"
      outputFileName="converted.xlsx"
      allowMultiple={false}
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your file." },
        { num: "2", title: "Convert to Excel", desc: "Configure settings and click start." },
        { num: "3", title: "Download", desc: "Get your processed file instantly." },
      ]}
      features={[
        "High quality processing",
        "Fast and secure",
        "Unlimited free usage",
      ]}
      onProcess={handleConvert}
    />
  );
}
