import api from '../utils/api';
import { API_CONFIG } from '../config/api';
import CryptoJS from 'crypto-js';

class FileService {
  private static instance: FileService;
  private readonly encryptionKey: string;

  private constructor() {
    const key = import.meta.env.VITE_FILE_ENCRYPTION_KEY;
    if (!key) {
      throw new Error('File encryption key not found in environment variables');
    }
    this.encryptionKey = key;
  }

  static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }

  private validateFile(file: File): void {
    if (file.size > API_CONFIG.FILE.MAX_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${API_CONFIG.FILE.MAX_SIZE / (1024 * 1024)}MB`);
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!API_CONFIG.FILE.ALLOWED_TYPES.includes(extension)) {
      throw new Error(`File type not allowed. Allowed types: ${API_CONFIG.FILE.ALLOWED_TYPES.join(', ')}`);
    }
  }

  private encryptFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const fileData = e.target?.result as string;
          const encrypted = CryptoJS.AES.encrypt(fileData, this.encryptionKey).toString();
          resolve(encrypted);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  private decryptFile(encryptedData: string): string {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  async uploadFile(file: File, type: 'menu-item' | 'profile' | 'document'): Promise<string> {
    try {
      this.validateFile(file);
      const encryptedData = await this.encryptFile(file);
      
      const formData = new FormData();
      formData.append('file', new Blob([encryptedData], { type: 'application/octet-stream' }));
      formData.append('fileName', file.name);
      formData.append('fileType', type);
      
      const response = await api.post(`${API_CONFIG.ENDPOINTS.FILES.BASE}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          // You can emit this progress to a progress component
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });

      return response.data.fileUrl;
    } catch (error) {
      if (error instanceof Error) {
        console.error('File upload failed:', error.message);
        throw error;
      }
      throw new Error('File upload failed');
    }
  }

  async downloadFile(fileId: string): Promise<Blob> {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.FILES.BASE}/download/${fileId}`, {
        responseType: 'blob',
      });

      const encryptedData = await response.data.text();
      const decryptedData = this.decryptFile(encryptedData);
      
      // Convert base64 to blob
      const byteString = atob(decryptedData.split(',')[1]);
      const mimeString = decryptedData.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      return new Blob([ab], { type: mimeString });
    } catch (error) {
      console.error('File download failed:', error);
      throw error;
    }
  }

  async generateSecureDownloadLink(fileId: string, expiresIn: number = 3600): Promise<string> {
    try {
      const response = await api.post(`${API_CONFIG.ENDPOINTS.FILES.BASE}/secure-link`, {
        fileId,
        expiresIn,
      });
      
      return response.data.downloadUrl;
    } catch (error) {
      console.error('Failed to generate secure download link:', error);
      throw error;
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await api.delete(`${API_CONFIG.ENDPOINTS.FILES.BASE}/${fileId}`);
    } catch (error) {
      console.error('File deletion failed:', error);
      throw error;
    }
  }
}

export const fileService = FileService.getInstance(); 