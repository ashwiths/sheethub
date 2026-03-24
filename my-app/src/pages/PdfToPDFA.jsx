import React from 'react';
import ToolLayout from '../components/ToolLayout';

export default function PdfToPDFA() {
  const handleConvert = async (files) => {
    if (!files || files.length === 0) {
      throw new Error("Please upload a PDF file first.");
    }
    
    // Extract file safely (ToolLayout usually wraps it)
    const file = files[0].file || files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`\${import.meta.env.VITE_API_URL}/api/pdf/pdf-to-pdfa`, {
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

      // Return the blob. ToolLayout automatically handles downloading it locally.
      return await response.blob();
    } catch (err) {
      console.error(err);
      throw new Error(err.message || "Failed to convert to PDF/A"); 
    }
  };

  return (
    <ToolLayout
      toolId="pdf-to-pdfa"
      actionLabel="Convert to PDF/A"
      outputFileName="converted_pdfa.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PDF file." },
        { num: "2", title: "Format", desc: "Ghostscript normalizes fonts and colors." },
        { num: "3", title: "Download", desc: "Get your archival-ready PDF/A." },
      ]}
      features={[
        "ISO 19005 standard compliance",
        "Fully embedded fonts & colors",
        "Ready for long-term archiving",
      ]}
      allowMultiple={false}
      onProcess={handleConvert}
    />
  );
}
