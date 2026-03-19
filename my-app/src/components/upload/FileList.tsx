import { FileText, GripVertical, Trash2 } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

export interface UploadedFile {
  id: string;
  file: File;
}

interface FileListProps {
  files: UploadedFile[];
  onRemove: (id: string) => void;
  onReorder?: (newOrder: UploadedFile[]) => void;
  isSortable?: boolean;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function FileList({ files, onRemove, onReorder, isSortable }: FileListProps) {
  if (files.length === 0) return null;

  const canSort = isSortable && files.length > 1;

  if (canSort && onReorder) {
    return (
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-4 pl-1">
          <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Drag items to reorder
          </p>
          <div className="h-px flex-1 bg-gradient-to-l from-gray-200 to-transparent" />
        </div>
        
        <Reorder.Group axis="y" values={files} onReorder={onReorder} className="space-y-3">
          {files.map((f) => (
            <Reorder.Item
              key={f.id}
              value={f}
              className="group relative flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-3 sm:pr-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]
                cursor-grab active:cursor-grabbing hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:border-violet-100 transition-all duration-300 z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-50/0 via-transparent to-transparent group-hover:from-violet-50/50 rounded-2xl pointer-events-none transition-colors" />
              
              <div className="pl-1 text-gray-300 group-hover:text-violet-400 transition-colors">
                <GripVertical size={18} />
              </div>
              
              <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-orange-50 border border-red-100/50 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <FileText size={22} className="text-red-500 drop-shadow-sm" />
              </div>
              
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-bold text-gray-900 truncate mb-0.5">{f.file.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-gray-400 px-2 py-0.5 bg-gray-50 rounded-md border border-gray-100">
                    {formatSize(f.file.size)}
                  </span>
                </div>
              </div>
              
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(f.id);
                }}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 border border-transparent
                  hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
              >
                <Trash2 size={16} />
              </button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-3">
      <AnimatePresence>
        {files.map((f) => (
          <motion.div
            key={f.id}
            layout
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="group relative flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-3 sm:pr-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]
              hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:border-violet-100 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-50/0 via-transparent to-transparent group-hover:from-violet-50/50 rounded-2xl pointer-events-none transition-colors" />

            <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-orange-50 border border-red-100/50 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
              <FileText size={22} className="text-red-500 drop-shadow-sm" />
            </div>
            
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-sm font-bold text-gray-900 truncate mb-0.5">{f.file.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-gray-400 px-2 py-0.5 bg-gray-50 rounded-md border border-gray-100">
                  {formatSize(f.file.size)}
                </span>
                <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ready
                </span>
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(f.id);
              }}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 border border-transparent
                  hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 relative z-10"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
