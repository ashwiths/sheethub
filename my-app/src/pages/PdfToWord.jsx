import React from 'react';
import ToolLayout from '../components/ToolLayout';

export default function PdfToWord() {
  const handleConvert = async (files) => {
    if (!files || files.length === 0) {
      throw new Error("Please upload a PDF file first.");
    }
    
    // ToolLayout wraps files natively, we extract the File object properly
    const file = files[0].file || files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/pdf/pdf-to-word", {
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

      // Define blob properly
      const blob = await response.blob();
      
      // Return blob — SuccessCard handles download with user-typed filename
      return blob;
    } catch (err) {
      console.error(err);
      throw new Error(err.message || "Failed to convert PDF"); 
    }
  };

  return (
    <ToolLayout
      toolId="pdf-to-word"
      actionLabel="Convert to Word"
      outputFileName="converted.docx"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PDF file." },
        { num: "2", title: "Convert", desc: "Our system accurately extracts text and formatting." },
        { num: "3", title: "Download", desc: "Get your fully editable Word document instantly." },
      ]}
      features={[
        "Preserves exact document layer structure",
        "Retains font tracking organically",
        "Securely deletes file post-processing",
      ]}
      allowMultiple={false}
      onProcess={handleConvert}
    />
  );
}
