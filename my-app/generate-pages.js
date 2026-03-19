const fs = require('fs');

const tools = [
  { id: 'pdf-to-powerpoint', label: 'Convert to PowerPoint' },
  { id: 'pdf-to-excel', label: 'Convert to Excel' },
  { id: 'powerpoint-to-pdf', label: 'Convert to PDF' },
  { id: 'excel-to-pdf', label: 'Convert to PDF' },
  { id: 'edit-pdf', label: 'Edit PDF' },
  { id: 'jpg-to-pdf', label: 'Convert to PDF' },
  { id: 'html-to-pdf', label: 'Convert to PDF' },
  { id: 'organize-pdf', label: 'Organize PDF' },
  { id: 'pdf-to-pdfa', label: 'Convert to PDF/A' },
  { id: 'repair-pdf', label: 'Repair PDF' },
  { id: 'page-numbers', label: 'Add Page Numbers' },
  { id: 'scan-to-pdf', label: 'Scan to PDF' },
  { id: 'compare-pdf', label: 'Compare PDF' },
  { id: 'redact-pdf', label: 'Redact PDF' },
  { id: 'crop-pdf', label: 'Crop PDF' },
  { id: 'ai-summarizer', label: 'Summarize PDF' },
  { id: 'translate-pdf', label: 'Translate PDF' },
];

tools.forEach(p => {
  const parts = p.id.split('-');
  const compName = parts.map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('') + 'Page';
  
  const content = `import ToolLayout from "../components/ToolLayout";

export default function ${compName}() {
  return (
    <ToolLayout
      toolId="${p.id}"
      actionLabel="${p.label}"
      outputFileName="${p.id}-output.pdf"
      steps={[
        { num: "01", title: "Upload", desc: "Select or drag & drop your file." },
        { num: "02", title: "${p.label}", desc: "Configure settings and click start." },
        { num: "03", title: "Download", desc: "Get your processed file instantly." },
      ]}
      features={[
        "High quality processing",
        "Fast and secure",
        "Unlimited free usage",
      ]}
    />
  );
}
`;
  fs.writeFileSync(`/home/caren/Sheethub/src/pages/${compName}.tsx`, content);
});

console.log('Pages generated successfully!');
