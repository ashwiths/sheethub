import ToolLayout from "../components/ToolLayout";

export default function PdfToPdfaPage() {
  return (
    <ToolLayout
      toolId="pdf-to-pdfa"
      actionLabel="Convert to PDF/A"
      outputFileName="pdf-to-pdfa-output.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your file." },
        { num: "2", title: "Convert to PDF/A", desc: "Configure settings and click start." },
        { num: "3", title: "Download", desc: "Get your processed file instantly." },
      ]}
      features={[
        "High quality processing",
        "Fast and secure",
        "Unlimited free usage",
      ]}
    />
  );
}
