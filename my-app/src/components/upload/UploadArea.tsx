import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

interface UploadAreaProps {
  accept?: string;
  onFilesAdded: (files: FileList | null) => void;
  compact?: boolean;
}

export default function UploadArea({ accept, onFilesAdded, compact = false }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(e.dataTransfer.files);
    }
  };

  const handleClick = () => inputRef.current?.click();

  if (compact) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative w-full h-full rounded-2xl flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 border-2 border-dashed ${
          isDragging
            ? "border-violet-400 bg-violet-50 shadow-inner scale-[0.99]"
            : "border-gray-200 bg-gray-50/50 hover:border-violet-300 hover:bg-violet-50/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => onFilesAdded(e.target.files)}
        />
        <UploadCloud size={20} className={isDragging ? "text-violet-600 animate-bounce" : "text-gray-400"} />
        <span className="text-sm font-semibold text-gray-600">
          {isDragging ? "Drop here!" : "Add more files"}
        </span>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`relative group rounded-[2.5rem] p-12 sm:p-16 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-500 overflow-hidden ${
        isDragging
          ? "scale-[0.98] shadow-inner"
          : "hover:shadow-[0_20px_60px_-15px_rgba(109,40,217,0.1)]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(e) => onFilesAdded(e.target.files)}
      />

      {/* Dynamic Background */}
      <div className={`absolute inset-0 transition-opacity duration-500 -z-10 ${
        isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 to-indigo-50/80 backdrop-blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-400/20 rounded-full blur-[80px]" />
      </div>

      <div className={`absolute inset-0 border-2 border-dashed transition-all duration-300 rounded-[2.5rem] pointer-events-none ${
        isDragging ? "border-violet-400 scale-[0.98]" : "border-gray-200 group-hover:border-violet-300"
      }`} />

      {/* Floating Animated Icon */}
      <motion.div 
        animate={{ y: isDragging ? -10 : 0, scale: isDragging ? 1.1 : 1 }}
        className="relative w-24 h-24 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-violet-100 rounded-[2rem] rotate-45 opacity-50 group-hover:rotate-90 transition-transform duration-700 ease-in-out" />
        <div className="absolute inset-0 bg-indigo-100 rounded-[2rem] -rotate-12 opacity-50 group-hover:rotate-[120deg] transition-transform duration-1000 ease-in-out" />
        <div className="relative w-20 h-20 bg-white border border-violet-100/50 rounded-[1.8rem] flex items-center justify-center shadow-xl shadow-violet-200/50 z-10 group-hover:scale-105 transition-transform duration-300">
          <UploadCloud size={36} className="text-violet-600" />
        </div>
      </motion.div>

      {/* Text Copy */}
      <div className="text-center relative z-10">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
          {isDragging ? "Drop your files here!" : "Choose your PDF files"}
        </h3>
        <p className="text-base text-gray-500 font-medium">
          Drag & drop them here, or{" "}
          <span className="text-violet-600 font-bold underline decoration-violet-300 underline-offset-4 decoration-2 hover:decoration-violet-600 transition-colors">
            browse your device
          </span>
        </p>
      </div>
      
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-gray-100 shadow-sm relative z-10">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Max 100MB</span>
      </div>
    </div>
  );
}
