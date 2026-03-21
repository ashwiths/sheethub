import React, { useState } from 'react';
import { UploadCloud, Download, Loader2, Check, Zap, Target, Image as ImageIcon, CheckCircle2, RotateCcw, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CompressPDF() {
  const [file, setFile] = useState(null);
  const [level, setLevel] = useState("recommended");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleCompress = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setLoading(true);
    setError('');
    setOriginalSize(file.size);

    console.log("Selected level:", level);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("level", level);

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
      setCompressedSize(blob.size);

      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

    } catch (err) {
      setError(err.message || 'An error occurred while compressing the PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (downloadUrl) window.URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setFile(null);
    setLevel("recommended");
    setError('');
    setOriginalSize(null);
    setCompressedSize(null);
  };

  const triggerDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "compressed.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatSize = (bytes) => {
    if (bytes === null) return '—';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const savedPercent = originalSize && compressedSize
    ? Math.max(0, Math.round((1 - compressedSize / originalSize) * 100))
    : 0;

  const compressLevels = [
    {
      id: "extreme",
      title: "Extreme Compression",
      desc: "Smallest size, lower quality",
      icon: <Zap size={20} />, color: "text-emerald-500", bg: "bg-emerald-500", lightBg: "bg-emerald-50",
      border: "border-emerald-200", highlight: "ring-emerald-400"
    },
    {
      id: "recommended",
      title: "Recommended",
      desc: "Good balance of size and quality",
      icon: <Target size={20} />, color: "text-violet-600", bg: "bg-violet-600", lightBg: "bg-violet-50",
      border: "border-violet-200", highlight: "ring-violet-500", badge: "Most Popular"
    },
    {
      id: "less",
      title: "Less Compression",
      desc: "Highest quality, larger size",
      icon: <ImageIcon size={20} />, color: "text-blue-500", bg: "bg-blue-500", lightBg: "bg-blue-50",
      border: "border-blue-200", highlight: "ring-blue-400"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">

        {/* ── SUCCESS SCREEN ── */}
        {downloadUrl ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Top gradient banner */}
              <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:20px_20px]" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white/30"
                >
                  <CheckCircle2 size={40} className="text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-1">Compressed Successfully!</h2>
                <p className="text-violet-200 text-sm">Your file is ready to download</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                {[
                  { label: "Original", value: formatSize(originalSize) },
                  { label: "Compressed", value: formatSize(compressedSize) },
                  { label: "Reduced", value: `${savedPercent}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="py-4 text-center">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className={`text-lg font-bold ${label === "Reduced" ? "text-emerald-500" : "text-gray-900"}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="p-6 space-y-3">
                <button
                  onClick={triggerDownload}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-violet-200 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <FileDown size={20} />
                  Download Compressed PDF
                </button>
                <button
                  onClick={handleReset}
                  className="w-full py-3 border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-600 hover:text-violet-700 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw size={16} />
                  Compress Another PDF
                </button>
              </div>
            </div>
          </motion.div>

        ) : (
          /* ── MAIN FORM ── */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-violet-600 shadow-inner">
                <Target size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Compress PDF</h1>
              <p className="text-gray-500">Reduce file size without losing quality.</p>
            </div>

            <div className="space-y-6">
              {/* File Upload */}
              <div className="relative">
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${file ? 'border-violet-500 bg-violet-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className={`w-8 h-8 mb-3 ${file ? 'text-violet-500' : 'text-gray-400'}`} />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold text-violet-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PDF up to 100MB</p>
                  </div>
                  <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                </label>
                {file && (
                  <div className="mt-3 text-sm text-gray-700 bg-gray-100 p-3 rounded-lg border border-gray-200">
                    📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>

              {/* Compression Options */}
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

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-medium border border-red-100 rounded-xl">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleCompress}
                disabled={!file || loading}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                  !file || loading
                    ? 'bg-gray-300 cursor-not-allowed shadow-none text-gray-500'
                    : 'bg-violet-600 hover:bg-violet-700 hover:shadow-violet-200 active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={20} />Compressing...</>
                ) : (
                  <><Download size={20} />Compress PDF</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
