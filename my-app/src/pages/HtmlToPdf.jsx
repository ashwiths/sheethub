import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck, Zap, Code, Eye, EyeOff } from "lucide-react";
import { tools } from "../data/tools";
import SuccessCard from "../components/upload/SuccessCard";

export default function HtmlToPdf() {
  const [mode, setMode] = useState("html");
  const [inputUrl, setInputUrl] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [customFileName, setCustomFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [fileBlob, setFileBlob] = useState(null);
  const [finalFileName, setFinalFileName] = useState(null);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const tool = tools.find((t) => t.id === "html-to-pdf");
  const Icon = tool?.icon || Code;

  const handleReset = () => {
    setIsDone(false);
    setFinalFileName(null);
    setFileBlob(null);
    setHtmlContent("");
    setCustomFileName("");
    setError(null);
    setShowPreview(false);
  };

  const handleConvert = async () => {
    if (mode === "html" && !htmlContent.trim()) {
      setError("Please enter some HTML content to convert.");
      return;
    }
    if (mode === "url" && !inputUrl.trim()) {
      setError("Please enter a valid website URL to convert.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/pdf/html-to-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "html" ? { html: htmlContent } : { url: inputUrl }),
      });

      if (!response.ok) {
        let errorMsg = "Conversion failed";
        try {
          const errData = await response.json();
          if (errData.error) errorMsg = errData.error;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      const blob = await response.blob();
      const name = (customFileName.trim() || "converted") + ".pdf";

      // Auto-download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setFileBlob(blob);
      setFinalFileName(name);
      setIsDone(true);
    } catch (e) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualDownload = () => {
    if (!fileBlob) return;
    const url = window.URL.createObjectURL(fileBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = finalFileName ?? "converted.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 min-h-screen pt-24 pb-20 relative overflow-hidden bg-gray-50/50">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-violet-50/80 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-3xl opacity-50 pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl opacity-50 pointer-events-none mix-blend-multiply" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:text-violet-600 hover:border-violet-200 hover:shadow-sm mb-8 transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to tools
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className={`w-20 h-20 ${tool?.bgColor ?? "bg-violet-50"} rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-[-5deg] hover:rotate-0 transition-transform duration-300`}>
              <Icon size={36} className={tool?.color ?? "text-violet-600"} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {tool?.name ?? "HTML to PDF"}
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {tool?.description ?? "Convert any HTML + CSS into a beautifully formatted PDF document."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-6 mt-8 text-sm font-medium text-gray-400"
          >
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-500" /> 100% Private</span>
            <span className="flex items-center gap-1.5"><Zap size={16} className="text-violet-500" /> Runs locally</span>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }} className="w-full mt-12">
          <AnimatePresence mode="wait">
            {isDone ? (
              <div className="max-w-2xl mx-auto" key="success">
                <SuccessCard
                  fileName={finalFileName ?? "converted.pdf"}
                  onReset={handleReset}
                  onDownload={handleManualDownload}
                />
              </div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start"
              >
                {/* Left Column: HTML Editor */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                  <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/40">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                        <button
                          onClick={() => setMode("html")}
                          className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${mode === "html" ? "bg-white text-violet-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                          HTML
                        </button>
                        <button
                          onClick={() => setMode("url")}
                          className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${mode === "url" ? "bg-white text-violet-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                          URL
                        </button>
                      </div>

                      {mode === "html" && (
                        <button
                          onClick={() => setShowPreview((p) => !p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-full transition-all"
                        >
                          {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
                          {showPreview ? "Hide Preview" : "Preview HTML"}
                        </button>
                      )}
                    </div>

                    {mode === "html" ? (
                      <>
                        <textarea
                          value={htmlContent}
                          onChange={(e) => setHtmlContent(e.target.value)}
                          placeholder={"<h1>Hello World</h1>\n<p>Start typing your HTML here...</p>"}
                          rows={14}
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-mono text-gray-800 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y transition-all placeholder-gray-400 leading-relaxed"
                        />

                        {/* Live Preview Panel */}
                        <AnimatePresence>
                          {showPreview && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 overflow-hidden"
                            >
                              <div className="rounded-2xl border border-violet-100 bg-white p-5 text-sm text-gray-700 min-h-[100px] shadow-inner">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-3">Live Preview</p>
                                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <div className="py-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Website URL
                        </label>
                        <input
                          type="url"
                          value={inputUrl}
                          onChange={(e) => setInputUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-base font-medium text-gray-800 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all placeholder-gray-400"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Options */}
                <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-2xl shadow-indigo-100/50">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-6 pb-4 border-b border-gray-100">Options</h3>

                    <p className="text-sm text-gray-500 italic mb-4">This tool requires no further configuration.</p>

                    {/* Custom filename */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Custom Filename <span className="font-normal text-gray-400">(Optional)</span>
                      </label>
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500 bg-white transition-all">
                        <input
                          type="text"
                          value={customFileName}
                          onChange={(e) => setCustomFileName(e.target.value)}
                          placeholder="e.g. my-document"
                          className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none placeholder-gray-400"
                        />
                        <span className="text-xs font-bold text-gray-400 shrink-0">.pdf</span>
                      </div>
                      <p className="mt-1.5 text-xs text-gray-400">Leave blank to use the default filename.</p>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm font-semibold text-red-600 flex items-start gap-2">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Convert Button */}
                    <button
                      onClick={handleConvert}
                      disabled={isProcessing}
                      className="w-full relative overflow-hidden py-4 text-base font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group flex items-center justify-center gap-3 shadow-lg shadow-violet-200"
                    >
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Convert to PDF</span>
                      )}
                    </button>

                    <div className="mt-4 flex items-center justify-center text-xs text-gray-400 gap-1.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      Secure local processing
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
