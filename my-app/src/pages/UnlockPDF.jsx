import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';

export default function UnlockPDF() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleConvert = async (files) => {
    if (!files || files.length === 0) {
      throw new Error("Please upload a PDF file first.");
    }
    
    if (!password) {
      throw new Error("Password is required");
    }

    const file = files[0].file || files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pdf/unlock`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = "Failed to unlock PDF";
        try {
          const errorData = await response.json();
          if (errorData.error) errorMsg = errorData.error;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      return await response.blob();
    } catch (err) {
      console.error(err);
      throw new Error(err.message || "Failed to unlock PDF"); 
    }
  };

  const renderConfig = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enter Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter PDF password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all pr-12 text-sm text-gray-800 placeholder-gray-400 font-medium bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ToolLayout
      toolId="unlock-pdf"
      actionLabel="Unlock PDF"
      outputFileName="unlocked.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your secured PDF." },
        { num: "2", title: "Enter password", desc: "Provide the correct password to unlock." },
        { num: "3", title: "Download", desc: "Get your permanently unlocked PDF." },
      ]}
      features={[
        "Instant decryption",
        "Removes all restrictions",
        "100% private processing",
      ]}
      allowMultiple={false}
      renderConfiguration={renderConfig}
      onProcess={handleConvert}
    />
  );
}
