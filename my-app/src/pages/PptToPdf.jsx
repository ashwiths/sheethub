import React from "react";
import ToolLayout from "../components/ToolLayout";

export default function PptToPdf() {
  const handleConvert = async (files) => {
    if (!files || files.length === 0) {
      throw new Error("Please upload a PowerPoint file.");
    }

    const file = files[0].file || files[0];

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`\${import.meta.env.VITE_API_URL}/api/pdf/ppt-to-pdf`, {
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
      toolId="ppt-to-pdf"
      actionLabel="Convert to PDF"
      outputFileName="converted.pdf"
      allowMultiple={false}
      accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PPT/PPTX file." },
        { num: "2", title: "Convert", desc: "Our system accurately converts it to PDF." },
        { num: "3", title: "Download", desc: "Get your fully formatted PDF document." },
      ]}
      features={[
        "Preserves exact slide formatting",
        "Fast and secure conversion",
        "Securely deletes file post-processing",
      ]}
      onProcess={handleConvert}
    />
  );
}
