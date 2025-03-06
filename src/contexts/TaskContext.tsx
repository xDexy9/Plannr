import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type TaskCategory = 'Personal' | 'Work' | 'Home' | 'Friends' | 'Family';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  category: TaskCategory;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  importance?: 'low' | 'medium' | 'high';
  days?: number[];
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  getTodayTasks: () => Task[];
  getUpcomingTasks: () => Task[];
  getTasksByCategory: (category: TaskCategory) => Task[];
  getTasksForNextDays: (days: number) => Record<string, Task[]>;
  addTaskToToday: (task: Task) => void;
  forceUpdateStreak: (newStreak: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('plannr_tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    
    // Sample tasks
    const sampleTasks: Task[] = [
      // Personal tasks
      {
        id: '1',
        title: 'Morning workout routine',
        description: '30 minutes of cardio and strength training',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Personal',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'high',
        days: [1, 3, 5]
      },
      {
        id: '2',
        title: 'Grocery shopping',
        description: 'Buy fruits, vegetables, and other essentials',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        category: 'Personal',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'medium',
        days: [2, 5]
      },
      {
        id: '3',
        title: 'Read a book',
        description: 'Continue reading "Atomic Habits"',
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        category: 'Personal',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'low',
        days: [1, 2, 3, 4, 5, 6, 7]
      },
      {
        id: '4',
        title: 'Meditation session',
        description: '15 minutes of mindfulness meditation',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Personal',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'medium',
        days: [1, 2, 3, 4, 5, 6, 7]
      },
      
      // Work tasks
      {
        id: '5',
        title: 'Weekly team meeting',
        description: 'Discuss project progress and roadblocks',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        category: 'Work',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'high',
        days: [2]
      },
      {
        id: '6',
        title: 'Complete project proposal',
        description: 'Finalize the budget and timeline',
        dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
        category: 'Work',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'high',
        days: [1, 2, 3, 4, 5]
      },
      {
        id: '7',
        title: 'Review code changes',
        description: 'Check pull requests from the development team',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Work',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'medium',
        days: [1, 3, 5]
      },
      {
        id: '8',
        title: 'Update documentation',
        description: 'Add new features to the user guide',
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        category: 'Work',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'low',
        days: [4]
      },
      
      // Home tasks
      {
        id: '9',
        title: 'Clean the kitchen',
        description: 'Wash dishes and wipe counters',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Home',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'medium',
        days: [1, 4, 7]
      },
      {
        id: '10',
        title: 'Do laundry',
        description: 'Wash, dry, and fold clothes',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        category: 'Home',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'medium',
        days: [6]
      },
      {
        id: '11',
        title: 'Pay utility bills',
        description: 'Electricity, water, and internet',
        dueDate: new Date(Date.now() + 345600000).toISOString().split('T')[0],
        category: 'Home',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'high',
        days: [5]
      },
      {
        id: '12',
        title: 'Organize closet',
        description: 'Sort clothes and donate unused items',
        dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
        category: 'Home',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'low',
        days: [7]
      },
      
      // Friends tasks
      {
        id: '13',
        title: 'Call Sarah',
        description: 'Catch up and plan weekend meetup',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Friends',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'medium',
        days: [3]
      },
      {
        id: '14',
        title: 'Plan birthday party',
        description: 'Organize surprise party for Alex',
        dueDate: new Date(Date.now() + 604800000).toISOString().split('T')[0],
        category: 'Friends',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'high',
        days: [2, 4]
      },
      {
        id: '15',
        title: 'Movie night',
        description: 'Watch new Marvel movie with friends',
        dueDate: new Date(Date.now() + 432000000).toISOString().split('T')[0],
        category: 'Friends',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'low',
        days: [5]
      },
      {
        id: '16',
        title: 'Coffee meetup',
        description: 'Meet with college friends at Starbucks',
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        category: 'Friends',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'medium',
        days: [6]
      },
      
      // Family tasks
      {
        id: '17',
        title: 'Family dinner',
        description: 'Cook special meal for everyone',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        category: 'Family',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'high',
        days: [7]
      },
      {
        id: '18',
        title: 'Help mom with shopping',
        description: 'Drive mom to the mall',
        dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
        category: 'Family',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'medium',
        days: [6]
      },
      {
        id: '19',
        title: 'Call grandparents',
        description: 'Weekly check-in call',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Family',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'high',
        days: [7]
      },
      {
        id: '20',
        title: 'Plan family vacation',
        description: 'Research destinations and accommodations',
        dueDate: new Date(Date.now() + 1209600000).toISOString().split('T')[0],
        category: 'Family',
        completed: false,
        createdAt: new Date().toISOString(),
        importance: 'low',
        days: [1, 3]
      }
    ];
    
    return sampleTasks;
  });

  // Add state to track the last date the streak was updated
  const [lastStreakDate, setLastStreakDate] = useState<string>(() => {
    const saved = localStorage.getItem('plannr_last_streak_date');
    return saved || '';
  });
  
  // Save lastStreakDate to localStorage whenever it changes
  useEffect(() => {
    if (lastStreakDate) {
      localStorage.setItem('plannr_last_streak_date', lastStreakDate);
    }
  }, [lastStreakDate]);

  useEffect(() => {
    localStorage.setItem('plannr_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    // Check if a task with the same title AND category already exists
    const existingTaskIndex = tasks.findIndex(t => 
      t.title === task.title && 
      t.category === task.category
    );
    
    if (existingTaskIndex !== -1) {
      // Update the existing task
      const updatedTasks = [...tasks];
      updatedTasks[existingTaskIndex] = {
        ...updatedTasks[existingTaskIndex],
        ...task,
        // Preserve the original id and createdAt
        id: updatedTasks[existingTaskIndex].id,
        createdAt: updatedTasks[existingTaskIndex].createdAt
      };
      setTasks(updatedTasks);
    } else {
      // Create a new task
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task => 
        task.id === id ? { ...task, ...updatedTask } : task
      );
      localStorage.setItem('plannr_tasks', JSON.stringify(newTasks));
      return newTasks;
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const completeTask = (id: string) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task => 
        task.id === id ? { 
          ...task, 
          completed: true,
          completedAt: new Date().toISOString()
        } : task
      );
      localStorage.setItem('plannr_tasks', JSON.stringify(newTasks));
      return newTasks;
    });
    
    // Update user stats
    if (user) {
      const completedTasks = user.tasksCompleted + 1;
      
      // Calculate achievements using exponential formula
      // Level 1: 5 tasks, Level 2: 10 tasks, Level 3: 20 tasks, Level 4: 40 tasks, etc.
      let achievementLevel = 0;
      let threshold = 5;
      
      while (completedTasks >= threshold) {
        achievementLevel++;
        threshold = 5 * Math.pow(2, achievementLevel);
      }
      
      // Update task completion stats (streak will be updated by the checkAllTasksCompleted effect)
      updateProfile({
        tasksCompleted: completedTasks,
        achievements: achievementLevel
      });
      
      // The streak will be updated by the checkAllTasksCompleted effect
      // which runs whenever tasks change
    }
  };

  const getTodayTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime() && !task.completed;
    });
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() > today.getTime() && !task.completed;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const getTasksByCategory = (category: TaskCategory) => {
    return tasks.filter(task => task.category === category && !task.completed);
  };

  const getTasksForNextDays = (days: number) => {
    const result: Record<string, Task[]> = {};
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);
      
      const dateStr = date.toISOString().split('T')[0];
      
      result[dateStr] = tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === date.getTime() && !task.completed;
      });
    }
    
    return result;
  };

  const addTaskToToday = (task: Task) => {
    // Create a new task based on the template but for today
    const today = new Date().toISOString().split('T')[0];
    
    const newTask: Omit<Task, 'id' | 'createdAt'> = {
      title: task.title,
      description: task.description,
      dueDate: today,
      category: task.category,
      completed: false,
      importance: task.importance,
      days: task.days
    };
    
    addTask(newTask);
  };

  // Add a function to check if the streak should be reset
  const checkAndResetStreak = () => {
    if (!user) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    
    // If lastStreakDate is empty, initialize it to today
    if (!lastStreakDate) {
      setLastStreakDate(todayStr);
      return;
    }
    
    // Check if a day was missed
    const lastDate = new Date(lastStreakDate);
    lastDate.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    // If the last streak date is before yesterday, reset the streak
    if (lastDate.getTime() < yesterday.getTime()) {
      console.log('Streak reset due to missed day', {
        lastStreakDate,
        yesterday: yesterday.toISOString().split('T')[0],
        today: todayStr
      });
      
      updateProfile({
        streak: 0
      });
      
      // Update lastStreakDate to today to prevent multiple resets
      setLastStreakDate(todayStr);
    }
  };
  
  // Check streak on component mount and when user changes
  useEffect(() => {
    if (user) {
      checkAndResetStreak();
    }
  }, [user, lastStreakDate]);

  // Add a function to check if all tasks for today are completed
  const checkAllTasksCompleted = () => {
    if (!user) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    
    const todaysTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });
    
    // If there are no tasks for today, don't update the streak
    if (todaysTasks.length === 0) return;
    
    const allCompleted = todaysTasks.every(task => task.completed);
    
    // If all tasks are completed and we haven't updated the streak today
    if (allCompleted && lastStreakDate !== todayStr) {
      const newStreak = user.streak + 1;
      
      console.log('All tasks completed! Updating streak', {
        previousStreak: user.streak,
        newStreak,
        tasksCount: todaysTasks.length
      });
      
      updateProfile({
        streak: newStreak
      });
      
      setLastStreakDate(todayStr);
    }
  };
  
  // Check if all tasks are completed whenever tasks change
  useEffect(() => {
    if (user) {
      checkAllTasksCompleted();
    }
  }, [tasks, user, lastStreakDate]);

  // Add a function to manually update the streak for testing
  const forceUpdateStreak = (newStreak: number) => {
    if (user) {
      console.log('Manually updating streak', {
        previousStreak: user.streak,
        newStreak
      });
      
      updateProfile({
        streak: newStreak
      });
      
      // Update lastStreakDate to today
      const today = new Date().toISOString().split('T')[0];
      setLastStreakDate(today);
    }
  };

  const contextValue: TaskContextType = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    getTodayTasks,
    getUpcomingTasks,
    getTasksByCategory,
    getTasksForNextDays,
    addTaskToToday,
    forceUpdateStreak
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}; 