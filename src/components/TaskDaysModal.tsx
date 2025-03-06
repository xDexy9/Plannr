import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiCheck, FiInfo } from 'react-icons/fi';

interface TaskDaysModalProps {
  onSelect: (days: number[]) => void;
  onClose: () => void;
  initialDays?: number[];
}

const TaskDaysModal: React.FC<TaskDaysModalProps> = ({ onSelect, onClose, initialDays = [] }) => {
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [selectedDays, setSelectedDays] = useState<number[]>(initialDays);
  const hasInitialDays = initialDays.length > 0;
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside modal - only close if it's a direct click on the backdrop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if clicking directly on the backdrop (not on any child elements)
      if (event.target instanceof Element && 
          event.target.classList.contains('modal-backdrop')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter(d => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  const handleSubmit = () => {
    onSelect(selectedDays);
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300 
      }
    },
    exit: { 
      opacity: 0, 
      y: 30, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 modal-backdrop"
      style={{ pointerEvents: 'all' }}
    >
      <motion.div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ pointerEvents: 'auto', position: 'relative' }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">On which days?</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">Select the days when you want to work on this task:</p>
          
          {hasInitialDays && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg text-blue-800 dark:text-blue-200 text-sm flex items-start">
              <FiInfo size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>
                This task is already scheduled for {initialDays.length} day{initialDays.length !== 1 ? 's' : ''}. 
                Your selection will update the existing schedule.
              </span>
            </div>
          )}
          
          <div className="flex justify-center space-x-3 mb-6">
            {weekdays.map((day, index) => {
              const dayNumber = index + 1;
              const isSelected = selectedDays.includes(dayNumber);
              
              return (
                <motion.button
                  key={day}
                  onClick={() => toggleDay(dayNumber)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center relative ${
                    isSelected
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {day}
                  {isSelected && (
                    <motion.div 
                      className="absolute -top-1 -right-1 bg-white dark:bg-gray-800 rounded-full w-5 h-5 flex items-center justify-center border-2 border-green-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <FiCheck size={12} className="text-green-500" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
          
          <div className="flex justify-end space-x-3">
            <motion.button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={selectedDays.length === 0}
            >
              Confirm
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDaysModal; 