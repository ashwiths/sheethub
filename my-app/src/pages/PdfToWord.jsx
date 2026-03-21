import React, { useState } from 'react';
import { UploadCloud, Download, Loader2, FileText } from 'lucide-react';

export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      alert("Please upload a PDF");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/pdf/pdf-to-word", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      // Handle response as blob
      const blob = await response.blob();
      
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Clear file after success
      setFile(null);
    } catch (err) {
      alert("Conversion failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-inner">
            <FileText size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF to Word</h1>
          <p className="text-gray-500">Convert your PDF files to editable Word documents.</p>
        </div>

        <div className="space-y-6">
          {/* File Upload component */}
          <div className="relative">
            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${file ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className={`w-8 h-8 mb-3 ${file ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">Accepts only .pdf</p>
              </div>
              <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
            
            {file && (
              <div className="mt-3 text-sm text-gray-700 bg-gray-100 p-3 rounded-lg border border-gray-200">
                📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleConvert}
            disabled={!file || loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
              !file || loading
                ? 'bg-gray-300 cursor-not-allowed shadow-none text-gray-500'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              <>
                <Download size={20} />
                Convert to Word
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
