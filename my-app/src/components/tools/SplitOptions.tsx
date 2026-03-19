import { Copy, FileDown, Layers, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UploadedFile } from "../upload/FileList";

export type SplitMode = "range" | "fixed";

export interface SplitOptionsData {
  mode: SplitMode;
  fromPage: string;
  toPage: string;
  mergeRanges: boolean;
}

interface SplitOptionsProps {
  files: UploadedFile[];
  data: SplitOptionsData;
  onChange: (data: SplitOptionsData) => void;
}

export default function SplitOptions({ files, data, onChange }: SplitOptionsProps) {
  if (files.length === 0) return null;

  const update = (updates: Partial<SplitOptionsData>) => {
    onChange({ ...data, ...updates });
  };

  return (
    <div className="w-full flex flex-col">
      {/* Premium Tabs */}
      <div className="flex p-1 bg-gray-100/80 rounded-2xl mb-6 shadow-inner border border-gray-200/50">
        <button
          onClick={() => update({ mode: "range" })}
          className={`relative flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
            data.mode === "range"
              ? "text-violet-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {data.mode === "range" && (
            <motion.div
              layoutId="splitTab"
              className="absolute inset-0 bg-white rounded-xl shadow-sm border border-violet-100"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Copy size={16} /> Custom Ranges
          </span>
        </button>

        <button
          onClick={() => update({ mode: "fixed" })}
          className={`relative flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
            data.mode === "fixed"
              ? "text-violet-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {data.mode === "fixed" && (
            <motion.div
              layoutId="splitTab"
              className="absolute inset-0 bg-white rounded-xl shadow-sm border border-violet-100"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Layers size={16} /> Fixed Ranges
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[220px]">
        <AnimatePresence mode="wait">
          {data.mode === "range" ? (
            <motion.div
              key="range"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Range Inputs */}
              <div className="bg-gradient-to-br from-violet-50/50 to-indigo-50/50 p-5 rounded-2xl border border-violet-100/50">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      From Page
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={data.fromPage}
                      onChange={(e) => update({ fromPage: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-semibold text-lg outline-none
                        focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all shadow-sm"
                    />
                  </div>
                  <div className="text-gray-400 mt-6 font-bold text-xl">–</div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      To Page
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={data.toPage}
                      onChange={(e) => update({ toPage: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-semibold text-lg outline-none
                        focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* Add Range Button */}
              <button 
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-200 rounded-xl
                  text-sm font-semibold text-gray-500 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all duration-200"
              >
                <Plus size={16} /> Add another range
              </button>

              {/* Advanced Checkbox */}
              <label className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer overflow-hidden group hover:bg-gray-100/80 transition-colors">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={data.mergeRanges}
                    onChange={(e) => update({ mergeRanges: e.target.checked })}
                    className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-lg checked:bg-violet-600 checked:border-violet-600 transition-all cursor-pointer shadow-sm shadow-inner"
                  />
                  <svg
                    className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity drop-shadow-sm rotate-12 peer-checked:rotate-0 duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <span className="block text-sm font-bold text-gray-900">
                    Merge ranges
                  </span>
                  <span className="block text-xs font-medium text-gray-500">
                    Combine all extracted ranges into one file
                  </span>
                </div>
              </label>
            </motion.div>
          ) : (
            <motion.div
              key="fixed"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center text-center py-12 px-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/80"
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center text-gray-400 mb-4">
                <FileDown size={28} />
              </div>
              <p className="text-gray-900 font-semibold mb-1">Single Page Extraction</p>
              <p className="text-gray-500 text-sm max-w-[250px]">
                Split this PDF into files of exactly <strong className="text-violet-600">1</strong> page each.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
