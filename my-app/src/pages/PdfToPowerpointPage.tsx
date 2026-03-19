import ToolLayout from "../components/ToolLayout";

export default function PdfToPowerpointPage() {
  return (
    <ToolLayout
      toolId="pdf-to-powerpoint"
      actionLabel="Convert to PowerPoint"
      outputFileName="pdf-to-powerpoint-output.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your file." },
        { num: "2", title: "Convert to PowerPoint", desc: "Configure settings and click start." },
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
