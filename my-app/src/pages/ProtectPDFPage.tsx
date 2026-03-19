import ToolLayout from "../components/ToolLayout";

export default function ProtectPDFPage() {
  return (
    <ToolLayout
      toolId="protect-pdf"
      actionLabel="Protect PDF"
      outputFileName="protected.pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PDF file." },
        { num: "2", title: "Set password", desc: "Enter a strong password to encrypt." },
        { num: "3", title: "Download", desc: "Get your password-protected PDF." },
      ]}
      features={[
        "AES-256 encryption",
        "Owner & user passwords",
        "Restricts printing & copying",
      ]}
    />
  );
}
