import ToolLayout from "../components/ToolLayout";

export default function WordToPdfPage() {
  return (
    <ToolLayout
      toolId="word-to-pdf"
      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      actionLabel="Convert to PDF"
      outputFileName="document.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your Word file (.doc or .docx)." },
        { num: "2", title: "Convert", desc: "Fonts, layouts, and styles are preserved." },
        { num: "3", title: "Download", desc: "Get your perfect PDF instantly." },
      ]}
      features={[
        "Perfect layout conversion",
        "Supports .doc and .docx",
        "No Word installation needed",
      ]}
    />
  );
}
