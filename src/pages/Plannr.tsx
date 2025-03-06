import React, { useEffect } from 'react';
import { useTask } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import { FiCalendar, FiClock, FiAward, FiRefreshCw } from 'react-icons/fi';
import { HiFire } from 'react-icons/hi';
import TaskItem from '../components/TaskItem';

const Plannr: React.FC = () => {
  const { getTodayTasks, getUpcomingTasks, getTasksForNextDays, forceUpdateStreak } = useTask();
  const { user } = useAuth();
  
  const todayTasks = getTodayTasks();
  const upcomingTasks = getUpcomingTasks();
  const nextThreeDays = getTasksForNextDays(3);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };
  
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };
  
  // Get the next three days for the overview table
  const getNextThreeDays = () => {
    const today = new Date();
    const result = [];
    
    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      result.push(date.toISOString().split('T')[0]);
    }
    
    return result;
  };
  
  const nextDays = getNextThreeDays();
  
  // Add a function to handle streak reset for testing
  const handleResetStreak = () => {
    forceUpdateStreak(0);
  };
  
  // Add a function to increment streak for testing
  const handleIncrementStreak = () => {
    if (user) {
      forceUpdateStreak(user.streak + 1);
    }
  };
  
  return (
    <div className="pb-16 md:pb-0">
      <h1 className="text-2xl font-bold mb-6">Plannr</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Today's Tasks */}
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FiCalendar className="mr-2 text-primary-light dark:text-primary-dark" />
                Today's Tasks
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {todayTasks.length} {todayTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
            
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No tasks for today</p>
                <p className="text-sm mt-2">Enjoy your day!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
          
          {/* Upcoming Tasks */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FiClock className="mr-2 text-primary-light dark:text-primary-dark" />
                Upcoming Tasks
              </h2>
            </div>
            
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No upcoming tasks</p>
                <p className="text-sm mt-2">Your schedule is clear!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.slice(0, 5).map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
                
                {upcomingTasks.length > 5 && (
                  <div className="text-center pt-2 text-sm text-primary-light dark:text-primary-dark">
                    +{upcomingTasks.length - 5} more tasks
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Streak Counter */}
          {user && (
            <div className="card bg-gradient-to-r from-primary-light/10 to-primary-dark/10 dark:from-primary-light/20 dark:to-primary-dark/20">
              <h2 className="text-xl font-semibold mb-4">Streak Counter</h2>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 bg-primary-light dark:bg-primary-dark rounded-full mr-4 flex items-center justify-center" style={{ width: '56px', height: '56px' }}>
                    <HiFire className="text-white" size={36} />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-5xl font-bold text-primary-light dark:text-primary-dark mr-2">{user.streak}</span>
                      <span className="text-xl text-gray-600 dark:text-gray-400">days</span>
                    </div>
                    <p className="text-base text-gray-600 dark:text-gray-400 mt-2">completing all tasks</p>
                  </div>
                </div>
                
                {user.streak >= 7 && (
                  <div>
                    <div className="flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full">
                      <FiAward className="mr-1" />
                      <span className="text-sm font-medium">Streak Master!</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Add testing controls */}
              <div className="mt-4 flex justify-end space-x-2">
                <button 
                  onClick={handleResetStreak}
                  className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded flex items-center"
                >
                  <FiRefreshCw className="mr-1" size={12} />
                  Reset
                </button>
                <button 
                  onClick={handleIncrementStreak}
                  className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded flex items-center"
                >
                  <HiFire className="mr-1" size={12} />
                  +1
                </button>
              </div>
            </div>
          )}
          
          {/* 3-Day Overview */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">3-Day Overview</h2>
            
            <div className="space-y-4">
              {nextDays.map(day => (
                <div key={day} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{getDayName(day)}</h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {nextThreeDays[day]?.length || 0} tasks
                    </span>
                  </div>
                  
                  {nextThreeDays[day] && nextThreeDays[day].length > 0 ? (
                    <div className="space-y-2">
                      {nextThreeDays[day].slice(0, 2).map(task => (
                        <div 
                          key={task.id} 
                          className="text-sm p-2 bg-gray-100 dark:bg-gray-700 rounded"
                        >
                          {task.title}
                        </div>
                      ))}
                      
                      {nextThreeDays[day].length > 2 && (
                        <div className="text-xs text-center text-primary-light dark:text-primary-dark">
                          +{nextThreeDays[day].length - 2} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      No tasks scheduled
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plannr; 