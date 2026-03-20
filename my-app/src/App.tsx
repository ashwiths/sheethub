import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Eagerly loaded
import HomePage from "./pages/HomePage";

// Lazy loaded pages
const AboutPage           = lazy(() => import("./pages/AboutPage"));

// Lazy loaded tool pages
const MergePDFPage        = lazy(() => import("./pages/MergePDFPage"));
const SplitPDFPage        = lazy(() => import("./pages/SplitPDFPage"));
const CompressPDFPage     = lazy(() => import("./pages/CompressPDFPage"));
const RotatePDFPage       = lazy(() => import("./pages/RotatePDFPage"));
const PdfToWordPage       = lazy(() => import("./pages/PdfToWordPage"));
const PdfToImagePage      = lazy(() => import("./pages/PdfToImagePage"));
const WordToPdfPage       = lazy(() => import("./pages/WordToPdfPage"));
const WatermarkPDFPage    = lazy(() => import("./pages/WatermarkPDFPage"));
const OcrPDFPage          = lazy(() => import("./pages/OcrPDFPage"));
const ProtectPDFPage      = lazy(() => import("./pages/ProtectPDFPage"));
const UnlockPDFPage       = lazy(() => import("./pages/UnlockPDFPage"));
const SignPDFPage         = lazy(() => import("./pages/SignPDFPage"));
// New 17 tools
const PdfToPowerpointPage = lazy(() => import("./pages/PdfToPowerpointPage"));
const PdfToExcelPage      = lazy(() => import("./pages/PdfToExcelPage"));
const PowerpointToPdfPage = lazy(() => import("./pages/PowerpointToPdfPage"));
const ExcelToPdfPage      = lazy(() => import("./pages/ExcelToPdfPage"));
const EditPdfPage         = lazy(() => import("./pages/EditPdfPage"));
const JpgToPdfPage        = lazy(() => import("./pages/JpgToPdfPage"));
const HtmlToPdfPage       = lazy(() => import("./pages/HtmlToPdfPage"));
const OrganizePdfPage     = lazy(() => import("./pages/OrganizePdfPage"));
const PdfToPdfaPage       = lazy(() => import("./pages/PdfToPdfaPage"));
const RepairPdfPage       = lazy(() => import("./pages/RepairPdfPage"));
const PageNumbersPage     = lazy(() => import("./pages/PageNumbersPage"));
const ScanToPdfPage       = lazy(() => import("./pages/ScanToPdfPage"));
const ComparePdfPage      = lazy(() => import("./pages/ComparePdfPage"));
const RedactPdfPage       = lazy(() => import("./pages/RedactPdfPage"));
const CropPdfPage         = lazy(() => import("./pages/CropPdfPage"));
const AiSummarizerPage    = lazy(() => import("./pages/AiSummarizerPage"));
const TranslatePdfPage    = lazy(() => import("./pages/TranslatePdfPage"));

import ScrollToTop from "./components/ScrollToTop";

// Suspense fallback — subtle spinner
function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <svg
          className="animate-spin w-8 h-8 text-violet-500"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <p className="text-sm text-gray-400 font-medium">Loading tool…</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"                   element={<HomePage />} />
              <Route path="/about"              element={<AboutPage />} />
              <Route path="/merge-pdf"          element={<MergePDFPage />} />
              <Route path="/split-pdf"          element={<SplitPDFPage />} />
              <Route path="/compress-pdf"       element={<CompressPDFPage />} />
              <Route path="/rotate-pdf"         element={<RotatePDFPage />} />
              <Route path="/pdf-to-word"        element={<PdfToWordPage />} />
              <Route path="/pdf-to-image"       element={<PdfToImagePage />} />
              <Route path="/word-to-pdf"        element={<WordToPdfPage />} />
              <Route path="/watermark-pdf"      element={<WatermarkPDFPage />} />
              <Route path="/ocr-pdf"            element={<OcrPDFPage />} />
              <Route path="/protect-pdf"        element={<ProtectPDFPage />} />
              <Route path="/unlock-pdf"         element={<UnlockPDFPage />} />
              <Route path="/sign-pdf"           element={<SignPDFPage />} />
              {/* New 17 routes */}
              <Route path="/pdf-to-powerpoint"  element={<PdfToPowerpointPage />} />
              <Route path="/pdf-to-excel"       element={<PdfToExcelPage />} />
              <Route path="/powerpoint-to-pdf"  element={<PowerpointToPdfPage />} />
              <Route path="/excel-to-pdf"       element={<ExcelToPdfPage />} />
              <Route path="/edit-pdf"           element={<EditPdfPage />} />
              <Route path="/jpg-to-pdf"         element={<JpgToPdfPage />} />
              <Route path="/html-to-pdf"        element={<HtmlToPdfPage />} />
              <Route path="/organize-pdf"       element={<OrganizePdfPage />} />
              <Route path="/pdf-to-pdfa"        element={<PdfToPdfaPage />} />
              <Route path="/repair-pdf"         element={<RepairPdfPage />} />
              <Route path="/page-numbers"       element={<PageNumbersPage />} />
              <Route path="/scan-to-pdf"        element={<ScanToPdfPage />} />
              <Route path="/compare-pdf"        element={<ComparePdfPage />} />
              <Route path="/redact-pdf"         element={<RedactPdfPage />} />
              <Route path="/crop-pdf"           element={<CropPdfPage />} />
              <Route path="/ai-summarizer"      element={<AiSummarizerPage />} />
              <Route path="/translate-pdf"      element={<TranslatePdfPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
