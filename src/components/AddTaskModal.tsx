import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiCalendar, FiTag, FiFlag, FiClock, FiAlertCircle } from 'react-icons/fi';
import { useTask, TaskCategory } from '../contexts/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import TaskImportanceModal, { TaskImportance } from './TaskImportanceModal';
import TaskDaysModal from './TaskDaysModal';

interface AddTaskModalProps {
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose }) => {
  const { addTask, tasks } = useTask();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Personal');
  const [importance, setImportance] = useState<TaskImportance | undefined>();
  const [days, setDays] = useState<number[]>([]);
  const [showImportanceModal, setShowImportanceModal] = useState(false);
  const [showDaysModal, setShowDaysModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Check if a task with the same title already exists
  const taskExists = (taskTitle: string) => {
    return tasks.some(t => t.title === taskTitle);
  };

  // Update warning when title changes
  React.useEffect(() => {
    if (title.trim() !== '') {
      setShowWarning(taskExists(title));
    } else {
      setShowWarning(false);
    }
  }, [title, tasks]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    addTask({
      title,
      description,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      category,
      completed: false,
      importance,
      days: days.length > 0 ? days : undefined
    });
    
    onClose();
  };

  const categories: TaskCategory[] = ['Personal', 'Work', 'Home', 'Friends', 'Family'];

  const getCategoryColor = (cat: TaskCategory) => {
    switch (cat) {
      case 'Work':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Personal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Home':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Friends':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Family':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getImportanceColor = (imp?: TaskImportance) => {
    switch (imp) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getImportanceLabel = (imp?: TaskImportance) => {
    switch (imp) {
      case 'low':
        return 'Low Priority';
      case 'medium':
        return 'Medium Priority';
      case 'high':
        return 'High Priority';
      default:
        return 'Set Priority';
    }
  };

  const handleImportanceSelect = (selectedImportance: TaskImportance) => {
    setImportance(selectedImportance);
    setShowImportanceModal(false);
    // Show days modal after selecting importance
    setShowDaysModal(true);
  };

  const handleDaysSelect = (selectedDays: number[]) => {
    setDays(selectedDays);
    setShowDaysModal(false);
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
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
    <>
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Task</h2>
            <motion.button 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX size={20} />
            </motion.button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Title*
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input w-full"
                placeholder="What do you need to do?"
                required
              />
              {showWarning && (
                <div className="mt-2 text-amber-600 dark:text-amber-400 text-sm flex items-center">
                  <FiAlertCircle className="mr-1" size={14} />
                  A task with this title already exists and will be updated.
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input w-full"
                placeholder="Add details about your task"
                rows={3}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input pl-10 w-full"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    type="button"
                    className={`flex items-center px-3 py-2 rounded-full text-sm ${
                      category === cat 
                        ? getCategoryColor(cat) + ' ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-primary' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => setCategory(cat)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiTag className="mr-1" size={14} />
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <motion.button
                type="button"
                className={`flex items-center px-3 py-2 rounded-full text-sm w-full justify-center ${getImportanceColor(importance)}`}
                onClick={() => setShowImportanceModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiFlag className="mr-1" size={14} />
                {getImportanceLabel(importance)}
              </motion.button>
            </div>

            {days.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selected Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].filter((_, i) => 
                    days.includes(i + 1)
                  ).map((day, i) => (
                    <span 
                      key={i} 
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full text-xs flex items-center"
                    >
                      <FiClock className="mr-1" size={12} />
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <motion.button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={onClose}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                style={{ backgroundColor: 'var(--color-primary)' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Add Task
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {showImportanceModal && (
        <TaskImportanceModal 
          onSelect={handleImportanceSelect} 
          onClose={() => setShowImportanceModal(false)} 
        />
      )}

      {showDaysModal && (
        <TaskDaysModal 
          onSelect={handleDaysSelect} 
          onClose={() => setShowDaysModal(false)} 
          initialDays={days}
        />
      )}
    </>
  );
};

export default AddTaskModal; 