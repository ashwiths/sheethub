import axios from 'axios';

const API_URL = `\${import.meta.env.VITE_API_URL}/api/pdf`;

/**
 * Sends multiple PDF files to the backend for merging
 * @param {File[]} files - Array of PDF files
 * @returns {Promise<Blob>} - The merged PDF blob
 */
export const mergePDFs = async (files: File[]): Promise<Blob> => {
  if (!files || files.length < 2) {
    throw new Error('At least 2 PDF files are required.');
  }

  const formData = new FormData();
  
  // Append files using key "files" as expected by the backend multer config
  files.forEach((file) => {
    formData.append('files', file);
  });

  try {
    const response = await axios.post(`${API_URL}/merge`, formData, {
      // Receive the file as a Blob
      responseType: 'blob',
    });

    return response.data;
  } catch (error: any) {
    console.error('API Error:', error);
    if (error.response && error.response.data instanceof Blob) {
      // Decode blob error message if the backend sends JSON error instead of blob
      const text = await error.response.data.text();
      try {
        const json = JSON.parse(text);
        throw new Error(json.error || 'Failed to merge PDFs');
      } catch (e) {
        throw new Error('Failed to merge PDFs');
      }
    }
    throw new Error('Failed to connect to the server');
  }
};

/**
 * Sends a PDF file and page numbers to the backend for splitting
 * @param {File} file - The PDF file to split
 * @param {string} pages - The pages to extract (e.g., "1-3", "2,5")
 * @returns {Promise<Blob>} - The split PDF blob
 */
export const splitPDF = async (file: File, pages: string): Promise<Blob> => {
  if (!file) {
    throw new Error('A PDF file is required.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('pages', pages);

  try {
    const response = await axios.post(`${API_URL}/split`, formData, {
      responseType: 'blob',
    });

    return response.data;
  } catch (error: any) {
    console.error('API Error:', error);
    if (error.response && error.response.data instanceof Blob) {
      const text = await error.response.data.text();
      try {
        const json = JSON.parse(text);
        throw new Error(json.error || 'Failed to split PDF');
      } catch (e) {
        throw new Error('Failed to split PDF');
      }
    }
    throw new Error(error.response?.data?.error || 'Failed to connect to the server');
  }
};
