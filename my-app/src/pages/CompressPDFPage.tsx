import ToolLayout from "../components/ToolLayout";
import CompressOptions from "../components/tools/CompressOptions";

export default function CompressPDFPage() {
  return (
    <ToolLayout
      toolId="compress-pdf"
      actionLabel="Compress PDF"
      outputFileName="compressed.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PDF file." },
        { num: "2", title: "Optimize", desc: "Choose compression level to optimize size vs quality." },
        { num: "3", title: "Download", desc: "Get your smaller PDF instantly." },
      ]}
      features={[
        "Reduces file size up to 90%",
        "Preserves visual quality",
        "No watermarks added",
      ]}
      renderConfiguration={(files) => <CompressOptions files={files} />}
    />
  );
}
