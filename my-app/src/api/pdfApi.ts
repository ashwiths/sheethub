import axios from 'axios';

const API_URL = 'http://localhost:5000/api/pdf';

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
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
