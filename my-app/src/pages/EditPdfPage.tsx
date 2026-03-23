import ToolLayout from '../components/ToolLayout';

export default function EditPdfPage() {
  return (
    <ToolLayout
      toolId="edit-pdf"
      actionLabel="Edit PDF"
      outputFileName="edited-document.pdf"
      steps={[
        { num: '1', title: 'Upload', desc: 'Select a PDF document you want to edit.' },
        { num: '2', title: 'Edit', desc: 'Add text, highlights, or shapes.' },
        { num: '3', title: 'Save', desc: 'Download your edited PDF instantly.' }
      ]}
    />
  );
}
