import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import ToolLayout from '../components/ToolLayout';

export default function ProtectPDF() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleConvert = async (files) => {
    if (!files || files.length === 0) {
      throw new Error("Please upload a PDF file first.");
    }
    
    if (!password) {
      throw new Error("Password cannot be empty.");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    const file = files[0].file || files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:5000/api/pdf/protect-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = "Protection failed";
        try {
          const errorData = await response.json();
          if (errorData.error) errorMsg = errorData.error;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      return await response.blob();
    } catch (err) {
      console.error(err);
      throw new Error(err.message || "Failed to protect PDF"); 
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
              placeholder="Enter password"
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

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all pr-12 text-sm text-gray-800 placeholder-gray-400 font-medium bg-white"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <ToolLayout
      toolId="protect-pdf"
      actionLabel="Protect PDF"
      outputFileName="protected.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PDF file." },
        { num: "2", title: "Set password", desc: "Enter a strong password to encrypt." },
        { num: "3", title: "Download", desc: "Get your password-protected PDF." },
      ]}
      features={[
        "AES-256 encryption",
        "Owner & user passwords",
        "Restricts printing & copying",
      ]}
      allowMultiple={false}
      renderConfiguration={renderConfig}
      onProcess={handleConvert}
    />
  );
}
