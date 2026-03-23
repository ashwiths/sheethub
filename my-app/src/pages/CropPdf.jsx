import React, { useState, useEffect, useCallback, useRef } from "react";
import ToolLayout from "../components/ToolLayout";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { pdfjs } from "react-pdf";

// Use public worker to handle PDF manipulations safely in Vite
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function CropConfigView({ files, onCropDataChange }) {
  const [crop, setCrop] = useState({ unit: "%", x: 10, y: 10, width: 80, height: 80 });
  const [completedCropPercent, setCompletedCropPercent] = useState(null);
  
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);

  // States for UX improvements
  const [top, setTop] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [aspect, setAspect] = useState(undefined);

  const [originalPdfSize, setOriginalPdfSize] = useState(null);

  useEffect(() => {
    if (!files || !files.length) {
      setImageSrc(null);
      return;
    }
    
    const file = files[0].file || files[0];
    let isMounted = true;
    
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setOriginalPdfSize(null);
      return () => URL.revokeObjectURL(url);
    } else if (file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file);
      
      const loadPdf = async () => {
        try {
          const pdf = await pdfjs.getDocument(fileUrl).promise;
          const page = await pdf.getPage(1);
          // Scale by 2.0 to ensure a high quality bitmap for accurate trimming
          const viewport = page.getViewport({ scale: 2.0 });
          
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          await page.render({ canvasContext: ctx, viewport }).promise;
          
          if (isMounted) {
            setImageSrc(canvas.toDataURL("image/jpeg", 0.9));
            const origViewport = page.getViewport({ scale: 1.0 });
            setOriginalPdfSize({ width: origViewport.width, height: origViewport.height });
          }
        } catch(e) {
          console.error("PDF generation for crop failed:", e);
        }
      };
      
      loadPdf();
      return () => {
        isMounted = false;
        URL.revokeObjectURL(fileUrl);
      };
    }
  }, [files]);

  // Sync crop data upward whenever a parameter changes
  useEffect(() => {
    if (completedCropPercent && imageSrc) {
      onCropDataChange({
        percentCrop: completedCropPercent,
        imageSrc,
        originalPdfSize,
        edges: {
          top: Number(top) || 0,
          bottom: Number(bottom) || 0,
          left: Number(left) || 0,
          right: Number(right) || 0
        }
      });
    }
  }, [completedCropPercent, imageSrc, originalPdfSize, top, bottom, left, right, onCropDataChange]);

  const onImageLoad = (e) => {
    imgRef.current = e.currentTarget;
    // Set an initial completed crop
    setCompletedCropPercent({ unit: "%", x: 10, y: 10, width: 80, height: 80 });
  };

  if (!imageSrc) {
    return <div className="p-4 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-xl animate-pulse">Generating high-quality preview...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full mb-6 relative">
      <div className="absolute -top-14 right-0 flex gap-2 w-full max-w-sm">
         <button onClick={() => { setAspect(undefined); setCrop({...crop, width: 80, height: 80}); }} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${aspect === undefined ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>Free</button>
         <button onClick={() => { setAspect(1); setCrop({...crop, width: 50, height: 50}); }} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${aspect === 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>1:1 Square</button>
         <button onClick={() => { setAspect(16/9); setCrop({...crop, width: 80, height: 45}); }} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${aspect === 16/9 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>16:9 Wide</button>
      </div>

      {/* BIG PREVIEW using react-image-crop */}
      <div className="w-full flex justify-center bg-gray-50/50 rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 p-4 border border-gray-100">
        <div className="max-w-full max-h-[650px] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(c, percentCrop) => setCrop(percentCrop)}
            onComplete={(c, percentCrop) => setCompletedCropPercent(percentCrop)}
            aspect={aspect}
            className="shadow-2xl rounded"
          >
            <img 
              src={imageSrc} 
              onLoad={onImageLoad} 
              alt="Crop preview" 
              className="max-h-[600px] object-contain rounded"
            />
          </ReactCrop>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm w-full mx-auto max-w-4xl">
        <div className="space-y-5 flex flex-col justify-center">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Fine-tune Edges Numerically (px)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 block text-center">Top</label>
              <input type="number" min={0} value={top} onChange={(e)=>setTop(e.target.value)} className="w-full bg-gray-50 border border-gray-200 px-3 py-3 rounded-xl text-center text-gray-800 text-base font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="0" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 block text-center">Bottom</label>
              <input type="number" min={0} value={bottom} onChange={(e)=>setBottom(e.target.value)} className="w-full bg-gray-50 border border-gray-200 px-3 py-3 rounded-xl text-center text-gray-800 text-base font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="0" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 block text-center">Left</label>
              <input type="number" min={0} value={left} onChange={(e)=>setLeft(e.target.value)} className="w-full bg-gray-50 border border-gray-200 px-3 py-3 rounded-xl text-center text-gray-800 text-base font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="0" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 block text-center">Right</label>
              <input type="number" min={0} value={right} onChange={(e)=>setRight(e.target.value)} className="w-full bg-gray-50 border border-gray-200 px-3 py-3 rounded-xl text-center text-gray-800 text-base font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="0" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 px-4 py-3 bg-indigo-50 rounded-xl border border-indigo-100 justify-center">
            <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-xs text-indigo-700 font-medium">Use edge inputs to shave exact pixels inward from the blue crop box boundaries.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CropPdf() {
  const [cropData, setCropData] = useState(null);

  const handleProcess = async (files) => {
    if (!files || files.length === 0) throw new Error("Please upload a file");
    if (!cropData || !cropData.percentCrop) throw new Error("Please adjust the crop area first");

    const file = files[0].file || files[0];
    const { percentCrop, imageSrc, originalPdfSize, edges } = cropData;
    
    // Decode the intrinsic dimensions of the generated image to map percentages to exact pixels
    const imageObj = new Image();
    imageObj.src = imageSrc;
    await new Promise((resolve, reject) => {
      imageObj.onload = resolve;
      imageObj.onerror = reject;
    });

    const intrinsicWidth = imageObj.naturalWidth;
    const intrinsicHeight = imageObj.naturalHeight;

    let rawX = (percentCrop.x / 100) * intrinsicWidth;
    let rawY = (percentCrop.y / 100) * intrinsicHeight;
    let rawW = (percentCrop.width / 100) * intrinsicWidth;
    let rawH = (percentCrop.height / 100) * intrinsicHeight;

    let finalX, finalY, finalW, finalH;

    if (file.type === "application/pdf") {
      if (!originalPdfSize) throw new Error("PDF processing not ready yet");
      // The canvas preview was scaled by 2.0 when rendering from pdfjs
      const scale = 2.0;

      // Unscale the visual crop box and apply manual edge tweaks safely
      rawX = (rawX / scale) + edges.left;
      rawY = (rawY / scale) + edges.top;
      rawW = Math.max(1, (rawW / scale) - edges.left - edges.right);
      rawH = Math.max(1, (rawH / scale) - edges.top - edges.bottom);
      
      finalX = rawX;
      // PDF documents conventionally origin at bottom-left in pdf-lib
      finalY = originalPdfSize.height - rawY - rawH;
      finalW = rawW;
      finalH = rawH;

    } else {
      // Direct pixel math for standard images (origin top-left)
      finalX = rawX + edges.left;
      finalY = rawY + edges.top;
      finalW = Math.max(1, rawW - edges.left - edges.right);
      finalH = Math.max(1, rawH - edges.top - edges.bottom);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("x", Math.round(finalX));
    formData.append("y", Math.round(finalY));
    formData.append("width", Math.round(finalW));
    formData.append("height", Math.round(finalH));

    const res = await fetch("http://localhost:5000/api/pdf/crop", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      let err = "Failed to crop";
      try {
        const d = await res.json();
        if (d.error) err = d.error;
      } catch (e) {}
      throw new Error(err);
    }

    return await res.blob();
  };

  const renderConfiguration = (files) => (
    <CropConfigView files={files} onCropDataChange={setCropData} />
  );

  return (
    <ToolLayout
      toolId="crop-pdf"
      actionLabel="Crop Selection"
      outputFileName="cropped-file"
      accept="image/*,application/pdf"
      layout="stack"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop an image or PDF file." },
        { num: "2", title: "Adjust", desc: "Drag the crop box edges and use inputs for precision." },
        { num: "3", title: "Download", desc: "Instantly auto-download your cropped file." },
      ]}
      features={[
        "Responsive edge-to-edge view",
        "Edge parameter fine-tuning",
        "Supports JPG, PNG & PDF natively",
      ]}
      allowMultiple={false}
      onProcess={handleProcess}
      renderConfiguration={renderConfiguration}
    />
  );
}
