import { useState } from "react";
import ToolLayout from "../components/ToolLayout";

export default function SplitPDF() {
  const [pages, setPages] = useState("");

  const handleSplit = async (files) => {
    // 1. Validate: File must be selected
    if (!files || files.length === 0) {
      const msg = "Please upload a PDF file first.";
      alert(`Error: ${msg}`);
      throw new Error(msg);
    }
    
    const file = files[0].file || files[0]; // ToolLayout wraps files in {id, file}

    // 2. Validate: Pages must not be empty
    if (!pages.trim()) {
      const msg = "Please enter pages to extract (e.g. '1-3,5').";
      alert(`Error: ${msg}`);
      throw new Error(msg);
    }

    // 3. Create FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pages", pages);

    try {
      // 4. Call API using fetch
      const response = await fetch("http://localhost:5000/api/pdf/split", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = "Failed to split PDF.";
        try {
          const errorData = await response.json();
          if (errorData.error) errorMsg = errorData.error;
        } catch (e) {
          // Ignore JSON parse error, keep default message
        }
        throw new Error(errorMsg);
      }

      // 5. Handle response: Receive blob (PDF)
      const blob = await response.blob();
      
      // Return blob — ToolLayout handles auto-download
      return blob;
      
    } catch (error) {
      // Show alert if error
      alert(`Error: ${error.message}`);
      throw error;
    }
  };

  return (
    <ToolLayout
      toolId="split-pdf"
      actionLabel="Split PDF"
      outputFileName="split.pdf"
      allowMultiple={false}
      steps={[
         { num: "1", title: "Upload", desc: "Select or drag a single document." },
         { num: "2", title: "Pages", desc: "Specify rules like '1-3,5'." },
         { num: "3", title: "Split & Download", desc: "Automatically download the split file." },
      ]}
      // Keep UI consistent with existing design using ToolLayout's renderConfiguration
      renderConfiguration={() => (
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pages to Extract
          </label>
          <input
            type="text"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            placeholder='e.g., "1-3,5"'
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all placeholder-gray-400"
          />
          <p className="mt-2 text-xs text-gray-500">
            Enter individual pages separated by commas, or page ranges separated by hyphens.
          </p>
        </div>
      )}
      onProcess={handleSplit}
    />
  );
}
