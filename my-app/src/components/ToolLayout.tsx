import { useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { tools } from "../data/tools";
import UploadArea from "./upload/UploadArea";
import FileList, { type UploadedFile } from "./upload/FileList";
import SuccessCard from "./upload/SuccessCard";

interface Step {
  num: string;
  title: string;
  desc: string;
}

interface ToolLayoutProps {
  toolId: string;
  accept?: string;
  actionLabel?: string;
  outputFileName?: string;
  steps?: Step[];
  features?: string[];
  isSortable?: boolean;
  renderConfiguration?: (files: UploadedFile[], setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>) => React.ReactNode;
  onProcess?: (files: File[]) => Promise<Blob>;
}

const defaultSteps = (_action: string): Step[] => [
  { num: "1", title: "Upload Files", desc: "Drag & drop or select documents." },
  { num: "2", title: "Configure", desc: "Set your preferences and click process." },
  { num: "3", title: "Download", desc: "Get your processed file instantly." },
];

function PremiumSteps({ steps }: { steps: Step[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });
  return (
    <div className="mt-20 pt-16 border-t border-gray-200/60" ref={ref}>
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900">How it works</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
        <div className="hidden md:block absolute top-[28px] left-[16%] right-[16%] h-px bg-gradient-to-r from-violet-200 via-indigo-200 to-violet-200" />
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="relative text-center z-10"
          >
            <div className="w-14 h-14 bg-white border border-violet-100 shadow-xl shadow-violet-100/50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-xl font-bold text-violet-600">
              {s.num}
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
            <p className="text-sm text-gray-500 max-w-[200px] mx-auto leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ToolLayout({
  toolId,
  accept = ".pdf,application/pdf",
  actionLabel,
  outputFileName,
  steps,
  features = ["Preserves formatting", "No size limit (up to 100MB)", "Unlimited use"],
  isSortable = false,
  renderConfiguration,
  onProcess,
}: ToolLayoutProps) {
  const tool = tools.find((t) => t.id === toolId);
  if (!tool) return null;

  const Icon = tool.icon;
  const resolvedLabel = actionLabel ?? tool.name;
  const resolvedOutput = outputFileName ?? `${toolId}-output.pdf`;
  const resolvedSteps = steps ?? defaultSteps(tool.name);

  // ─── Upload Orchestration Logic ───
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const revokeUrl = useCallback((url: string | null) => {
    if (url) URL.revokeObjectURL(url);
  }, []);

  const handleFilesAdded = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const entries: UploadedFile[] = Array.from(newFiles).map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      file: f,
    }));
    setFiles((prev) => [...prev, ...entries]);
  }, []);

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleReset = () => {
    revokeUrl(downloadUrl);
    setDownloadUrl(null);
    setFiles([]);
  };

  const processFiles = async () => {
    if (!files.length) return;
    setIsProcessing(true);

    try {
      let fileBlob: Blob;
      if (onProcess) {
        fileBlob = await onProcess(files.map((f) => f.file));
      } else {
        await new Promise((r) => setTimeout(r, 2200));
        fileBlob = new Blob(await Promise.all(files.map((f) => f.file.arrayBuffer())), {
          type: "application/pdf",
        });
      }
      setDownloadUrl(URL.createObjectURL(fileBlob));
    } catch (e) {
      console.error("Processing failed", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen pt-24 pb-20 relative overflow-hidden bg-gray-50/50">
      {/* Decorative background gradients */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-violet-50/80 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-3xl opacity-50 pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl opacity-50 pointer-events-none mix-blend-multiply" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header container */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:text-violet-600 hover:border-violet-200 hover:shadow-sm mb-8 transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to tools
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-20 h-20 ${tool.bgColor} rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-${tool.color.split('-')[1]}-100 rotate-[-5deg] hover:rotate-0 transition-transform duration-300`}>
              <Icon size={36} className={tool.color} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {tool.name}
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {tool.description}
            </p>
          </motion.div>

          {/* Privacy badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-6 mt-8 text-sm font-medium text-gray-400"
          >
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-500" /> 100% Private</span>
            <span className="flex items-center gap-1.5"><Zap size={16} className="text-violet-500" /> Runs locally</span>
          </motion.div>
        </div>

        {/* Dynamic Main Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="w-full mt-12"
        >
          <AnimatePresence mode="wait">
            {downloadUrl ? (
              <div className="max-w-2xl mx-auto">
                <SuccessCard
                  key="success"
                  downloadUrl={downloadUrl}
                  fileName={resolvedOutput}
                  onReset={handleReset}
                />
              </div>
            ) : files.length === 0 ? (
              /* Centered layout when empty */
              <div className="max-w-3xl mx-auto" key="empty">
                <div className="bg-white/60 backdrop-blur-xl border border-white p-2 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                  <div className="bg-white rounded-[2rem] border border-gray-100 p-2 overflow-hidden shadow-inner">
                    <UploadArea accept={accept} onFilesAdded={handleFilesAdded} />
                  </div>
                </div>
              </div>
            ) : (
              /* Side-by-side Layout after upload */
              <motion.div
                key="workspace"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start"
              >
                {/* Left Column: Files */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                  <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/40 min-h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Your Files</h3>
                      <span className="bg-violet-100 text-violet-700 px-3 py-1 text-xs font-bold rounded-full">
                        {files.length} selected
                      </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                      <FileList files={files} onRemove={handleRemoveFile} isSortable={isSortable} onReorder={setFiles} />
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="h-24">
                        <UploadArea accept={accept} onFilesAdded={handleFilesAdded} compact />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Configuration & Submit */}
                <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-2xl shadow-indigo-100/50">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                      Options
                    </h3>
                    
                    {/* Tool specific options */}
                    <div className="mb-8">
                      {renderConfiguration ? (
                        renderConfiguration(files, setFiles)
                      ) : (
                        <p className="text-sm text-gray-500 italic">This tool requires no further configuration.</p>
                      )}
                    </div>

                    {/* Process Button */}
                    <button
                      onClick={processFiles}
                      disabled={isProcessing}
                      className="w-full btn-glow relative overflow-hidden py-4 text-base font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl
                        hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group flex items-center justify-center gap-3 shadow-lg shadow-violet-200"
                    >
                      {/* Button shine effect */}
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
                        <>
                          <span>{resolvedLabel}</span>
                          <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    
                    <div className="mt-4 flex items-center justify-center text-xs text-gray-400 gap-1.5">
                      <LockIcon className="w-3 h-3" /> Secure local processing
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Feature Highlights */}
        {files.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center isolate"
          >
            {features.map((f, i) => (
              <div key={i} className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm">
                <CheckCircle2 size={24} className="text-violet-500 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-800">{f}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Process Steps Indicator */}
        <PremiumSteps steps={resolvedSteps} />
      </div>
    </div>
  );
}

// Simple icons to avoid extra lucide imports
function ArrowRightIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
}
function LockIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
}
