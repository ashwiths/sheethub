import React from "react";
import ToolLayout from "../components/ToolLayout";

export default function WordToPDF() {
  const handleConvert = async (files) => {
    if (!files || files.length === 0) {
      throw new Error("Please upload a Word file.");
    }

    const file = files[0].file || files[0];

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pdf/word-to-pdf`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMsg = "Conversion failed";
      try {
        const errorData = await response.json();
        if (errorData.error) errorMsg = errorData.error;
      } catch (e) {}
      throw new Error(errorMsg);
    }

    const blob = await response.blob();
    return blob;
  };

  return (
    <ToolLayout
      toolId="word-to-pdf"
      actionLabel="Convert to PDF"
      outputFileName="converted.pdf"
      allowMultiple={false}
      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your Word file." },
        { num: "2", title: "Convert", desc: "Our system accurately converts it to PDF." },
        { num: "3", title: "Download", desc: "Get your fully formatted PDF document." },
      ]}
      features={[
        "Preserves exact document formatting",
        "Fast and secure conversion",
        "Securely deletes file post-processing",
      ]}
      onProcess={handleConvert}
    />
  );
}
