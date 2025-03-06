import React, { useState, useContext, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiAward, FiTrendingUp, FiTarget, FiCalendar, FiBarChart2, FiClock, FiCheckCircle, FiPieChart, FiActivity, FiClipboard, FiCheckSquare, FiSun, FiMoon, FiZap, FiCoffee, FiSmile, FiHelpCircle, FiSunrise, FiSunset, FiInfo, FiChevronRight, FiLock, FiUnlock, FiStar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, TaskCategory } from '../contexts/TaskContext';
import { useTask } from '../contexts/TaskContext';

const Stats: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useTask();
  
  if (!user) return null;
  
  // Calculate progress percentages
  const streakProgress = Math.min(user.streak / 7 * 100, 100); // 7 days streak = 100%
  const tasksProgress = user.tasksCompleted % 5 / 5 * 100; // Progress to next achievement
  
  // Calculate next achievement threshold
  const getNextAchievementThreshold = () => {
    const base = 5;
    const current = user.achievements;
    return base * Math.pow(2, current);
  };
  
  const nextAchievement = getNextAchievementThreshold();
  const achievementProgress = (user.tasksCompleted % nextAchievement) / nextAchievement * 100;
  
  // Helper function to create circular progress
  const CircularProgress = ({ 
    percentage, 
    size = 160, 
    strokeWidth = 8, 
    color = 'var(--color-primary-light)',
    darkColor = 'var(--color-primary-dark)',
    icon,
    label,
    value,
    delay = 0,
  }: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    darkColor?: string;
    icon: React.ReactNode;
    label: string;
    value: string | number;
    delay?: number;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const dash = (percentage * circumference) / 100;
    
    return (
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        <div className="relative" style={{ width: size, height: size }}>
          {/* Background circle */}
          <svg width={size} height={size} className="rotate-[-90deg]">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-gray-100 dark:text-gray-800"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              className="text-primary-light dark:text-primary-dark"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - dash }}
              transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeOut" }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div 
              className="text-3xl text-primary-light dark:text-primary-dark mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.4, type: "spring" }}
            >
              {icon}
            </motion.div>
            <motion.div 
              className="text-2xl font-bold bg-gradient-to-r from-primary-light to-blue-500 dark:from-primary-dark dark:to-blue-400 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.6 }}
            >
              {value}
            </motion.div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-lg font-medium">{label}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-2">
              <motion.div 
                className="h-1.5 rounded-full bg-primary-light dark:bg-primary-dark"
                style={{ width: `${percentage}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: delay + 0.8 }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Helper function for stat cards
  const StatCard = ({
    icon,
    title,
    value,
    description,
    delay = 0
  }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    description: string;
    delay?: number;
  }) => (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start">
        <div className="p-2 rounded-lg bg-primary-light/10 dark:bg-primary-dark/20 text-primary-light dark:text-primary-dark">
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
      </div>
    </motion.div>
  );
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stats & Insights</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Track your productivity and task completion patterns
        </p>
      </motion.div>
      
      {/* User Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* User Level */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm flex items-center">
          <div className="bg-primary-light/10 dark:bg-primary-dark/20 p-3 rounded-lg mr-4">
            <FiAward className="text-primary-light dark:text-primary-dark" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Level</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.achievements || 0}</p>
          </div>
        </div>
        
        {/* Tasks Completed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm flex items-center">
          <div className="bg-green-500/10 dark:bg-green-500/20 p-3 rounded-lg mr-4">
            <FiCheckCircle className="text-green-500" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Completed</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.tasksCompleted || 0}</p>
          </div>
        </div>
        
        {/* Current Streak */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm flex items-center">
          <div className="bg-amber-500/10 dark:bg-amber-500/20 p-3 rounded-lg mr-4">
            <FiZap className="text-amber-500" size={24} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.streak || 0} days</p>
          </div>
        </div>
      </motion.div>
      
      {/* Leveling System */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-10"
      >
        <LevelingSystem />
      </motion.div>
      
      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Progress Overview</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          {/* Weekly Activity Heatmap */}
          <WeeklyActivityHeatmap />
          
          {/* Task Completion Rate */}
          <TaskCompletionRate />
          
          {/* Productivity Timeline */}
          <ProductivityTimeline />
          
          {/* Category Distribution */}
          <CategoryDistribution />
        </div>
      </motion.div>
      
      {/* Productivity Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Productivity Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Productivity Pattern Analysis */}
          <ProductivityPatterns />
        </div>
      </motion.div>
    </div>
  );
};

const WeeklyActivityHeatmap = () => {
  const { tasks } = useTask();
  
  // Calculate activity levels based on completed tasks in the last week
  const activityData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    // Initialize activity data for each day
    const activityByDay = days.map(day => ({
      day,
      count: 0,
      level: 'low' as 'low' | 'medium' | 'high'
    }));
    
    // Count completed tasks for each day in the last week
    tasks.forEach((task: Task) => {
      if (task.completed && task.completedAt) {
        const completionDate = new Date(task.completedAt);
        
        // Only count tasks completed in the last week
        if (completionDate >= oneWeekAgo && completionDate <= today) {
          // Get day of week (0 = Sunday, 1 = Monday, etc.)
          let dayIndex = completionDate.getDay() - 1;
          if (dayIndex < 0) dayIndex = 6; // Convert Sunday (0) to index 6
          
          // Increment count for this day
          activityByDay[dayIndex].count += 1;
        }
      }
    });
    
    // Determine activity level based on count
    const maxCount = Math.max(...activityByDay.map(d => d.count));
    
    activityByDay.forEach(day => {
      if (maxCount === 0) {
        day.level = 'low';
      } else if (day.count === 0) {
        day.level = 'low';
      } else if (day.count < maxCount / 2) {
        day.level = 'medium';
      } else {
        day.level = 'high';
      }
    });
    
    // Find most active day
    const mostActiveDay = activityByDay.reduce(
      (max, day) => (day.count > max.count ? day : max),
      { day: '', count: 0, level: 'low' as 'low' | 'medium' | 'high' }
    );
    
    return {
      days: activityByDay,
      mostActiveDay: mostActiveDay.count > 0 ? mostActiveDay : null
    };
  }, [tasks]);
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Weekly Activity</h3>
        <FiCalendar className="text-blue-500" size={20} />
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {activityData.days.map((day) => (
          <div key={day.day} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-md flex items-center justify-center mb-1 transition-all duration-300 ${
                day.level === 'low' 
                  ? 'bg-blue-100 dark:bg-blue-900/20' 
                  : day.level === 'medium'
                    ? 'bg-blue-300 dark:bg-blue-700' 
                    : 'bg-blue-500 dark:bg-blue-500'
              }`}
            >
              <span className={`text-xs font-medium ${
                day.level === 'low' 
                  ? 'text-blue-800 dark:text-blue-300' 
                  : 'text-white'
              }`}>
                {day.count}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{day.day}</span>
          </div>
        ))}
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {activityData.mostActiveDay ? (
          <>Most active: <span className="font-medium">{activityData.mostActiveDay.day}</span> ({activityData.mostActiveDay.count} tasks)</>
        ) : (
          <>No activity recorded in the past week</>
        )}
      </div>
    </motion.div>
  );
};

