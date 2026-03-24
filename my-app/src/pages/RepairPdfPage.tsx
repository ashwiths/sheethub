import ToolLayout from "../components/ToolLayout";

export default function RepairPdfPage() {
  const handleRepair = async (files: File[]): Promise<Blob> => {
    if (!files.length) {
      throw new Error("Please upload a PDF file");
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pdf/repair`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Repair failed. Please ensure the PDF is not password protected.");
    }

    return await response.blob();
  };

  return (
    <ToolLayout
      toolId="repair-pdf"
      accept=".pdf"
      allowMultiple={false}
      actionLabel="Repair PDF"
      outputFileName="repaired.pdf"
      onProcess={handleRepair}
    />
  );
}
