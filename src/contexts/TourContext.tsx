import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TourContextType {
  isTourOpen: boolean;
  startTour: () => void;
  endTour: () => void;
  hasSeenTour: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

interface TourProviderProps {
  children: ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  // Check if user has seen the tour before
  useEffect(() => {
    const tourSeen = localStorage.getItem('plannr_tour_completed');
    if (tourSeen) {
      setHasSeenTour(true);
    } else {
      // Automatically start tour for first-time users after a short delay
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = () => {
    setIsTourOpen(true);
  };

  const endTour = () => {
    setIsTourOpen(false);
    setHasSeenTour(true);
    localStorage.setItem('plannr_tour_completed', 'true');
  };

  return (
    <TourContext.Provider value={{ isTourOpen, startTour, endTour, hasSeenTour }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = (): TourContextType => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}; 