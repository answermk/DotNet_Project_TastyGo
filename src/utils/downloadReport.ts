import axios from 'axios';
import { getApiUrl } from '../config/api';

export async function downloadReport(endpoint: string, params: any, filename: string, format: string) {
  try {
    const response = await axios.get(getApiUrl(endpoint), {
      params,
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/octet-stream',
      }
    });

    // Create blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading report:', error);
    throw error;
  }
} 