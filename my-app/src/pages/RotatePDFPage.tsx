import ToolLayout from "../components/ToolLayout";

export default function RotatePDFPage() {
  return (
    <ToolLayout
      toolId="rotate-pdf"
      actionLabel="Rotate PDF"
      outputFileName="rotated.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PDF file." },
        { num: "2", title: "Rotate", desc: "Choose 90°, 180°, or 270° rotation." },
        { num: "3", title: "Download", desc: "Save your correctly-oriented PDF." },
      ]}
      features={[
        "Rotate individual pages",
        "90°, 180°, or 270° options",
        "Free & instant",
      ]}
    />
  );
}
