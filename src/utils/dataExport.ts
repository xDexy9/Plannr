import { Task } from '../contexts/TaskContext';
import { User } from '../contexts/AuthContext';
import { getTasks, getUser, saveTasks, saveUser, saveLastStreakDate } from './storage';

interface ExportData {
  version: string;
  exportDate: string;
  user: User | null;
  tasks: Task[];
}

/**
 * Exports all user data to a JSON file
 */
export const exportData = (): void => {
  try {
    const data: ExportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      user: getUser(),
      tasks: getTasks()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `plannr-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Failed to export data. Please try again.');
  }
};

/**
 * Imports user data from a JSON file
 * @param jsonString The JSON string to import
 * @returns A result object indicating success or failure
 */
export const importData = (jsonString: string): { success: boolean; message: string } => {
  try {
    const data = JSON.parse(jsonString) as ExportData;
    
    // Validate the data structure
    if (!data.version || !data.exportDate) {
      return { 
        success: false, 
        message: 'Invalid backup file format. Missing version or export date.' 
      };
    }
    
    // Import tasks
    if (Array.isArray(data.tasks)) {
      saveTasks(data.tasks);
    } else {
      return { 
        success: false, 
        message: 'Invalid tasks data in backup file.' 
      };
    }
    
    // Import user data
    if (data.user) {
      saveUser(data.user);
      
      // Set last streak date to today to prevent streak reset
      const today = new Date().toISOString().split('T')[0];
      saveLastStreakDate(today);
    }
    
    return { 
      success: true, 
      message: 'Data imported successfully! Refreshing page...' 
    };
  } catch (error) {
    console.error('Error importing data:', error);
    return { 
      success: false, 
      message: 'Failed to import data. The file may be corrupted.' 
    };
  }
};

/**
 * Handles file selection for import
 * @param file The selected file
 * @returns A promise that resolves with the import result
 */
export const handleFileImport = (file: File): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    if (file.type !== 'application/json') {
      resolve({ 
        success: false, 
        message: 'Please select a JSON file.' 
      });
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        const importResult = importData(result);
        resolve(importResult);
      } else {
        resolve({ 
          success: false, 
          message: 'Failed to read file. Please try again.' 
        });
      }
    };
    
    reader.onerror = () => {
      resolve({ 
        success: false, 
        message: 'Error reading file. Please try again.' 
      });
    };
    
    reader.readAsText(file);
  });
}; 