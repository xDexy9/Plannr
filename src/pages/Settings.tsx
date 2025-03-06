import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import { FiSave, FiUpload, FiDownload, FiTrash2, FiInfo, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { exportData, handleFileImport } from '../utils/dataExport';
import { getStorageInfo, isStorageAvailable } from '../utils/storage';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { tasks } = useTask();
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message: string }>({ message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const storageInfo = getStorageInfo();
  const storageAvailable = isStorageAvailable();
  
  const handleExport = () => {
    exportData();
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImportStatus({ message: 'Importing data...' });
    
    const result = await handleFileImport(file);
    setImportStatus(result);
    
    if (result.success) {
      // Refresh the page after a short delay to apply imported data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone!')) {
      localStorage.clear();
      window.location.reload();
    }
  };
  
  return (
    <div className="pb-16 md:pb-0">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* User Info */}
      {user && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Username</p>
              <p className="font-medium">{user.username}</p>
            </div>
            
            {user.fullName && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                <p className="font-medium">{user.fullName}</p>
              </div>
            )}
            
            {user.location && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                <p className="font-medium">{user.location.city}, {user.location.country}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
              <p className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
            </div>
            
            <div className="pt-2">
              <button 
                onClick={logout}
                className="btn btn-outline-primary"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Data Management */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Data Management</h2>
        
        {/* Storage Info */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Storage Usage</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {storageInfo.used} KB / {storageInfo.total} KB
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-primary-light dark:bg-primary-dark h-2.5 rounded-full" 
              style={{ width: `${storageInfo.percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {storageAvailable 
              ? `${storageInfo.percentage}% of available storage used` 
              : 'Local storage is not available in your browser'}
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tasks</p>
            <p className="text-2xl font-bold">{tasks.length}</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            <p className="text-2xl font-bold">{tasks.filter(t => t.completed).length}</p>
          </div>
        </div>
        
        {/* Import/Export */}
        <div className="space-y-4">
          <div>
            <button 
              onClick={handleExport}
              className="btn btn-outline-primary w-full flex items-center justify-center"
            >
              <FiDownload className="mr-2" /> Export Data
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Download all your tasks and settings as a JSON file
            </p>
          </div>
          
          <div>
            <button 
              onClick={handleImportClick}
              className="btn btn-outline-primary w-full flex items-center justify-center"
            >
              <FiUpload className="mr-2" /> Import Data
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Restore from a previously exported JSON file
            </p>
          </div>
          
          {importStatus.message && (
            <div className={`p-3 rounded-md mt-2 flex items-start ${
              importStatus.success === undefined ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
              importStatus.success ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
              'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
            }`}>
              {importStatus.success === undefined ? <FiInfo className="mr-2 mt-0.5" /> :
               importStatus.success ? <FiCheck className="mr-2 mt-0.5" /> :
               <FiAlertTriangle className="mr-2 mt-0.5" />}
              <p className="text-sm">{importStatus.message}</p>
            </div>
          )}
          
          <div className="pt-4 border-t dark:border-gray-700">
            <button 
              onClick={handleClearData}
              className="btn btn-outline-danger w-full flex items-center justify-center"
            >
              <FiTrash2 className="mr-2" /> Clear All Data
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Delete all your data from this device (cannot be undone)
            </p>
          </div>
        </div>
      </div>
      
      {/* App Info */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">About Plannr</h2>
        <div className="space-y-2">
          <p className="text-sm text-justify">Plannr is a simple yet powerful task management app designed to help you stay on top of daily chores and personal goals. What began as a way to track household tasks has evolved into a dynamic tool for building habits, staying organized, and boosting productivity—whether for personal use or to help others.</p>
          <p className="text-sm">Made with ❤️ by <span className="text-black font-bold">xDexy</span></p>
          <p className="text-sm">Version: 1.0.0 (Beta)</p>
          <p className="text-sm">
            <a 
              href="https://github.com/yourusername/plannr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-light dark:text-primary-dark hover:underline"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings; 