import ToolLayout from "../components/ToolLayout";

export default function CropPdfPage() {
  return (
    <ToolLayout
      toolId="crop-pdf"
      actionLabel="Crop PDF"
      outputFileName="crop-pdf-output.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your file." },
        { num: "2", title: "Crop PDF", desc: "Configure settings and click start." },
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