const TaskCompletionRate = () => {
  const { tasks } = useTask();
  
  // Calculate completion rate based on real task data
  const completionData = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task: Task) => task.completed).length;
    const inProgressTasks = totalTasks - completedTasks;
    
    // Calculate completion percentage
    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;
    
    return {
      completionRate,
      completedTasks,
      inProgressTasks,
      totalTasks
    };
  }, [tasks]);
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Task Completion</h3>
        <FiCheckCircle className="text-green-500" size={20} />
      </div>
      
      <div className="flex flex-col items-center">
        {/* Gauge Chart */}
        <div className="relative w-40 h-20 mx-auto mb-4">
          {/* Background Arc */}
          <svg className="w-full h-full" viewBox="0 0 100 50">
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="10"
              strokeLinecap="round"
              className="dark:stroke-gray-700"
            />
            
            {/* Progress Arc */}
            <motion.path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#10B981"
              strokeWidth="10"
              strokeLinecap="round"
              className="dark:stroke-green-500"
              strokeDasharray="126"
              initial={{ strokeDashoffset: 126 }}
              animate={{ 
                strokeDashoffset: 126 - (126 * completionData.completionRate / 100) 
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            
            {/* Percentage Text */}
            <text
              x="50"
              y="45"
              textAnchor="middle"
              fontSize="18"
              fontWeight="bold"
              fill="#111827"
              className="dark:fill-white"
            >
              {completionData.completionRate}%
            </text>
          </svg>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full mt-2">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            <p className="text-xl font-bold text-green-500">{completionData.completedTasks}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
            <p className="text-xl font-bold text-blue-500">{completionData.inProgressTasks}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Add a type definition for the productivity data
interface ProductivityData {
  hasEnoughData: boolean;
  daysRemaining?: number;
  previewData?: {
    morningPercentage: number;
    afternoonPercentage: number;
    eveningPercentage: number;
    productivityType: string;
    description: string;
  };
  type?: string;
  description?: string;
  icon?: React.ReactNode;
  timeDistribution?: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
}

const ProductivityPatterns: React.FC = () => {
  const { tasks } = useTask();
  
  const productivityData = useMemo<ProductivityData>(() => {
    // Filter completed tasks that have completedAt timestamp
    const completedTasks = tasks.filter((task: Task) => task.completed && task.completedAt);
    
    // Check if we have enough data (at least 5 completed tasks with timestamps)
    const hasEnoughData = completedTasks.length >= 5;
    
    // Calculate days remaining until we have enough data
    // Assuming user completes about 1 task per day on average
    const daysRemaining = Math.max(5 - completedTasks.length, 0);
    
    if (!hasEnoughData) {
      return {
        hasEnoughData: false,
        daysRemaining,
        // Default preview data
        previewData: {
          morningPercentage: 35,
          afternoonPercentage: 45,
          eveningPercentage: 20,
          productivityType: "Steady Performer",
          description: "You tend to get more done in the afternoon. A midday break might help maintain your momentum."
        }
      };
    }
    
    // Count tasks completed in different time periods
    let morning = 0; // 5:00 AM - 11:59 AM
    let afternoon = 0; // 12:00 PM - 5:59 PM
    let evening = 0; // 6:00 PM - 11:59 PM
    let night = 0; // 12:00 AM - 4:59 AM
    
    completedTasks.forEach((task: Task) => {
      const completionTime = new Date(task.completedAt!);
      const hours = completionTime.getHours();
      
      if (hours >= 5 && hours < 12) {
        morning++;
      } else if (hours >= 12 && hours < 18) {
        afternoon++;
      } else if (hours >= 18 && hours < 24) {
        evening++;
      } else {
        night++;
      }
    });
    
    const total = completedTasks.length;
    const morningPercent = Math.round((morning / total) * 100);
    const afternoonPercent = Math.round((afternoon / total) * 100);
    const eveningPercent = Math.round((evening / total) * 100);
    const nightPercent = Math.round((night / total) * 100);
    
    // Determine productivity type based on highest percentage
    const max = Math.max(morningPercent, afternoonPercent, eveningPercent, nightPercent);
    
    let type, description, icon;
    
    if (morningPercent === max) {
      type = 'Early Bird';
      description = `You complete ${morningPercent}% of your tasks in the morning. Your productivity peaks early in the day, making it ideal for tackling challenging tasks when your energy is highest.`;
      icon = <FiSunrise className="text-amber-500" size={24} />;
    } else if (afternoonPercent === max) {
      type = 'Steady Worker';
      description = `You complete ${afternoonPercent}% of your tasks in the afternoon. You maintain consistent productivity through the middle of the day, making it your most effective work period.`;
      icon = <FiSun className="text-yellow-500" size={24} />;
    } else if (eveningPercent === max) {
      type = 'Evening Achiever';
      description = `You complete ${eveningPercent}% of your tasks in the evening. You gain momentum as the day progresses, reaching peak productivity during later hours.`;
      icon = <FiSunset className="text-orange-500" size={24} />;
    } else {
      type = 'Night Owl';
      description = `You complete ${nightPercent}% of your tasks at night. Your creative energy flows best during quiet night hours when distractions are minimal.`;
      icon = <FiMoon className="text-indigo-400" size={24} />;
    }
    
    return {
      hasEnoughData: true,
      type,
      description,
      icon,
      timeDistribution: {
        morning: morningPercent,
        afternoon: afternoonPercent,
        evening: eveningPercent,
        night: nightPercent
      }
    };
  }, [tasks]);

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {productivityData.hasEnoughData ? (
        // Full version with real data
        <>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Your Productivity Pattern</h3>
            {productivityData.icon}
          </div>
          
          <div className="mb-6">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{productivityData.type}</p>
            <p className="text-gray-600 dark:text-gray-300">{productivityData.description}</p>
          </div>
          
          {/* Time of day productivity distribution */}
          <div className="space-y-5">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Time of Day Productivity</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Based on task completion times</span>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {/* Morning */}
              <div className="relative">
                <div className="flex items-center mb-1">
                  <FiSunrise className="text-amber-500 mr-1.5" size={16} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Morning</span>
                </div>
                <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-amber-500 dark:bg-amber-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${productivityData.timeDistribution!.morning}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">{productivityData.timeDistribution!.morning}%</div>
              </div>
              
              {/* Afternoon */}
              <div className="relative">
                <div className="flex items-center mb-1">
                  <FiSun className="text-yellow-500 mr-1.5" size={16} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Afternoon</span>
                </div>
                <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-yellow-500 dark:bg-yellow-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${productivityData.timeDistribution!.afternoon}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">{productivityData.timeDistribution!.afternoon}%</div>
              </div>
              
              {/* Evening */}
              <div className="relative">
                <div className="flex items-center mb-1">
                  <FiSunset className="text-orange-500 mr-1.5" size={16} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Evening</span>
                </div>
                <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-orange-500 dark:bg-orange-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${productivityData.timeDistribution!.evening}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">{productivityData.timeDistribution!.evening}%</div>
              </div>
              
              {/* Night */}
              <div className="relative">
                <div className="flex items-center mb-1">
                  <FiMoon className="text-indigo-500 mr-1.5" size={16} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Night</span>
                </div>
                <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${productivityData.timeDistribution!.night}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">{productivityData.timeDistribution!.night}%</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-light/10 dark:bg-primary-dark/20 flex items-center justify-center mr-3">
                <FiZap className="text-primary-light dark:text-primary-dark" size={18} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Pro tip:</span> Schedule your most important tasks during your peak productivity hours.
              </p>
            </div>
          </div>
        </>
      ) : (
        // Preview version with countdown
        <div className="relative">
          {/* Overlay with countdown */}
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-xl">
            <div className="text-center px-6 py-8">
              <motion.div 
                className="w-16 h-16 rounded-full bg-primary-light/10 dark:bg-primary-dark/20 flex items-center justify-center mx-auto mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FiClock className="text-primary-light dark:text-primary-dark" size={28} />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Collecting Data</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Complete {productivityData.daysRemaining} more {productivityData.daysRemaining === 1 ? 'task' : 'tasks'} to unlock your personalized productivity insights.
              </p>
              <div className="inline-block bg-primary-light/10 dark:bg-primary-dark/20 text-primary-light dark:text-primary-dark px-4 py-2 rounded-full text-sm font-medium">
                {productivityData.daysRemaining} {productivityData.daysRemaining === 1 ? 'task' : 'tasks'} remaining
              </div>
            </div>
          </div>
          
          {/* Grayed out preview */}
          <div className="opacity-30">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Your Productivity Pattern</h3>
              <FiSun className="text-yellow-500" size={24} />
            </div>
            
            <div className="mb-6">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Steady Performer</p>
              <p className="text-gray-600 dark:text-gray-300">You tend to get more done in the afternoon. A midday break might help maintain your momentum.</p>
            </div>
            
            {/* Time of day productivity distribution */}
            <div className="space-y-5">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Time of Day Productivity</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Based on task completion times</span>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {/* Morning */}
                <div className="relative">
                  <div className="flex items-center mb-1">
                    <FiSunrise className="text-amber-500 mr-1.5" size={16} />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Morning</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 dark:bg-amber-400 rounded-full w-[35%]" />
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">35%</div>
                </div>
                
                {/* Afternoon */}
                <div className="relative">
                  <div className="flex items-center mb-1">
                    <FiSun className="text-yellow-500 mr-1.5" size={16} />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Afternoon</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 dark:bg-yellow-400 rounded-full w-[45%]" />
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">45%</div>
                </div>
                
                {/* Evening */}
                <div className="relative">
                  <div className="flex items-center mb-1">
                    <FiSunset className="text-orange-500 mr-1.5" size={16} />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Evening</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 dark:bg-orange-400 rounded-full w-[20%]" />
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">20%</div>
                </div>
                
                {/* Night */}
                <div className="relative">
                  <div className="flex items-center mb-1">
                    <FiMoon className="text-indigo-500 mr-1.5" size={16} />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Night</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full w-[0%]" />
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">0%</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-light/10 dark:bg-primary-dark/20 flex items-center justify-center mr-3">
                  <FiZap className="text-primary-light dark:text-primary-dark" size={18} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Pro tip:</span> Schedule your most important tasks during your peak productivity hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const ProductivityTimeline = () => {
  const { tasks } = useTask();
  
  // Calculate task completion counts for the past 7 days
  const timelineData = useMemo(() => {
    const days = [];
    const taskCounts = [];
    const today = new Date();
    
    // Generate the last 7 days (including today)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Format as short day name
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      days.push(dayName);
      
      // Count tasks completed on this day
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const count = tasks.filter((task: Task) => {
        if (task.completed && task.completedAt) {
          const completionDate = new Date(task.completedAt);
          return completionDate >= dayStart && completionDate <= dayEnd;
        }
        return false;
      }).length;
      
      taskCounts.push(count);
    }
    
    // Calculate statistics
    const totalTasks = taskCounts.reduce((sum, count) => sum + count, 0);
    const avgTasks = totalTasks > 0 ? Math.round((totalTasks / 7) * 10) / 10 : 0;
    const peakTasks = Math.max(...taskCounts);
    
    return {
      days,
      taskCounts,
      avgTasks,
      peakTasks
    };
  }, [tasks]);
  
  // Find the maximum task count for scaling
  const maxCount = Math.max(...timelineData.taskCounts, 4); // Minimum of 4 for scale
  
  // Generate points for the SVG path
  const points = timelineData.taskCounts.map((count, index) => {
    // Calculate x position (spread evenly across the width)
    const x = 10 + (index * 80 / 6);
    
    // Calculate y position (inverted, since SVG y increases downward)
    const y = 50 - ((count / maxCount) * 40);
    
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Productivity Timeline</h3>
        <FiActivity className="text-purple-500" size={20} />
      </div>
      
      <div className="mt-2 relative h-[180px]">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-between text-xs text-gray-400">
          <span>{maxCount}</span>
          <span>{Math.round(maxCount / 2)}</span>
          <span>0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-6 h-full">
          {/* Line chart */}
          <svg className="w-full h-[120px]" viewBox="0 0 90 50" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="10" y1="10" x2="90" y2="10" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="2" className="dark:stroke-gray-700" />
            <line x1="10" y1="30" x2="90" y2="30" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="2" className="dark:stroke-gray-700" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="#E5E7EB" strokeWidth="0.5" className="dark:stroke-gray-700" />
            
            {/* Line path */}
            <motion.path
              d={`M ${points}`}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="dark:stroke-purple-400"
            />
            
            {/* Data points */}
            {timelineData.taskCounts.map((count, index) => {
              const x = 10 + (index * 80 / 6);
              const y = 50 - ((count / maxCount) * 40);
              
              return (
                <motion.circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#8B5CF6"
                  className="dark:fill-purple-400"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 + (index * 0.1) }}
                />
              );
            })}
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            {timelineData.days.map((day, index) => (
              <span key={index}>{day}</span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Daily Average</p>
          <p className="text-xl font-bold text-purple-500">{timelineData.avgTasks}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Peak Day</p>
          <p className="text-xl font-bold text-purple-500">{timelineData.peakTasks}</p>
        </div>
      </div>
    </motion.div>
  );
};

const CategoryDistribution = () => {
  const { tasks } = useTask();
  
  // Calculate category distribution based on real task data
  const categoryData = useMemo(() => {
    // Count tasks by category
    const categoryCounts: Record<TaskCategory, number> = {
      'Personal': 0,
      'Work': 0,
      'Home': 0,
      'Friends': 0,
      'Family': 0
    };
    
    // Count all tasks (not just completed ones)
    tasks.forEach((task: Task) => {
      if (categoryCounts[task.category] !== undefined) {
        categoryCounts[task.category]++;
      }
    });
    
    // Calculate percentages and prepare data for display
    const totalTasks = tasks.length;
    const categories = Object.entries(categoryCounts)
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending
    
    // Find most frequent category
    const mostFrequent = categories.length > 0 ? categories[0] : null;
    
    return {
      categories,
      mostFrequent,
      totalTasks
    };
  }, [tasks]);
  
  // Color mapping for categories
  const categoryColors: Record<string, string> = {
    'Personal': 'bg-blue-500 dark:bg-blue-600',
    'Work': 'bg-purple-500 dark:bg-purple-600',
    'Home': 'bg-green-500 dark:bg-green-600',
    'Friends': 'bg-amber-500 dark:bg-amber-600',
    'Family': 'bg-red-500 dark:bg-red-600'
  };
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Category Distribution</h3>
        <FiPieChart className="text-amber-500" size={20} />
      </div>
      
      <div className="space-y-4">
        {categoryData.categories.map((item, index) => (
          <div key={item.category} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">{item.category}</span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">{item.percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${categoryColors[item.category] || 'bg-gray-500'} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 1, delay: 0.3 + (index * 0.1) }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {categoryData.mostFrequent && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Most frequent: <span className="font-medium text-gray-800 dark:text-white">{categoryData.mostFrequent.category}</span>
          </p>
        </div>
      )}
    </motion.div>
  );
};

// Add this new component for the leveling system
const LevelingSystem: React.FC = () => {
  const { user } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  
  // Calculate user's current level and progress
  const currentLevel = user?.achievements || 0;
  const nextLevel = currentLevel + 1;
  
  // Calculate tasks needed for next level using exponential formula
  const tasksForCurrentLevel = currentLevel > 0 ? 5 * Math.pow(2, currentLevel - 1) : 0;
  const tasksForNextLevel = 5 * Math.pow(2, currentLevel);
  const tasksCompleted = user?.tasksCompleted || 0;
  
  // Calculate progress percentage to next level
  const progressToNextLevel = Math.min(
    Math.max(
      ((tasksCompleted - tasksForCurrentLevel) / (tasksForNextLevel - tasksForCurrentLevel)) * 100,
      0
    ),
    100
  );
  
  // Define rewards for each level
  const levelRewards = [
    { level: 1, name: "Beginner Badge", description: "You've started your productivity journey", icon: "🔰" },
    { level: 2, name: "Focus Master", description: "Unlock custom focus timers", icon: "⏱️" },
    { level: 3, name: "Task Tactician", description: "Unlock advanced task templates", icon: "📋" },
    { level: 4, name: "Streak Keeper", description: "Bonus points for maintaining streaks", icon: "🔥" },
    { level: 5, name: "Productivity Pro", description: "Unlock detailed analytics", icon: "📊" },
    { level: 6, name: "Time Wizard", description: "Unlock time prediction features", icon: "🧙" },
    { level: 7, name: "Goal Crusher", description: "Set and track long-term goals", icon: "🏆" },
    { level: 8, name: "Habit Hero", description: "Advanced habit tracking features", icon: "⭐" },
    { level: 9, name: "Master Planner", description: "Unlock priority matrix", icon: "🧠" },
    { level: 10, name: "Productivity Legend", description: "Unlock all premium features", icon: "👑" }
  ];
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">Leveling System</h3>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="w-8 h-8 rounded-full bg-primary-light/10 dark:bg-primary-dark/20 flex items-center justify-center text-primary-light dark:text-primary-dark transition-transform hover:scale-110"
          aria-label="Learn about the leveling system"
        >
          <FiInfo size={18} />
        </button>
      </div>
      
      {/* Level Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            className="mb-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start mb-3">
              <div className="w-8 h-8 rounded-full bg-primary-light/10 dark:bg-primary-dark/20 flex items-center justify-center mr-3 flex-shrink-0">
                <FiAward className="text-primary-light dark:text-primary-dark" size={16} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">How Leveling Works</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Complete tasks to earn experience and level up. Each level unlocks new features and rewards!
                </p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p><span className="font-medium">Level 1:</span> Complete 5 tasks</p>
              <p><span className="font-medium">Level 2:</span> Complete 10 tasks</p>
              <p><span className="font-medium">Level 3:</span> Complete 20 tasks</p>
              <p><span className="font-medium">Level 4:</span> Complete 40 tasks</p>
              <p><span className="font-medium">Level 5+:</span> Each level requires twice as many tasks as the previous</p>
            </div>
            
            <button 
              onClick={() => setShowInfo(false)}
              className="mt-4 text-sm font-medium text-primary-light dark:text-primary-dark flex items-center"
            >
              Got it <FiChevronRight size={16} className="ml-1" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Current Level Display */}
      <div className="flex items-center mb-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary-light/10 dark:bg-primary-dark/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-light dark:text-primary-dark">{currentLevel}</span>
          </div>
          {/* Animated particles around the level */}
          <motion.div 
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FiStar className="text-amber-500" size={12} />
          </motion.div>
        </div>
        
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Level {currentLevel}: {currentLevel > 0 ? levelRewards[currentLevel - 1]?.name : "Getting Started"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round(progressToNextLevel)}% to Level {nextLevel}
            </span>
          </div>
          
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary-light to-blue-500 dark:from-primary-dark dark:to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {tasksCompleted - tasksForCurrentLevel} / {tasksForNextLevel - tasksForCurrentLevel} tasks to next level
          </div>
        </div>
      </div>
      
      {/* Level Rewards */}
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Level Rewards</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {levelRewards.slice(0, 4).map((reward) => {
            const isUnlocked = currentLevel >= reward.level;
            
            return (
              <motion.div 
                key={reward.level}
                className={`flex items-center p-3 rounded-lg border ${
                  isUnlocked 
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                }`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mr-3 text-xl">{reward.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      isUnlocked 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {reward.name}
                    </span>
                    {isUnlocked ? (
                      <FiUnlock size={12} className="ml-2 text-green-500" />
                    ) : (
                      <FiLock size={12} className="ml-2 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <p className={`text-xs ${
                    isUnlocked 
                      ? 'text-gray-600 dark:text-gray-300' 
                      : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    {isUnlocked ? reward.description : `Reach Level ${reward.level} to unlock`}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <motion.button 
          className="w-full mt-3 text-sm text-center text-primary-light dark:text-primary-dark font-medium py-2 hover:bg-primary-light/5 dark:hover:bg-primary-dark/10 rounded-lg transition-colors"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.2 }}
          onClick={() => setShowInfo(true)}
        >
          View all rewards
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Stats; 