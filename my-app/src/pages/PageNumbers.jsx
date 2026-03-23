import React from 'react';
import ToolLayout from '../components/ToolLayout';

export default function PageNumbers() {
  const handleConvert = async (files) => {
    if (!files || files.length === 0) {
      throw new Error("Please upload a PDF file first.");
    }
    
    // ToolLayout wraps files, we extract the File object properly
    const file = files[0].file || files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/pdf/page-numbers", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = "Failed to add page numbers";
        try {
          const errorData = await response.json();
          if (errorData.error) errorMsg = errorData.error;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      const blob = await response.blob();
      return blob;
    } catch (err) {
      console.error(err);
      throw new Error(err.message || "Error adding page numbers"); 
    }
  };

  return (
    <ToolLayout
      toolId="page-numbers"
      actionLabel="Add Page Numbers"
      outputFileName="numbered.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PDF file." },
        { num: "2", title: "Add Page Numbers", desc: "Our system inserts page numbers securely." },
        { num: "3", title: "Download", desc: "Get your numbered document instantly." },
      ]}
      features={[
        "Clean page numbering",
        "Fast and secure",
        "No watermark added",
      ]}
      allowMultiple={false}
      onProcess={handleConvert}
    />
  );
}
