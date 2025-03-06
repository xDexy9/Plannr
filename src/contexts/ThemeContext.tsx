import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';
type ThemeColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'blue' | 'purple' | 'teal' | 'orange' | 'cyan' | 'lime' | 'hotpink' | 'custom';

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  applyThemeColor: (color: ThemeColor, customHex?: string) => void;
  customColorHex: string;
  setCustomColorHex: (hex: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const colorMap = {
  indigo: {
    light: '#4f46e5',
    dark: '#6366f1',
  },
  emerald: {
    light: '#10b981',
    dark: '#34d399',
  },
  rose: {
    light: '#e11d48',
    dark: '#fb7185',
  },
  amber: {
    light: '#d97706',
    dark: '#f59e0b',
  },
  blue: {
    light: '#2563eb',
    dark: '#3b82f6',
  },
  purple: {
    light: '#9333ea',
    dark: '#a855f7',
  },
  teal: {
    light: '#0d9488',
    dark: '#14b8a6',
  },
  orange: {
    light: '#ea580c',
    dark: '#f97316',
  },
  cyan: {
    light: '#0891b2',
    dark: '#06b6d4',
  },
  lime: {
    light: '#65a30d',
    dark: '#84cc16',
  },
  hotpink: {
    light: '#e91e63',
    dark: '#ff4081',
  },
  custom: {
    light: '#6366f1', // Default, will be overridden
    dark: '#6366f1',  // Default, will be overridden
  },
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return (savedMode as ThemeMode) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  
  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    const savedColor = localStorage.getItem('theme-color');
    return (savedColor as ThemeColor) || 'indigo';
  });

  const [customColorHex, setCustomColorHex] = useState<string>(() => {
    const savedCustomColor = localStorage.getItem('custom-color-hex');
    return savedCustomColor || '#6366f1';
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);
  
  useEffect(() => {
    localStorage.setItem('theme-color', themeColor);
    applyThemeColor(themeColor, themeColor === 'custom' ? customColorHex : undefined);
  }, [themeColor, customColorHex]);

  useEffect(() => {
    if (themeColor === 'custom') {
      localStorage.setItem('custom-color-hex', customColorHex);
      applyThemeColor('custom', customColorHex);
    }
  }, [customColorHex]);

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const applyThemeColor = (color: ThemeColor, customHex?: string) => {
    if (color === 'custom' && customHex) {
      // For custom color, use the same hex for both light and dark modes
      document.documentElement.style.setProperty('--color-primary-light', customHex);
      document.documentElement.style.setProperty('--color-primary-dark', customHex);
    } else {
      document.documentElement.style.setProperty('--color-primary-light', colorMap[color].light);
      document.documentElement.style.setProperty('--color-primary-dark', colorMap[color].dark);
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, themeColor, setThemeColor, applyThemeColor, customColorHex, setCustomColorHex }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 