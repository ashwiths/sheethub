import ToolLayout from "../components/ToolLayout";

export default function PdfToImagePage() {
  return (
    <ToolLayout
      toolId="pdf-to-image"
      actionLabel="Convert to Image"
      outputFileName="pages.zip"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PDF file." },
        { num: "2", title: "Convert", desc: "Each page is rendered at high resolution." },
        { num: "3", title: "Download", desc: "Get PNG/JPG images in a zip file." },
      ]}
      features={[
        "High-resolution output (300 DPI)",
        "PNG & JPG formats",
        "Every page exported",
      ]}
    />
  );
}
