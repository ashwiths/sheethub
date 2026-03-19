import ToolLayout from "../components/ToolLayout";

export default function HtmlToPdfPage() {
  return (
    <ToolLayout
      toolId="html-to-pdf"
      actionLabel="Convert to PDF"
      outputFileName="html-to-pdf-output.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your file." },
        { num: "2", title: "Convert to PDF", desc: "Configure settings and click start." },
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
