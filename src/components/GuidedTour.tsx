import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

interface TourStep {
  title: string;
  content: string;
  target: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

interface GuidedTourProps {
  onComplete: () => void;
  isOpen: boolean;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ onComplete, isOpen }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  
  const tourSteps: TourStep[] = [
    {
      title: 'Welcome to Plannr!',
      content: 'This quick tour will show you how to use the app. Click Next to continue.',
      target: 'body',
      placement: 'bottom'
    },
    {
      title: 'Task Management',
      content: 'Here you can view your daily tasks and mark them as complete.',
      target: '.nav-item[href="/plannr"]',
      placement: 'top'
    },
    {
      title: 'Task Categories',
      content: 'Filter your tasks by categories like Work, Personal, and more.',
      target: '.nav-item[href="/tasks"]',
      placement: 'top'
    },
    {
      title: 'Track Your Progress',
      content: 'View your stats and achievements to stay motivated.',
      target: '.nav-item[href="/stats"]',
      placement: 'top'
    },
    {
      title: 'Customize Your Profile',
      content: 'Change theme colors, toggle dark mode, and update your profile information.',
      target: '.nav-item[href="/profile"]',
      placement: 'top'
    },
    {
      title: 'Add New Tasks',
      content: 'Click the + button to add new tasks to your list.',
      target: '.btn-primary',
      placement: 'left'
    },
    {
      title: 'You\'re All Set!',
      content: 'You\'re ready to start using Plannr. Enjoy staying organized!',
      target: 'body',
      placement: 'bottom'
    }
  ];

  useEffect(() => {
    if (isOpen && currentStep < tourSteps.length) {
      const selector = tourSteps[currentStep].target;
      const element = selector === 'body' 
        ? document.body 
        : document.querySelector(selector) as HTMLElement;
      
      setTargetElement(element);
    }
  }, [currentStep, isOpen, tourSteps]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isOpen || !targetElement) return null;

  const step = tourSteps[currentStep];
  const rect = targetElement.getBoundingClientRect();
  
  // Calculate tooltip position based on placement
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 50,
    width: 300
  };
  
  switch (step.placement) {
    case 'top':
      Object.assign(tooltipStyle, {
        top: Math.max(10, rect.top - 10 - 120),
        left: Math.max(10, Math.min(window.innerWidth - 310, rect.left + rect.width / 2 - 150))
      });
      break;
    case 'bottom':
      Object.assign(tooltipStyle, {
        top: Math.min(window.innerHeight - 130, rect.bottom + 10),
        left: Math.max(10, Math.min(window.innerWidth - 310, rect.left + rect.width / 2 - 150))
      });
      break;
    case 'left':
      Object.assign(tooltipStyle, {
        top: Math.max(10, Math.min(window.innerHeight - 130, rect.top + rect.height / 2 - 60)),
        left: Math.max(10, rect.left - 10 - 300)
      });
      break;
    case 'right':
      Object.assign(tooltipStyle, {
        top: Math.max(10, Math.min(window.innerHeight - 130, rect.top + rect.height / 2 - 60)),
        left: Math.min(window.innerWidth - 310, rect.right + 10)
      });
      break;
  }

  return (
    <div className="guided-tour">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleSkip}
      />
      
      {/* Highlight target element */}
      <div 
        className="absolute z-50 rounded-md"
        style={{
          position: 'absolute',
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 0, 0, 0.5)',
          borderRadius: '4px',
          pointerEvents: 'none',
        }}
      />
      
      {/* Tooltip */}
      <AnimatePresence>
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{step.title}</h3>
            <button 
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">{step.content}</p>
          
          <div className="flex justify-between items-center">
            <div>
              <button 
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Skip tour
              </button>
            </div>
            <div className="flex space-x-2">
              {currentStep > 0 && (
                <button 
                  onClick={handlePrev}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <FiArrowLeft size={16} />
                </button>
              )}
              <button 
                onClick={handleNext}
                className="flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'} 
                {currentStep < tourSteps.length - 1 && <FiArrowRight className="ml-1" size={16} />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-center mt-3">
            <div className="flex space-x-1">
              {tourSteps.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep 
                      ? 'bg-primary' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  style={index === currentStep ? { backgroundColor: 'var(--color-primary)' } : {}}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GuidedTour; 