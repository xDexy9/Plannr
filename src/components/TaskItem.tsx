import React from 'react';
import { FiCheck, FiClock, FiTag, FiFlag, FiCalendar, FiTrash2 } from 'react-icons/fi';
import { Task, TaskCategory } from '../contexts/TaskContext';
import { useTask } from '../contexts/TaskContext';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { completeTask, deleteTask } = useTask();
  
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

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    completeTask(task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  const getDayName = (dayNumber: number) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[dayNumber - 1];
  };

  return (
    <motion.div 
      className={`card p-4 mb-3 rounded-lg ${task.completed ? 'opacity-70' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <div className="flex items-start">
        <motion.button
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
            task.completed 
              ? 'bg-primary border-primary text-white' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onClick={handleComplete}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          {task.completed && <FiCheck size={14} />}
        </motion.button>
        
        <div className="flex-grow">
          <h3 className={`font-medium text-gray-900 dark:text-white ${task.completed ? 'line-through' : ''}`}>
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
              whileHover={{ scale: 1.05 }}
            >
              <FiCalendar className="mr-1" size={12} />
              {formatDate(task.dueDate)}
            </motion.span>
            
            <motion.span 
              className={`inline-flex items-center px-2 py-1 rounded-full mr-2 mb-1 ${getCategoryColor(task.category)}`}
              whileHover={{ scale: 1.05 }}
            >
              <FiTag className="mr-1" size={12} />
              {task.category}
            </motion.span>
            
            {task.importance && (
              <motion.span 
                className={`inline-flex items-center px-2 py-1 rounded-full mr-2 mb-1 ${getImportanceColor(task.importance)}`}
                whileHover={{ scale: 1.05 }}
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
                    whileHover={{ scale: 1.05 }}
                  >
                    <FiClock className="mr-1" size={10} />
                    {getDayName(day)}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-2">
            <motion.button
              className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md flex items-center"
              onClick={handleDelete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiTrash2 size={12} className="mr-1" />
              Delete
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem; 