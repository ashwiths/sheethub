import { useState } from "react"; 
import ToolLayout from "../components/ToolLayout"; 

export default function PageNumbers() { 
  const [file, setFile] = useState(null); 

  const handleAddNumbers = async (customName) => { 
    if (!file) { 
      alert("Please upload a PDF file"); 
      return; 
    } 

    const formData = new FormData(); 
    formData.append("file", file); 

    try { 
      const response = await fetch("http://localhost:5000/api/pdf/page-numbers", { 
        method: "POST", 
        body: formData, 
      }); 

      if (!response.ok) { 
        throw new Error("Failed to add page numbers"); 
      } 

      const blob = await response.blob(); 

      // filename logic 
      const finalName = 
        customName && customName.trim() !== "" 
          ? `${customName}.pdf` 
          : file.name.replace(/\.pdf$/i, "_numbered.pdf"); 

      // auto download 
      const url = window.URL.createObjectURL(blob); 
      const a = document.createElement("a"); 

      a.href = url; 
      a.download = finalName; 

      document.body.appendChild(a); 
      a.click(); 
      a.remove(); 

      window.URL.revokeObjectURL(url); 

    } catch (error) { 
      console.error(error); 
      alert("Error adding page numbers"); 
    } 
  }; 

  return ( 
    <ToolLayout 
      title="Add Page Numbers" 
      description="Insert page numbers into your PDF for better readability." 
      accept=".pdf" 
      file={file} 
      setFile={setFile} 
      onConvert={handleAddNumbers} 
      outputExtension="pdf" 
    /> 
  ); 
}