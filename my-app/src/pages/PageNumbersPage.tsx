import ToolLayout from "../components/ToolLayout";

export default function PageNumbersPage() {
  return (
    <ToolLayout
      toolId="page-numbers"
      actionLabel="Add Page Numbers"
      outputFileName="page-numbers-output.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your file." },
        { num: "2", title: "Add Page Numbers", desc: "Configure settings and click start." },
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
