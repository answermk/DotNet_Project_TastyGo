import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Download, Upload, Trash2, RefreshCw, Clock, Database } from 'lucide-react';
import api from '../../utils/api';
import { API_CONFIG } from '../../config/api';

type Backup = {
  id: string;
  timestamp: string;
  size: number;
  type: 'full' | 'incremental';
  status: 'completed' | 'failed' | 'in_progress';
  description: string;
  createdBy: string;
};

const BackupManagement: React.FC = () => {
  // Fixed: removed unused user from destructuring
  const { addNotification } = useNotifications();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchBackups();
    const interval = setInterval(fetchBackups, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchBackups = async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.BACKUP.LIST);
      setBackups(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch backups:', error);
      addNotification('error', 'Failed to fetch backup list', 'Error'); // Updated
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async (type: 'full' | 'incremental') => {
    setCreatingBackup(true);
    try {
      // Fix 2: Remove unused response variable
      await api.post(API_CONFIG.ENDPOINTS.BACKUP.CREATE, { type });
      addNotification('success', `${type.charAt(0).toUpperCase() + type.slice(1)} backup creation has started`, 'Backup Started'); // Updated
      fetchBackups();
    } catch (error) {
      console.error('Failed to create backup:', error);
      addNotification('error', 'Failed to create backup', 'Error'); // Updated
    } finally {
      setCreatingBackup(false);
    }
  };

  const restoreBackup = async (backupId: string) => {
    if (!window.confirm('Are you sure you want to restore this backup? This action cannot be undone.')) {
      return;
    }

    setRestoringBackup(backupId);
    try {
      await api.post(`${API_CONFIG.ENDPOINTS.BACKUP.RESTORE}/${backupId}`);
      addNotification('error', 'Failed to create backup', 'Error');
      fetchBackups();
    } catch (error) {
      console.error('Failed to restore backup:', error);
      addNotification('error', 'Failed to create backup', 'Error');
    } finally {
      setRestoringBackup(null);
    }
  };

  const deleteBackup = async (backupId: string) => {
    if (!window.confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`${API_CONFIG.ENDPOINTS.BACKUP.DELETE}/${backupId}`);
      addNotification('error', 'Failed to create backup', 'Error');
      fetchBackups();
    } catch (error) {
      console.error('Failed to delete backup:', error);
      addNotification('error', 'Failed to create backup', 'Error');
    }
  };

  const downloadBackup = async (backupId: string) => {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.BACKUP.BASE}/${backupId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `backup-${backupId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download backup:', error);
      addNotification('error', 'Failed to create backup', 'Error');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Backup Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => fetchBackups()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <div className="relative group">
            <button
              disabled={creatingBackup}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
            >
              <Database className="h-4 w-4 mr-2" />
              Create Backup
            </button>
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
              <div className="py-1">
                <button
                  onClick={() => createBackup('full')}
                  disabled={creatingBackup}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Full Backup
                </button>
                <button
                  onClick={() => createBackup('incremental')}
                  disabled={creatingBackup}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Incremental Backup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backups Table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(backup.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        backup.type === 'full'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {backup.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(backup.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        backup.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : backup.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {backup.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {backup.createdBy}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {backup.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => downloadBackup(backup.id)}
                        disabled={backup.status !== 'completed'}
                        className="text-orange-600 hover:text-orange-900 disabled:opacity-50"
                        title="Download"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => restoreBackup(backup.id)}
                        disabled={backup.status !== 'completed' || restoringBackup === backup.id}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        title="Restore"
                      >
                        <Upload className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteBackup(backup.id)}
                        disabled={backup.status === 'in_progress'}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backup Schedule Info */}
      <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Backup Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Full Backups</h3>
            <p className="text-sm text-gray-900 dark:text-white">
              <Clock className="h-4 w-4 inline mr-2" />
              Weekly on Sunday at 2:00 AM
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Incremental Backups</h3>
            <p className="text-sm text-gray-900 dark:text-white">
              <Clock className="h-4 w-4 inline mr-2" />
              Daily at 1:00 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupManagement; 