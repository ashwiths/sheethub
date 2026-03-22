import React, { useState } from "react";
import ToolLayout from "../components/ToolLayout";

export default function WordToPDF() {
  const [fileName, setFileName] = useState("");
  const [defaultName, setDefaultName] = useState("converted");

  const handleConvert = async (files) => {
    if (!files || files.length === 0) {
      throw new Error("Please upload a Word file.");
    }

    const file = files[0].file || files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/pdf/word-to-pdf", {
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

      // Extract filename from backend
      const contentDisposition = response.headers.get("content-disposition");
      let extractedName = "converted";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          // Remove the extension (.pdf) to just get the base name
          extractedName = match[1].replace(/\.pdf$/i, "");
        }
      }

      setDefaultName(extractedName);
      
      const blob = await response.blob();
      return blob;
    } catch (err) {
      console.error(err);
      throw new Error(err.message || "Failed to convert file");
    }
  };

  const finalName = fileName.trim() !== "" ? fileName.trim() : defaultName;

  return (
    <ToolLayout
      toolId="word-to-pdf"
      actionLabel="Convert to PDF"
      outputFileName={`${finalName}.pdf`}
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
      renderConfiguration={() => (
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Custom Filename (Optional)
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder='e.g., "Financial_Report"'
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all placeholder-gray-400"
          />
          <p className="mt-2 text-xs text-gray-500">
            Leave blank to use the original filename.
          </p>
        </div>
      )}
      onProcess={handleConvert}
    />
  );
}
