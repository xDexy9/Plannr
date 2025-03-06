import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { useTask, Task, TaskCategory } from '../contexts/TaskContext';
import TaskImportanceModal, { TaskImportance } from './TaskImportanceModal';
import TaskDaysModal from './TaskDaysModal';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose }) => {
  const { updateTask } = useTask();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [category, setCategory] = useState<TaskCategory>(task.category);
  const [importance, setImportance] = useState<TaskImportance>(task.importance as TaskImportance || 'medium');
  const [days, setDays] = useState<number[]>(task.days || []);
  const [error, setError] = useState('');
  const [isImportanceModalOpen, setIsImportanceModalOpen] = useState(false);
  const [isDaysModalOpen, setIsDaysModalOpen] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // Focus the title input when the modal opens
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);
  
  // Handle click outside to close the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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
    
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }
    
    updateTask(task.id, {
      title,
      description,
      category,
      importance,
      days
    });
    
    onClose();
  };
  
  const handleImportanceSelect = (selectedImportance: TaskImportance) => {
    setImportance(selectedImportance);
    setIsImportanceModalOpen(false);
  };
  
  const handleDaysSelect = (selectedDays: number[]) => {
    setDays(selectedDays);
    setIsDaysModalOpen(false);
  };
  
  const categories: TaskCategory[] = ['Personal', 'Work', 'Home', 'Friends', 'Family'];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">Edit Task Template</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded flex items-center">
              <FiAlertCircle className="mr-2" />
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Task Title
            </label>
            <input
              ref={titleInputRef}
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter task title"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-md text-sm ${
                    category === cat
                      ? 'bg-primary-light dark:bg-primary-dark text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Importance
            </label>
            <button
              type="button"
              onClick={() => setIsImportanceModalOpen(true)}
              className="w-full p-2 border rounded flex justify-between items-center dark:bg-gray-700 dark:border-gray-600"
            >
              <span>
                {importance === 'low' ? 'Low Priority' : 
                 importance === 'medium' ? 'Medium Priority' : 
                 'High Priority'}
              </span>
              <span className="text-gray-500">
                {importance === 'low' ? '!' : 
                 importance === 'medium' ? '!!' : 
                 '!!!'}
              </span>
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Schedule Days
            </label>
            <button
              type="button"
              onClick={() => setIsDaysModalOpen(true)}
              className="w-full p-2 border rounded flex justify-between items-center dark:bg-gray-700 dark:border-gray-600"
            >
              <span>
                {days.length === 0 
                  ? 'Select days' 
                  : `${days.length} day${days.length > 1 ? 's' : ''} selected`}
              </span>
              <span className="text-gray-500">
                {days.length > 0 ? days.map(day => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day]).join(', ') : 'None'}
              </span>
            </button>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      
      {isImportanceModalOpen && (
        <TaskImportanceModal
          onSelect={handleImportanceSelect}
          onClose={() => setIsImportanceModalOpen(false)}
        />
      )}
      
      {isDaysModalOpen && (
        <TaskDaysModal
          onSelect={handleDaysSelect}
          onClose={() => setIsDaysModalOpen(false)}
          initialDays={days}
        />
      )}
    </div>
  );
};

export default EditTaskModal; 