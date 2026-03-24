import React from "react";
import ToolLayout from "../components/ToolLayout";

export default function JpgToPdf() {
  const handleConvert = async (files) => {
    if (!files || files.length === 0) {
      throw new Error("Please upload at least one image file.");
    }

    const formData = new FormData();
    files.forEach(f => {
      formData.append("file", f.file || f);
    });

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pdf/jpg-to-pdf`, {
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
      toolId="jpg-to-pdf"
      actionLabel="Convert to PDF"
      outputFileName="converted.pdf"
      allowMultiple={true}
      isSortable={true}
      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your image files." },
        { num: "2", title: "Convert", desc: "Our system safely creates a beautiful PDF page for each." },
        { num: "3", title: "Download", desc: "Instantly grab your brand new PDF document." },
      ]}
      features={[
        "Preserves image bounds precisely",
        "Combine multiple images safely",
        "Securely encrypted transfers",
        "Securely deletes files post-processing",
      ]}
      onProcess={handleConvert}
    />
  );
}
