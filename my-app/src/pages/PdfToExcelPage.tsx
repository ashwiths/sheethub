import ToolLayout from "../components/ToolLayout";

export default function PdfToExcelPage() {
  return (
    <ToolLayout
      toolId="pdf-to-excel"
      actionLabel="Convert to Excel"
      outputFileName="pdf-to-excel-output.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your file." },
        { num: "2", title: "Convert to Excel", desc: "Configure settings and click start." },
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
