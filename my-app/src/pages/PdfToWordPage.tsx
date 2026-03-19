import ToolLayout from "../components/ToolLayout";

export default function PdfToWordPage() {
  return (
    <ToolLayout
      toolId="pdf-to-word"
      actionLabel="Convert to Word"
      outputFileName="converted.docx"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PDF file." },
        { num: "2", title: "Convert", desc: "We extract text, tables, and images." },
        { num: "3", title: "Download", desc: "Get your editable .docx file." },
      ]}
      features={[
        "Accurate text extraction",
        "Tables & images preserved",
        "Editable .docx output",
      ]}
    />
  );
}
