import React, { useState, useEffect } from 'react';
import { useTask, TaskCategory, Task } from '../contexts/TaskContext';
import TaskTemplateItem from '../components/TaskTemplateItem';
import { FiPlus, FiFilter, FiBook, FiBriefcase, FiHome, FiUsers, FiHeart, FiUser } from 'react-icons/fi';
import AddTaskModal from '../components/AddTaskModal';

const Tasks: React.FC = () => {
  const { tasks } = useTask();
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'All'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);
  
  // Track when any modal is open to prevent page interactions
  useEffect(() => {
    setIsAnyModalOpen(isAddModalOpen);
    
    // Add event listener to detect when modals are opened from TaskTemplateItem
    const handleModalStateChange = (e: CustomEvent) => {
      setIsAnyModalOpen(e.detail.isOpen);
    };
    
    window.addEventListener('modalStateChange' as any, handleModalStateChange);
    
    return () => {
      window.removeEventListener('modalStateChange' as any, handleModalStateChange);
    };
  }, [isAddModalOpen]);
  
  const categories: (TaskCategory | 'All')[] = ['All', 'Personal', 'Work', 'Home', 'Friends', 'Family'];
  
  // Get the appropriate icon for each category
  const getCategoryIcon = (category: TaskCategory | 'All') => {
    switch(category) {
      case 'All': return <FiFilter className="mr-2" />;
      case 'Personal': return <FiUser className="mr-2" />;
      case 'Work': return <FiBriefcase className="mr-2" />;
      case 'Home': return <FiHome className="mr-2" />;
      case 'Friends': return <FiUsers className="mr-2" />;
      case 'Family': return <FiHeart className="mr-2" />;
      default: return <FiFilter className="mr-2" />;
    }
  };
  
  // Show all tasks regardless of completion status for the task library
  // We're not using getTasksByCategory because it filters out completed tasks
  const filteredTasks = selectedCategory === 'All' 
    ? tasks
    : tasks.filter(task => task.category === selectedCategory);
  
  // Deduplicate tasks based on title and category to prevent duplicates
  const uniqueTasks = filteredTasks.reduce((acc: Task[], current) => {
    const isDuplicate = acc.some(item => 
      item.title === current.title && 
      item.category === current.category
    );
    
    if (!isDuplicate) {
      acc.push(current);
    }
    
    return acc;
  }, []);
  
  return (
    <div className={`pb-16 md:pb-0 ${isAnyModalOpen ? 'pointer-events-none' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Library</h1>
        <button 
          className="btn btn-primary flex items-center"
          onClick={() => setIsAddModalOpen(true)}
          disabled={isAnyModalOpen}
        >
          <FiPlus className="mr-1" /> Create Template
        </button>
      </div>
      
      <div className="card p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          This is your task template library. Browse templates, add them to your schedule, or create new ones.
        </p>
      </div>
      
      {/* Category Filters - Updated with a more professional design */}
      <div className="mb-6 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 p-1 shadow-sm">
        <div className="flex overflow-x-auto hide-scrollbar">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-white dark:bg-gray-700 text-primary-light dark:text-primary-dark shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              disabled={isAnyModalOpen}
            >
              {getCategoryIcon(category)}
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Task List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <FiBook className="mr-2 text-primary-light dark:text-primary-dark" />
            {selectedCategory === 'All' ? 'All Templates' : `${selectedCategory} Templates`}
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {uniqueTasks.length} {uniqueTasks.length === 1 ? 'template' : 'templates'}
          </span>
        </div>
        
        {uniqueTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No task templates found</p>
            <p className="text-sm mt-2">Create a new template to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {uniqueTasks.map(task => (
              <TaskTemplateItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
      
      {/* Add Task Modal - render outside the main content to prevent interaction issues */}
      {isAddModalOpen && (
        <AddTaskModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};

export default Tasks; 