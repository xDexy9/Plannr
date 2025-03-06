import React, { useState, useEffect } from 'react';
import { FiClock, FiTag, FiFlag, FiCalendar, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Task, TaskCategory } from '../contexts/TaskContext';
import { useTask } from '../contexts/TaskContext';
import { motion } from 'framer-motion';
import TaskDaysModal from './TaskDaysModal';
import EditTaskModal from './EditTaskModal';

interface TaskTemplateItemProps {
  task: Task;
}

const TaskTemplateItem: React.FC<TaskTemplateItemProps> = ({ task }) => {
  const { addTask, deleteTask } = useTask();
  const [isDaysModalOpen, setIsDaysModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Determine if any modal is open
  const isModalOpen = isDaysModalOpen || isEditModalOpen;
  
  // Emit custom event when modal state changes
  useEffect(() => {
    const event = new CustomEvent('modalStateChange', { 
      detail: { isOpen: isModalOpen } 
    });
    window.dispatchEvent(event);
  }, [isModalOpen]);
  
  const getCategoryColor = (category: TaskCategory) => {
    switch (category) {
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

  const getImportanceColor = (importance?: string) => {
    switch (importance) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDayName = (dayNumber: number) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[dayNumber - 1];
  };

  const handleAddToSchedule = () => {
    setIsDaysModalOpen(true);
  };

  const handleDaysSelected = (selectedDays: number[]) => {
    // Update the task with the selected days
    addTask({
      ...task,
      days: selectedDays,
      dueDate: new Date().toISOString().split('T')[0], // Set to today's date
      completed: false
    });
    setIsDaysModalOpen(false);
  };

  const handleDeleteTask = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  const handleCloseDaysModal = () => {
    setIsDaysModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <motion.div 
      className={`card p-4 mb-3 rounded-lg ${isModalOpen ? 'pointer-events-none' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isModalOpen ? 1 : undefined // Prevent scale animation when modal is open
      }}
      exit={{ opacity: 0, x: -10 }}
      whileHover={isModalOpen ? {} : { scale: 1.02 }} // Disable hover when modal is open
      transition={{ duration: 0.2 }}
      layout
    >
      <div className="flex items-start">
        <div className="flex-grow">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center mt-2 text-xs">
            <motion.span 
              className="inline-flex items-center text-gray-500 dark:text-gray-400 mr-2 mb-1"
              whileHover={isModalOpen ? {} : { scale: 1.05 }}
            >
              <FiCalendar className="mr-1" size={12} />
              {formatDate(task.dueDate)}
            </motion.span>
            
            <motion.span 
              className={`inline-flex items-center px-2 py-1 rounded-full mr-2 mb-1 ${getCategoryColor(task.category)}`}
              whileHover={isModalOpen ? {} : { scale: 1.05 }}
            >
              <FiTag className="mr-1" size={12} />
              {task.category}
            </motion.span>
            
            {task.importance && (
              <motion.span 
                className={`inline-flex items-center px-2 py-1 rounded-full mr-2 mb-1 ${getImportanceColor(task.importance)}`}
                whileHover={isModalOpen ? {} : { scale: 1.05 }}
              >
                <FiFlag className="mr-1" size={12} />
                {task.importance.charAt(0).toUpperCase() + task.importance.slice(1)}
              </motion.span>
            )}

            {task.days && task.days.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                {task.days.map((day) => (
                  <motion.span 
                    key={day}
                    className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs"
                    whileHover={isModalOpen ? {} : { scale: 1.05 }}
                  >
                    <FiClock className="mr-1" size={10} />
                    {getDayName(day)}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex mt-3 space-x-2">
            <motion.button
              className="px-3 py-1 text-xs bg-primary-light dark:bg-primary-dark text-white rounded-md flex items-center opacity-93"
              onClick={handleAddToSchedule}
              whileHover={isModalOpen ? {} : { scale: 1.05 }}
              whileTap={isModalOpen ? {} : { scale: 0.95 }}
              disabled={isModalOpen}
            >
              <FiPlus size={12} className="mr-1" />
              Add to Schedule
            </motion.button>
            
            <motion.button
              className="px-3 py-1 text-xs bg-sky-400 dark:bg-sky-500 text-white rounded-md flex items-center opacity-93"
              onClick={() => setIsEditModalOpen(true)}
              whileHover={isModalOpen ? {} : { scale: 1.05 }}
              whileTap={isModalOpen ? {} : { scale: 0.95 }}
              disabled={isModalOpen}
            >
              <FiEdit size={12} className="mr-1" />
              Edit
            </motion.button>
            
            <motion.button
              className="px-3 py-1 text-xs bg-red-500 dark:bg-red-600 text-white rounded-md flex items-center opacity-93"
              onClick={handleDeleteTask}
              whileHover={isModalOpen ? {} : { scale: 1.05 }}
              whileTap={isModalOpen ? {} : { scale: 0.95 }}
              disabled={isModalOpen}
            >
              <FiTrash2 size={12} className="mr-1" />
              Delete
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Render modals outside the motion.div to prevent interaction issues */}
      {isDaysModalOpen && (
        <TaskDaysModal 
          onSelect={handleDaysSelected}
          onClose={handleCloseDaysModal}
          initialDays={task.days || []}
        />
      )}
      
      {isEditModalOpen && (
        <EditTaskModal 
          task={task}
          onClose={handleCloseEditModal}
        />
      )}
    </motion.div>
  );
};

export default TaskTemplateItem; 