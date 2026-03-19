import { useState, useEffect } from "react";
import { ArrowLeft, User, PenTool, Hash, Calendar, Type, Stamp, Download, Loader2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";

interface SignPdfEditorProps {
  file: File;
  onClose: () => void;
}

export default function SignPdfEditor({ file, onClose }: SignPdfEditorProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSign = async () => {
    setIsSigning(true);
    try {
      // Simulate signing process by modifying the PDF slightly (adding a small text or just re-saving)
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // We could add a signature text here, but just re-saving to create a 'signed' version for now
      const pdfBytes = await pdfDoc.save();
      const newBlob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const newUrl = URL.createObjectURL(newBlob);
      setDownloadUrl(newUrl);
    } catch (error) {
      console.error("Error signing PDF:", error);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-[9999] flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="h-14 bg-gray-900 text-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Close Editor"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-xs font-bold">
              PDF
            </div>
            <span className="font-semibold text-sm">Sign PDF</span>
          </div>
        </div>
        
        <div className="text-sm truncate max-w-sm text-gray-300">
          {file.name}
        </div>
        
        <div className="w-10"></div> {/* Spacer for symmetry */}
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Thumbnails */}
        <div className="w-48 bg-gray-100 border-r border-gray-200 overflow-y-auto hidden md:block shrink-0 p-4">
          <div className="space-y-4">
            {/* Mock Thumbnail */}
            <div className="aspect-[1/1.4] bg-white shadow-sm border border-gray-300 relative rounded">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                Page 1
              </div>
              <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500">
                1
              </div>
            </div>
            {/* You would generate thumbnails using react-pdf or pdf.js here */}
          </div>
        </div>

        {/* Main Document Viewer */}
        <div className="flex-1 bg-gray-200/80 overflow-auto relative p-8 flex justify-center object-contain">
           {downloadUrl ? (
             <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center h-fit m-auto text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <Download size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">PDF Signed!</h2>
                <p className="text-gray-500 mb-8">Your document has been successfully signed and is ready for download.</p>
                <a 
                  href={downloadUrl}
                  download={`signed_${file.name}`}
                  className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
                >
                  <Download size={20} />
                  Download Signed PDF
                </a>
                <button
                  onClick={onClose}
                  className="mt-4 px-8 py-3 text-gray-600 hover:bg-gray-100 font-medium rounded-xl transition-colors"
                >
                  Back to Tools
                </button>
             </div>
           ) : (
              <div className="w-full max-w-4xl bg-white shadow-lg" style={{ minHeight: '100%' }}>
                 {pdfUrl && (
                   <iframe
                     src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                     style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
                     title="PDF Viewer"
                   />
                 )}
              </div>
           )}
        </div>

        {/* Right Sidebar - Signing Options */}
        <div className="w-80 bg-white border-l border-gray-200 shadow-xl z-10 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Signing options</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Type */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Type</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center justify-center px-2 py-4 border-2 border-red-500 bg-red-50 text-red-700 rounded-xl">
                  <PenTool size={20} className="mb-2" />
                  <span className="text-xs font-medium">Simple Signature</span>
                </button>
                <button className="flex flex-col items-center justify-center px-2 py-4 border-2 border-gray-100 hover:border-gray-200 text-gray-600 rounded-xl transition-colors">
                  <User size={20} className="mb-2 opacity-50" />
                  <span className="text-xs font-medium">Digital Signature</span>
                </button>
              </div>
            </div>

            {/* Required Fields */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Required fields</h3>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors bg-gray-50 group">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
                    <PenTool size={16} />
                  </div>
                  <div className="text-left flex flex-col">
                    <span className="text-xs text-blue-600 font-semibold mb-1">Signature</span>
                    <span className="text-xs font-signature italic text-gray-800">Your Signature</span>
                  </div>
                </div>
                <PenTool size={14} className="text-gray-400 group-hover:text-blue-500" />
              </button>
            </div>

            {/* Optional Fields */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Optional fields</h3>
              <div className="space-y-2">
                {[
                  { icon: Hash, label: "Initials", desc: "J.D." },
                  { icon: User, label: "Name" },
                  { icon: Calendar, label: "Date" },
                  { icon: Type, label: "Text" },
                  { icon: Stamp, label: "Company Stamp" },
                ].map((item, idx) => (
                  <button key={idx} className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors bg-gray-50">
                    <div className="p-1.5 bg-gray-200 text-gray-600 rounded-md">
                      <item.icon size={16} />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{item.label}</span>
                    {item.desc && <span className="ml-auto text-xs italic text-gray-500">{item.desc}</span>}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button 
              onClick={handleSign}
              disabled={isSigning || !!downloadUrl}
              className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isSigning ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                   Sign <ArrowLeft size={16} className="rotate-180" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
