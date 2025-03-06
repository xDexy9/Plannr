import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  fullName?: string;
  location?: {
    city: string;
    country: string;
  };
  dob?: string;
  joinDate: string;
  streak: number;
  achievements: number;
  tasksCompleted: number;
  workweekDays: number[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, dob: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll just simulate a successful login
    
    // Special case for demo user
    if (username === 'demo_user') {
      const demoUser: User = {
        id: 'demo123',
        username: 'demo_user',
        fullName: 'Demo User',
        location: {
          city: 'San Francisco',
          country: 'USA'
        },
        dob: '1990-01-01',
        joinDate: new Date().toISOString(),
        streak: 5,
        achievements: 3,
        tasksCompleted: 18,
        workweekDays: [1, 2, 3, 4, 5], // Monday to Friday
      };
      
      localStorage.setItem('user', JSON.stringify(demoUser));
      setUser(demoUser);
      setIsAuthenticated(true);
      return;
    }
    
    // Regular user login
    const mockUser: User = {
      id: '1',
      username,
      joinDate: new Date().toISOString(),
      streak: 0,
      achievements: 0,
      tasksCompleted: 0,
      workweekDays: [1, 2, 3, 4, 5], // Monday to Friday
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const register = async (username: string, password: string, dob: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll just simulate a successful registration
    const mockUser: User = {
      id: '1',
      username,
      dob,
      joinDate: new Date().toISOString(),
      streak: 0,
      achievements: 0,
      tasksCompleted: 0,
      workweekDays: [1, 2, 3, 4, 5], // Monday to Friday
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      updateProfile,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 