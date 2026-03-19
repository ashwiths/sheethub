import ToolLayout from "../components/ToolLayout";

export default function OrganizePdfPage() {
  return (
    <ToolLayout
      toolId="organize-pdf"
      actionLabel="Organize PDF"
      outputFileName="organize-pdf-output.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your file." },
        { num: "2", title: "Organize PDF", desc: "Configure settings and click start." },
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
