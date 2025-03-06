import { Task } from '../contexts/TaskContext';
import { User } from '../contexts/AuthContext';

// Storage keys
const KEYS = {
  TASKS: 'plannr_tasks',
  USER: 'user',
  LAST_STREAK_DATE: 'plannr_last_streak_date',
  STORAGE_VERSION: 'plannr_storage_version'
};

// Current storage version - increment when making breaking changes to storage structure
const CURRENT_VERSION = '1.0';

// Initialize storage version if not set
const initializeStorage = (): void => {
  try {
    const version = localStorage.getItem(KEYS.STORAGE_VERSION);
    if (!version) {
      localStorage.setItem(KEYS.STORAGE_VERSION, CURRENT_VERSION);
    } else if (version !== CURRENT_VERSION) {
      // Handle migration if needed in the future
      console.log(`Storage version updated from ${version} to ${CURRENT_VERSION}`);
      localStorage.setItem(KEYS.STORAGE_VERSION, CURRENT_VERSION);
    }
  } catch (error) {
    console.error('Failed to initialize storage:', error);
  }
};

// Initialize on module load
initializeStorage();

// Generic get function with error handling
export const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from storage:`, error);
    return defaultValue;
  }
};

// Generic set function with error handling
export const setItem = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
    
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert('Storage limit reached. Please clear some data or try a different browser.');
    }
    
    return false;
  }
};

// Remove item with error handling
export const removeItem = (key: string): boolean => {
  try {
    localStorage.setItem(key, '');
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    return false;
  }
};

// Task-specific functions
export const getTasks = (): Task[] => {
  return getItem<Task[]>(KEYS.TASKS, []);
};

export const saveTasks = (tasks: Task[]): boolean => {
  return setItem(KEYS.TASKS, tasks);
};

// User-specific functions
export const getUser = (): User | null => {
  return getItem<User | null>(KEYS.USER, null);
};

export const saveUser = (user: User): boolean => {
  return setItem(KEYS.USER, user);
};

export const removeUser = (): boolean => {
  return removeItem(KEYS.USER);
};

// Streak-specific functions
export const getLastStreakDate = (): string => {
  return getItem<string>(KEYS.LAST_STREAK_DATE, '');
};

export const saveLastStreakDate = (date: string): boolean => {
  return setItem(KEYS.LAST_STREAK_DATE, date);
};

// Storage status check
export const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Get storage usage information
export const getStorageInfo = (): { used: number, total: number, percentage: number } => {
  let used = 0;
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        used += key.length + value.length;
      }
    }
  } catch (e) {
    console.error('Error calculating storage usage:', e);
  }
  
  // Convert to KB (approximate)
  const usedKB = Math.round(used / 1024);
  
  // Most browsers have a limit of 5-10MB
  const totalKB = 5 * 1024; // 5MB in KB
  
  return {
    used: usedKB,
    total: totalKB,
    percentage: Math.min(100, Math.round((usedKB / totalKB) * 100))
  };
}; 