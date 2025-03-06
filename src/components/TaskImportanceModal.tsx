import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export type TaskImportance = 'low' | 'medium' | 'high';

interface TaskImportanceModalProps {
  onSelect: (importance: TaskImportance) => void;
  onClose: () => void;
}

const TaskImportanceModal: React.FC<TaskImportanceModalProps> = ({ onSelect, onClose }) => {
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">How important is this task?</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <motion.button
            onClick={() => onSelect('low')}
            className="w-full p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 flex items-center justify-between"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-medium">Low Priority</span>
            <span className="text-sm">Can be done later</span>
          </motion.button>
          
          <motion.button
            onClick={() => onSelect('medium')}
            className="w-full p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 flex items-center justify-between"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-medium">Medium Priority</span>
            <span className="text-sm">Should be done soon</span>
          </motion.button>
          
          <motion.button
            onClick={() => onSelect('high')}
            className="w-full p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 flex items-center justify-between"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-medium">High Priority</span>
            <span className="text-sm">Must be done ASAP</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskImportanceModal; 