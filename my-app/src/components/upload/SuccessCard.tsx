import { useEffect, useRef } from "react";
import { Check, RotateCcw, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

interface SuccessCardProps {
  downloadUrl: string;
  fileName: string;
  onReset: () => void;
}

export default function SuccessCard({
  downloadUrl,
  fileName,
  onReset,
}: SuccessCardProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Auto-trigger download once the card mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      linkRef.current?.click();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="w-full relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center p-10 sm:p-14 text-center z-10"
    >
      {/* Decorative background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-emerald-400/20 blur-[80px] rounded-full -z-10 mix-blend-multiply" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] bg-teal-400/20 blur-[80px] rounded-full -z-10 mix-blend-multiply" />

      {/* Confetti/Stars (Simulated via SVG) */}
      <svg className="absolute inset-0 w-full h-full -z-10 opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20%" cy="30%" r="4" fill="#10B981" />
        <circle cx="80%" cy="40%" r="6" fill="#34D399" />
        <circle cx="70%" cy="80%" r="3" fill="#059669" />
        <circle cx="30%" cy="70%" r="5" fill="#6EE7B7" />
      </svg>

      {/* Icon Ring */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-40 animate-pulse" />
        <div className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-emerald-400 to-teal-500 p-1 shadow-xl shadow-emerald-200">
          <div className="w-full h-full bg-white rounded-[1.8rem] flex items-center justify-center border-2 border-emerald-50">
            <Check size={40} strokeWidth={3} className="text-emerald-500 drop-shadow-sm" />
          </div>
        </div>
      </motion.div>

      {/* Text block */}
      <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Task Completed!</h3>
      <p className="text-lg text-gray-500 max-w-sm mb-1">
        Your file has been processed successfully.
      </p>
      <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2 mb-10 shadow-inner">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">FILE</span>
        <span className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">{fileName}</span>
      </div>

      {/* Hidden auto-download anchor */}
      <a ref={linkRef} href={downloadUrl} download={fileName} className="hidden" aria-hidden />

      {/* Primary Download button */}
      <a
        href={downloadUrl}
        download={fileName}
        className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-gray-900 text-white text-[17px] font-bold rounded-2xl
          hover:bg-gray-800 hover:shadow-2xl hover:shadow-gray-900/30 hover:-translate-y-1 active:translate-y-0
          transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        Download File
        <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
      </a>

      {/* Start over */}
      <button
        onClick={onReset}
        className="mt-8 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-800 hover:bg-gray-100 px-5 py-2.5 rounded-xl transition-all"
      >
        <RotateCcw size={16} />
        Process another file
      </button>
    </motion.div>
  );
}
