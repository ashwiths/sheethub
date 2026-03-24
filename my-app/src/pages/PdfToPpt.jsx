import React from 'react';
import ToolLayout from '../components/ToolLayout';

export default function PdfToPpt() {
  const handleConvert = async (files) => {
    if (!files || files.length === 0) {
      throw new Error("Please upload a PDF file first.");
    }
    
    // ToolLayout wrapping extraction
    const file = files[0].file || files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`\${import.meta.env.VITE_API_URL}/api/pdf/pdf-to-ppt`, {
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
      
      // Return blob — SuccessCard handles download with user-typed filename
      return blob;
    } catch (err) {
      console.error(err);
      throw new Error(err.message || "Failed to convert PDF to PPT");
    }
  };

  return (
    <ToolLayout
      toolId="pdf-to-powerpoint"
      actionLabel="Convert to PowerPoint"
      outputFileName="converted.pptx"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PDF file." },
        { num: "2", title: "Convert", desc: "Each PDF page becomes a distinct layout slide." },
        { num: "3", title: "Download", desc: "Get your beautiful presenter document instantly." },
      ]}
      features={[
        "Perfect 16:9 widescreen layout edge scaling",
        "Zero visual element distortion natively mapped",
        "Instant native slide integration directly on device",
      ]}
      allowMultiple={false}
      onProcess={handleConvert}
    />
  );
}
