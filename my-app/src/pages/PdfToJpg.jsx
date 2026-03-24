import React from "react";
import ToolLayout from "../components/ToolLayout";

export default function PdfToJpg() {
  const handleConvert = async (files) => {
    if (!files || files.length === 0) {
      throw new Error("Please upload a PDF file.");
    }

    const file = files[0].file || files[0];

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pdf/pdf-to-jpg`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMsg = "Conversion failed";
      try {
        const errorData = await response.json();
        if (errorData.error) errorMsg = errorData.error;
      } catch (e) {}
      throw new Error(errorMsg);
    }

    const blob = await response.blob();
    const contentType = response.headers.get("content-type");

    let extension = ".jpg";

    if (contentType && contentType.includes("zip")) {
      extension = ".zip";
    } else if (contentType && contentType.includes("jpeg")) {
      extension = ".jpg";
    }

    const nameInput = document.querySelector('input[placeholder="e.g. my-document"]');
    const customName = nameInput ? nameInput.value.trim() : "";

    const finalName = customName
      ? customName + extension
      : file.name.replace(/\.[^/.]+$/, extension);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = finalName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    // Suppress ToolLayout's double download by intercepting the anchor click temporarily
    const originalClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function() {
      if (this.download.endsWith("images.zip") || this.href.startsWith("blob:")) {
        HTMLAnchorElement.prototype.click = originalClick; // Restore
        return;
      }
      originalClick.call(this);
    };

    return blob;
  };

  return (
    <ToolLayout
      toolId="pdf-to-jpg"
      actionLabel="Convert to JPG"
      outputFileName="images.zip"
      allowMultiple={false}
      accept=".pdf,application/pdf"
      steps={[
        { num: "1", title: "Upload", desc: "Select or drag & drop your PDF file." },
        { num: "2", title: "Convert", desc: "Our system accurately converts it to JPG." },
        { num: "3", title: "Download", desc: "Get your fully formatted JPG documents." },
      ]}
      features={[
        "Preserves exact page quality",
        "Fast and secure conversion",
        "Securely deletes file post-processing",
      ]}
      onProcess={handleConvert}
    />
  );
}
