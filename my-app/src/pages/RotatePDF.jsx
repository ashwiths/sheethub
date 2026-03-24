import React, { useState } from "react";
import ToolLayout from "../components/ToolLayout";
import { RotateCcw } from "lucide-react";

export default function RotatePDF() {
  const [angle, setAngle] = useState("90");

  const handleConvert = async (files) => {
    if (!files || files.length === 0) {
      throw new Error("Please upload a PDF file.");
    }

    const file = files[0].file || files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("angle", angle.toString());

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pdf/rotate-pdf`, {
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

  const renderConfiguration = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 mb-2">
        <RotateCcw className="w-5 h-5 text-violet-600" />
        <label className="block text-sm font-bold text-gray-900">Rotation Angle</label>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {[
          { value: "90", label: "90° Clockwise" },
          { value: "180", label: "180° Upside Down" },
          { value: "270", label: "270° Counter-Clockwise" }
        ].map((opt) => (
          <label 
            key={opt.value}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              angle === opt.value 
                ? "border-violet-600 bg-violet-50/50 shadow-sm" 
                : "border-gray-200 hover:border-violet-300 hover:bg-gray-50"
            }`}
          >
            <input 
              type="radio" 
              name="angle" 
              value={opt.value} 
              checked={angle === opt.value}
              onChange={(e) => setAngle(e.target.value)}
              className="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-600"
            />
            <span className={`text-sm font-semibold tracking-wide ${angle === opt.value ? "text-violet-900" : "text-gray-700"}`}>
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <ToolLayout
      toolId="rotate-pdf"
      actionLabel="Rotate PDF"
      outputFileName="rotated.pdf"
      allowMultiple={false}
      accept=".pdf,application/pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PDF file." },
        { num: "2", title: "Configure", desc: "Select the specific rotation angle you need." },
        { num: "3", title: "Download", desc: "Get your permanently rotated PDF." },
      ]}
      features={[
        "Permanent rotation on all pages",
        "Preserves internal formatting and text",
        "Fast and secure isolated processing",
      ]}
      renderConfiguration={renderConfiguration}
      onProcess={handleConvert}
    />
  );
}
