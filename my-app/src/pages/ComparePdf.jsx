import React, { useState, useRef } from "react";
import ToolLayout from "../components/ToolLayout";
import { Document, Page, pdfjs } from "react-pdf";

// Ensure worker is available (using unpkg to avoid local file pathing issues in Vite)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Custom result component correctly handling hooks inside renderResult
function ComparisonView({ result, reset }) {
  const { diff, file1, file2 } = result;
  const [numPages1, setNumPages1] = useState(null);
  const [numPages2, setNumPages2] = useState(null);

  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const syncScroll = (source, target) => {
    if (source.current && target.current) {
      target.current.scrollTop = source.current.scrollTop;
    }
  };

  return (
    <div className="flex h-[80vh] border border-gray-200 rounded-3xl overflow-hidden shadow-2xl bg-white mt-4 animate-in fade-in slide-in-from-bottom-6 min-w-full">
      {/* Left PDF */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-100/50 flex flex-col relative hidden md:flex">
        <div className="p-3 border-b bg-white font-bold text-xs text-center text-gray-600 shadow-sm z-10 sticky top-0 truncate" title={file1.name}>
          {file1.name} (Original)
        </div>
        <div 
          className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col items-center" 
          ref={leftRef} 
          onScroll={() => syncScroll(leftRef, rightRef)}
        >
          <Document 
            file={file1} 
            onLoadSuccess={({numPages}) => setNumPages1(numPages)}
            className="flex flex-col gap-6"
            loading={<div className="text-sm text-gray-400 font-medium">Loading document...</div>}
            error={<div className="text-sm text-red-400 font-medium">Failed to load PDF.</div>}
          >
            {Array.from(new Array(numPages1 || 0), (el, index) => (
              <Page 
                key={`page1_${index + 1}`} 
                pageNumber={index + 1} 
                renderTextLayer={false} 
                renderAnnotationLayer={false} 
                width={320}
                className="shadow-md rounded overflow-hidden bg-white" 
              />
            ))}
          </Document>
        </div>
      </div>

      {/* Right PDF */}
      <div className="w-1/3 border-r border-gray-300 bg-gray-100/50 flex flex-col relative hidden md:flex">
        <div className="p-3 border-b bg-white font-bold text-xs text-center text-indigo-600 shadow-sm z-10 sticky top-0 truncate" title={file2.name}>
          {file2.name} (Modified)
        </div>
        <div 
          className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col items-center" 
          ref={rightRef} 
          onScroll={() => syncScroll(rightRef, leftRef)}
        >
          <Document 
            file={file2} 
            onLoadSuccess={({numPages}) => setNumPages2(numPages)}
            className="flex flex-col gap-6"
            loading={<div className="text-sm text-gray-400 font-medium">Loading document...</div>}
            error={<div className="text-sm text-red-400 font-medium">Failed to load PDF.</div>}
          >
            {Array.from(new Array(numPages2 || 0), (el, index) => (
              <Page 
                key={`page2_${index + 1}`} 
                pageNumber={index + 1} 
                renderTextLayer={false} 
                renderAnnotationLayer={false} 
                width={320}
                className="shadow-md rounded overflow-hidden bg-white ring-1 ring-indigo-500/10" 
              />
            ))}
          </Document>
        </div>
      </div>

      {/* Side Panel (Diff) */}
      <div className="w-full md:w-1/3 flex flex-col bg-white">
        <div className="px-5 py-4 border-b bg-gray-50 flex items-center justify-between z-10 sticky top-0">
          <h2 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
            Changes <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{diff.filter(d => d.type !== 'unchanged').length}</span>
          </h2>
          <button 
            onClick={reset} 
            className="text-xs font-bold text-white bg-indigo-600 px-3.5 py-2 rounded-xl hover:bg-indigo-700 transition duration-200 shadow-sm shadow-indigo-200"
          >
            Compare Another
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3 text-[13px] custom-scrollbar bg-slate-50/50">
          {diff.map((item, index) => (
            <div
              key={index}
              className={`p-3.5 rounded-xl border font-medium leading-relaxed transition-all ${
                item.type === "added"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm shadow-emerald-100/50"
                  : item.type === "removed"
                  ? "bg-rose-50 text-rose-800 border-rose-200 line-through opacity-80 decoration-rose-400 decoration-2"
                  : "bg-white text-gray-600 border-gray-200 shadow-sm"
              }`}
            >
              {item.text}
            </div>
          ))}
          {diff.length === 0 && (
            <div className="text-gray-400 text-center py-10 font-medium">No text differences found between these documents.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ComparePdf() {
  const handleCompare = async (files) => {
    if (files.length !== 2) {
      throw new Error("Please upload exactly 2 PDF files to compare.");
    }

    const file1 = files[0].file || files[0];
    const file2 = files[1].file || files[1];

    const formData = new FormData();
    formData.append("files", file1);
    formData.append("files", file2);

    const res = await fetch("http://localhost:5000/api/pdf/compare-pdf", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      let errorMsg = "Comparison failed";
      try {
        const d = await res.json();
        if (d.error) errorMsg = d.error;
      } catch (e) {}
      throw new Error(errorMsg);
    }

    const data = await res.json();

    // Reorder files if they were mixed up during drag-and-drop.
    // Assuming backend compares [0] vs [1] in arrays
    return {
      diff: data.differences,
      file1,
      file2
    };
  };

  const renderResult = (result, reset) => (
    <ComparisonView result={result} reset={reset} />
  );

  return (
    <ToolLayout
      toolId="compare-pdf"
      actionLabel="Compare Files"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop 2 PDF files to compare." },
        { num: "2", title: "Compare", desc: "Our system extracts and compares text instantly." },
        { num: "3", title: "Review", desc: "Scroll side-by-side with synchronized views." },
      ]}
      features={[
        "Visual Side-by-side view",
        "Synchronized vertical scrolling",
        "Additions in green, removals in red",
      ]}
      allowMultiple={true}
      fullWidthResult={true}
      onProcess={handleCompare}
      renderResult={renderResult}
    />
  );
}
