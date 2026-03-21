import React, { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { motion } from 'framer-motion';
import { Check, Zap, Target, Image as ImageIcon } from 'lucide-react';

export default function CompressPDF() {
  const [level, setLevel] = useState("recommended");

  const handleCompress = async (files) => {
    if (!files || files.length === 0) {
      throw new Error("Please upload a PDF file first.");
    }
    
    // Extracted safely from ToolLayout
    const file = files[0].file || files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("level", level);

    console.log("Selected level:", level);

    try {
      const response = await fetch("http://localhost:5000/api/pdf/compress", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = "Failed to compress PDF.";
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
      throw new Error(err.message || 'An error occurred while compressing the PDF.');
    }
  };

  const compressLevels = [
    {
      id: "extreme", title: "Extreme Compression", desc: "Smallest size, lower quality",
      icon: <Zap size={20} />, color: "text-emerald-500", bg: "bg-emerald-500", lightBg: "bg-emerald-50",
      border: "border-emerald-200", highlight: "ring-emerald-400"
    },
    {
      id: "recommended", title: "Recommended", desc: "Good balance of size and quality",
      icon: <Target size={20} />, color: "text-violet-600", bg: "bg-violet-600", lightBg: "bg-violet-50",
      border: "border-violet-200", highlight: "ring-violet-500", badge: "Most Popular"
    },
    {
      id: "less", title: "Less Compression", desc: "Highest quality, larger size",
      icon: <ImageIcon size={20} />, color: "text-blue-500", bg: "bg-blue-500", lightBg: "bg-blue-50",
      border: "border-blue-200", highlight: "ring-blue-400"
    }
  ];

  return (
    <ToolLayout
      toolId="compress-pdf"
      actionLabel="Compress PDF"
      outputFileName="compressed.pdf"
      allowMultiple={false}
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PDF file." },
        { num: "2", title: "Optimize", desc: "Choose your compression configuration." },
        { num: "3", title: "Download", desc: "Get your minimized file instantly." },
      ]}
      features={[
        "Significantly minimizes document overhead",
        "Retains acceptable reading quality reliably",
        "Automatically ignores image scans",
      ]}
      renderConfiguration={() => (
        <div className="w-full flex flex-col gap-3">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Compression Level</label>
          {compressLevels.map((option) => {
            const isActive = level === option.id;
            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => setLevel(option.id)}
                whileHover={{ scale: isActive ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center justify-between p-4 w-full text-left rounded-2xl transition-all duration-300 border-2
                  ${isActive
                    ? `${option.lightBg} ${option.border} shadow-md ring-1 ${option.highlight}`
                    : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm"
                  }`}
              >
                {option.badge && (
                  <span className={`absolute -top-3 right-6 px-3 py-1 ${option.bg} text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm`}>
                    {option.badge}
                  </span>
                )}
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isActive ? `${option.bg} text-white shadow-inner` : "bg-gray-100 text-gray-500"}`}>
                    {option.icon}
                  </div>
                  <div>
                    <div className={`font-bold text-[14px] mb-0.5 ${isActive ? option.color : "text-gray-900"}`}>{option.title}</div>
                    <div className="text-gray-500 text-xs font-medium">{option.desc}</div>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isActive ? `${option.bg} border-transparent` : "border-gray-200"}`}>
                  {isActive && <Check size={14} strokeWidth={3} className="text-white" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
      onProcess={handleCompress}
    />
  );
}
