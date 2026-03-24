import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  X,
  CheckCircle2,
  Lock,
  LayoutGrid,
  RotateCcw,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── PDF.js worker setup ───────────────────────────────────────────────────
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// ─── Sortable Thumbnail ────────────────────────────────────────────────────
function PageThumbnail({ page, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group select-none">
      <div
        {...attributes}
        {...listeners}
        className={`rounded-2xl overflow-hidden border-2 ${
          isDragging ? "border-violet-400 shadow-xl" : "border-gray-200"
        } bg-white shadow-md hover:border-violet-300 hover:shadow-lg transition-all`}
      >
        <canvas
          ref={(el) => {
            if (el && page.canvas) {
              const ctx = el.getContext("2d");
              ctx.drawImage(page.canvas, 0, 0);
            }
          }}
          width={page.width}
          height={page.height}
          className="w-full h-auto block"
        />
        <div className="text-center py-2 text-xs font-bold text-gray-500 bg-gray-50 border-t border-gray-100">
          Page {page.pageNum}
        </div>
      </div>
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onRemove(page.id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
      >
        <X size={12} />
      </button>
    </div>
  );
}

// ─── Success Card ─────────────────────────────────────────────────────────
function SuccessView({ fileName, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-2xl text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">PDF Organized Successfully 📄</h2>
        <p className="text-sm text-gray-500 mb-6">Your file has been reordered and downloaded.</p>
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 mb-8">
          <span className="text-sm font-bold text-gray-700">{fileName}</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:border-violet-300 hover:text-violet-600 transition-all"
        >
          <RotateCcw size={16} />
          Process another file
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function OrganizePDF() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]); // [{ id, pageNum, canvas, width, height }]
  const [isRendering, setIsRendering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [finalFileName, setFinalFileName] = useState("organized.pdf");
  const [customFileName, setCustomFileName] = useState("");
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const renderPages = useCallback(async (pdfFile) => {
    setIsRendering(true);
    setError(null);
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const rendered = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport }).promise;
        rendered.push({
          id: `page-${i}-${Date.now()}`,
          pageNum: i,
          canvas,
          width: viewport.width,
          height: viewport.height,
        });
      }
      setPages(rendered);
    } catch (err) {
      setError("Failed to preview PDF. Please try another file.");
    } finally {
      setIsRendering(false);
    }
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPages([]);
    setIsDone(false);
    setError(null);
    renderPages(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped || dropped.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    setFile(dropped);
    setPages([]);
    setIsDone(false);
    setError(null);
    renderPages(dropped);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setPages((prev) => {
      const oldIdx = prev.findIndex((p) => p.id === active.id);
      const newIdx = prev.findIndex((p) => p.id === over.id);
      return arrayMove(prev, oldIdx, newIdx);
    });
  };

  const handleRemovePage = (id) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleOrganize = async () => {
    if (!file) { setError("Please upload a PDF first."); return; }
    if (pages.length === 0) { setError("No pages remaining to organize."); return; }

    setIsProcessing(true);
    setError(null);

    try {
      const order = pages.map((p) => p.pageNum - 1); // 0-indexed for backend
      const formData = new FormData();
      formData.append("file", file);
      formData.append("order", JSON.stringify(order));

      const response = await fetch(`\${import.meta.env.VITE_API_URL}/api/pdf/organize-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let msg = "Failed to organize PDF";
        try { const d = await response.json(); if (d.error) msg = d.error; } catch {}
        throw new Error(msg);
      }

      const blob = await response.blob();
      const ext = ".pdf";
      const baseName = customFileName.trim() !== "" ? customFileName.trim() : "organized";
      const downloadName = `${baseName}${ext}`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setFinalFileName(downloadName);
      setIsDone(true);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPages([]);
    setIsDone(false);
    setError(null);
    setCustomFileName("");
    setFinalFileName("organized.pdf");
    if (fileInputRef.current) fileInputRef.current.value = "";
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
            <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100 rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
              <LayoutGrid size={36} className="text-indigo-500" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Organize PDF</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Reorder, delete and arrange pages of your PDF effortlessly.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-6 mt-8 text-sm font-medium text-gray-400">
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-500" /> 100% Private</span>
            <span className="flex items-center gap-1.5"><Zap size={16} className="text-violet-500" /> Runs locally</span>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }} className="w-full mt-12">
          <AnimatePresence mode="wait">
            {isDone ? (
              <SuccessView key="success" fileName={finalFileName} onReset={handleReset} />
            ) : !file ? (
              /* Upload Area */
              <div className="max-w-3xl mx-auto" key="upload">
                <div className="bg-white/60 backdrop-blur-xl border border-white p-2 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                  <div
                    className="bg-white rounded-[2rem] border-2 border-dashed border-gray-200 hover:border-violet-300 transition-colors p-16 text-center cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />
                    <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <LayoutGrid size={28} className="text-violet-500" />
                    </div>
                    <p className="text-lg font-bold text-gray-700 mb-1">Click to upload or drag & drop</p>
                    <p className="text-sm text-gray-400">PDF files only</p>
                    {error && <p className="mt-4 text-sm font-semibold text-red-500">{error}</p>}
                  </div>
                </div>
              </div>
            ) : (
              /* Workspace */
              <motion.div key="workspace" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Left: Page thumbnails */}
                <div className="lg:col-span-8 xl:col-span-9">
                  <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/40 min-h-[200px]">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-bold text-gray-900">Pages</h3>
                      <div className="flex items-center gap-3">
                        <span className="bg-violet-100 text-violet-700 px-3 py-1 text-xs font-bold rounded-full">{pages.length} pages</span>
                        <button onClick={() => fileInputRef.current?.click()} className="text-xs font-semibold text-gray-400 hover:text-violet-600 transition-colors">
                          Change file
                        </button>
                        <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />
                      </div>
                    </div>

                    {isRendering ? (
                      <div className="flex items-center justify-center py-20 gap-3">
                        <svg className="animate-spin w-6 h-6 text-violet-500" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-500">Rendering pages…</span>
                      </div>
                    ) : pages.length === 0 ? (
                      <div className="text-center py-16 text-gray-400">
                        <p className="text-sm font-medium">No pages to display.</p>
                      </div>
                    ) : (
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={pages.map((p) => p.id)} strategy={rectSortingStrategy}>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                            {pages.map((page) => (
                              <PageThumbnail key={page.id} page={page} onRemove={handleRemovePage} />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}
                    <p className="mt-4 text-xs text-gray-400 text-center">Drag to reorder · Click ✕ to remove a page</p>
                  </div>
                </div>

                {/* Right: Options & button */}
                <div className="lg:col-span-4 xl:col-span-3 sticky top-24">
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-2xl shadow-indigo-100/50">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-6 pb-4 border-b border-gray-100">Options</h3>

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
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Process button */}
                    <button
                      onClick={handleOrganize}
                      disabled={isProcessing || isRendering || pages.length === 0}
                      className="w-full relative overflow-hidden py-4 text-base font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group flex items-center justify-center gap-3 shadow-lg shadow-violet-200"
                    >
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
                          <span>Organize PDF</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </>
                      )}
                    </button>
                    <div className="mt-4 flex items-center justify-center text-xs text-gray-400 gap-1.5">
                      <Lock size={12} /> Secure local processing
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Steps */}
        {!file && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-20 pt-16 border-t border-gray-200/60">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900">How it works</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { num: "1", title: "Upload", desc: "Select or drag & drop your PDF file." },
                { num: "2", title: "Arrange", desc: "Drag pages to reorder, or click ✕ to delete." },
                { num: "3", title: "Download", desc: "Click Organize PDF to get your new file." },
              ].map((s) => (
                <div key={s.num} className="text-center">
                  <div className="w-14 h-14 bg-white border border-violet-100 shadow-xl shadow-violet-100/50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-xl font-bold text-violet-600">{s.num}</div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 max-w-[200px] mx-auto leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
              {["Drag & drop reordering", "Remove unwanted pages", "Instant PDF download"].map((f, i) => (
                <div key={i} className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm">
                  <CheckCircle2 size={24} className="text-violet-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-800">{f}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
