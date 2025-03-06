import React, { useState, useRef } from 'react';
import { FiMoon, FiSun, FiLogOut, FiAward, FiCalendar, FiCheckCircle, FiFlag, FiHelpCircle, FiEdit, FiDownload, FiSettings } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTour } from '../contexts/TourContext';

type ThemeColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'blue' | 'purple' | 'teal' | 'orange' | 'cyan' | 'lime' | 'hotpink' | 'custom';

const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { mode, toggleMode, themeColor, setThemeColor, customColorHex, setCustomColorHex } = useTheme();
  const { startTour } = useTour();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [city, setCity] = useState(user?.location?.city || '');
  const [country, setCountry] = useState(user?.location?.country || '');
  const [isEditing, setIsEditing] = useState(false);
  const colorPickerRef = useRef<HTMLInputElement>(null);
  
  const themeColors: ThemeColor[] = ['indigo', 'emerald', 'rose', 'amber', 'blue', 'purple', 'teal', 'orange', 'cyan', 'lime', 'hotpink', 'custom'];
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const handleSaveProfile = () => {
    updateProfile({
      fullName,
      location: {
        city,
        country
      }
    });
    setIsEditing(false);
  };
  
  const toggleWorkday = (day: number) => {
    if (!user) return;
    
    const updatedWorkdays = user.workweekDays.includes(day)
      ? user.workweekDays.filter(d => d !== day)
      : [...user.workweekDays, day];
    
    updateProfile({
      workweekDays: updatedWorkdays
    });
  };
  
  const getCountryFlag = (countryName: string) => {
    // This is a simplified version - in a real app, you'd use a proper country code lookup
    const countryMap: Record<string, string> = {
      'USA': '🇺🇸',
      'UK': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Japan': '🇯🇵',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
    };
    
    return countryMap[countryName] || '🌍';
  };
  
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${month}·${year}`;
  };
  
  if (!user) return null;
  
  return (
    <div className="pb-16 md:pb-0">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="card md:col-span-2">
          <div className="flex flex-col items-center mb-6">
            {/* Redesigned Avatar */}
            <div className="relative mb-6 group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-light to-primary-dark rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary-light to-primary-dark text-white flex items-center justify-center text-4xl font-bold shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <FiEdit className="text-white text-xl" />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 z-10"></div>
            </div>
            
            {!isEditing && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">{user.fullName || user.username}</h2>
                {user.location && (
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    <span className="text-lg text-gray-600 dark:text-gray-400">
                      {getCountryFlag(user.location.country)}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {user.location.city}, {user.location.country}
                    </p>
                  </div>
                )}
                <div className="mt-4 inline-block relative">
                  <button 
                    className="px-6 py-2 bg-gradient-to-r from-primary-light to-primary-dark text-white rounded-full text-sm font-medium hover:shadow-md transition-all transform hover:scale-105"
                    onClick={() => setIsEditing(true)} 
                  >
                    Customize Profile
                  </button>
                  <div className="absolute -bottom-1 left-1/2 w-24 h-1 bg-gradient-to-r from-primary-light/30 to-primary-dark/30 rounded-full transform -translate-x-1/2"></div>
                </div>
              </div>
            )}
         
            {isEditing && (
              <div className="w-full max-w-md mt-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter your city"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Enter your country"
                  />
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <div className="flex-1 relative inline-block text-center">
                    <button 
                      className="w-full py-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 text-white font-medium hover:shadow-md transition-all transform hover:scale-105"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <div className="absolute -bottom-1 left-1/2 w-24 h-1 bg-gradient-to-r from-gray-400/30 to-gray-500/30 rounded-full transform -translate-x-1/2"></div>
                  </div>
                  <div className="flex-1 relative inline-block text-center">
                    <button 
                      className="w-full py-2 rounded-full bg-gradient-to-r from-primary-light to-primary-dark text-white font-medium hover:shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
                      onClick={handleSaveProfile}
                      disabled={!fullName || !city || !country}
                    >
                      Save Changes
                    </button>
                    <div className="absolute -bottom-1 left-1/2 w-24 h-1 bg-gradient-to-r from-primary-light/30 to-primary-dark/30 rounded-full transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Redesigned Statistics Section */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-light/10 to-primary-dark/10 dark:from-primary-light/5 dark:to-primary-dark/5 rounded-xl"></div>
            
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-gray-200 dark:divide-gray-700 rounded-xl overflow-hidden">
              {/* Streak */}
              <div className="p-6 flex flex-col items-center justify-center text-center transition-all hover:bg-white/50 dark:hover:bg-gray-800/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center mb-3 shadow-lg transform transition-transform hover:scale-110 mx-auto">
                  <FiFlag className="text-white text-xl" />
                </div>
                <div className="text-center w-full">
                  <div className="relative inline-block">
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-red-500">{user.streak}</span>
                    <div className="absolute -bottom-1 left-1/2 w-24 h-1 bg-gradient-to-r from-amber-500/30 to-red-500/30 rounded-full transform -translate-x-1/2"></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-2">Day Streak</div>
                </div>
              </div>
              
              {/* Achievements */}
              <div className="p-6 flex flex-col items-center justify-center text-center transition-all hover:bg-white/50 dark:hover:bg-gray-800/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center mb-3 shadow-lg transform transition-transform hover:scale-110 mx-auto">
                  <FiAward className="text-white text-xl" />
                </div>
                <div className="text-center w-full">
                  <div className="relative inline-block">
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">{user.achievements}</span>
                    <div className="absolute -bottom-1 left-1/2 w-24 h-1 bg-gradient-to-r from-blue-500/30 to-indigo-600/30 rounded-full transform -translate-x-1/2"></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-2">Achievements</div>
                </div>
              </div>
              
              {/* Member Since */}
              <div className="p-6 flex flex-col items-center justify-center text-center transition-all hover:bg-white/50 dark:hover:bg-gray-800/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center mb-3 shadow-lg transform transition-transform hover:scale-110 mx-auto">
                  <FiCalendar className="text-white text-xl" />
                </div>
                <div className="text-center w-full">
                  <div className="relative inline-block">
                    <span className="text-3xl font-bold font-mono tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-green-600">
                      {formatJoinDate(user.joinDate)}
                    </span>
                    <div className="absolute -bottom-1 left-1/2 w-24 h-1 bg-gradient-to-r from-emerald-500/30 to-green-600/30 rounded-full transform -translate-x-1/2"></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-2">Member Since</div>
                </div>
              </div>
              
              {/* Tasks Completed */}
              <div className="p-6 flex flex-col items-center justify-center text-center transition-all hover:bg-white/50 dark:hover:bg-gray-800/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center mb-3 shadow-lg transform transition-transform hover:scale-110 mx-auto">
                  <FiCheckCircle className="text-white text-xl" />
                </div>
                <div className="text-center w-full">
                  <div className="relative inline-block">
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600">{user.tasksCompleted}</span>
                    <div className="absolute -bottom-1 left-1/2 w-24 h-1 bg-gradient-to-r from-rose-500/30 to-pink-600/30 rounded-full transform -translate-x-1/2"></div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-2">Tasks Completed</div>
                </div>
              </div>
            </div>
            
            {/* Achievement Progress */}
            {user.tasksCompleted > 0 && (
              <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Next Achievement Progress</h3>
                  <span className="text-xs text-primary-light dark:text-primary-dark font-medium">
                    Level {user.achievements + 1}
                  </span>
                </div>
                
                {/* Calculate next achievement threshold */}
                {(() => {
                  const nextThreshold = 5 * Math.pow(2, user.achievements);
                  const progress = Math.min(100, (user.tasksCompleted / nextThreshold) * 100);
                  
                  return (
                    <>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary-light dark:bg-primary-dark h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.tasksCompleted} tasks
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {nextThreshold} tasks
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
        
        {/* Settings */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6">Preferences</h2>
          
          {/* Theme Mode Toggle */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Theme Mode</span>
              <button 
                onClick={toggleMode}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-1 dark:focus:ring-primary-dark"
                style={{ backgroundColor: mode === 'dark' ? 'var(--color-primary-dark)' : '#D1D5DB' }}
              >
                <span
                  className={`${
                    mode === 'dark' ? 'translate-x-6 bg-gray-800' : 'translate-x-1 bg-white'
                  } inline-block h-4 w-4 transform rounded-full transition-transform`}
                />
                <span className="absolute inset-0 flex items-center justify-start pl-1.5">
                  {mode === 'dark' && <FiMoon className="text-white text-xs" />}
                </span>
                <span className="absolute inset-0 flex items-center justify-end pr-1.5">
                  {mode === 'light' && <FiSun className="text-gray-600 text-xs" />}
                </span>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mode === 'light' ? 'Switch to dark mode to reduce eye strain at night' : 'Switch to light mode for a brighter interface'}
            </p>
          </div>
          
          {/* Theme Color */}
          <div className="mb-8">
            <h3 className="font-medium mb-3">Theme Color</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {themeColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    if (color === 'custom') {
                      colorPickerRef.current?.click();
                    } else {
                      setThemeColor(color);
                    }
                  }}
                  className={`relative w-full aspect-square rounded-full transition-transform hover:scale-110 ${
                    themeColor === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600 scale-110' : ''
                  }`}
                  style={{ 
                    backgroundColor: 
                      color === 'indigo' ? '#4f46e5' : 
                      color === 'emerald' ? '#10b981' : 
                      color === 'rose' ? '#e11d48' : 
                      color === 'amber' ? '#d97706' : 
                      color === 'blue' ? '#2563eb' :
                      color === 'purple' ? '#a855f7' : 
                      color === 'teal' ? '#14b8a6' : 
                      color === 'orange' ? '#f97316' : 
                      color === 'cyan' ? '#06b6d4' : 
                      color === 'lime' ? '#84cc16' : 
                      color === 'hotpink' ? '#ff4081' :
                      customColorHex
                  }}
                >
                  {themeColor === color && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    </span>
                  )}
                  {color === 'custom' && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <FiEdit className="text-white text-xs" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <input
              ref={colorPickerRef}
              type="color"
              className="hidden"
              value={customColorHex}
              onChange={(e) => {
                setCustomColorHex(e.target.value);
                setThemeColor('custom');
              }}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Personalize your experience with your favorite color
            </p>
          </div>
          
          {/* Workweek Days */}
          <div className="mb-8">
            <h3 className="font-medium mb-3">Workweek Days</h3>
            <div className="flex flex-wrap gap-2">
              {weekdays.map((day, index) => {
                const dayNumber = index + 1;
                const isSelected = user.workweekDays.includes(dayNumber);
                return (
                  <button
                    key={day}
                    onClick={() => toggleWorkday(dayNumber)}
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-primary-light to-primary-dark text-white shadow-md transform scale-110'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="font-medium">{day.charAt(0)}</span>
                    {isSelected && (
                      <span className="absolute -bottom-1 w-4 h-1 bg-white/50 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Select the days you typically work on tasks
            </p>
          </div>
          
          {/* Help & Tour */}
          <div className="pt-6 border-t dark:border-gray-700">
            <h3 className="font-medium mb-4">Actions</h3>
            
            <div className="space-y-3">
              <button 
                onClick={startTour}
                className="w-full py-3 px-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <FiHelpCircle className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium block">App Tour</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Learn how to use Plannr</span>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button 
                onClick={() => {
                  // Create a JSON file with user data
                  const userData = {
                    profile: user,
                    settings: {
                      theme: themeColor,
                      mode: mode,
                      customColor: customColorHex
                    }
                  };
                  
                  const dataStr = JSON.stringify(userData, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                  
                  const exportFileDefaultName = 'plannr-data.json';
                  
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
                className="w-full py-3 px-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3">
                    <FiDownload className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium block">Export Data</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Download your profile and settings</span>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button 
                onClick={logout}
                className="w-full py-3 px-4 flex items-center justify-between bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-xl transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mr-3">
                    <FiLogOut className="text-rose-600 dark:text-rose-400" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium block text-rose-600 dark:text-rose-400">Log Out</span>
                    <span className="text-xs text-rose-500/70 dark:text-rose-400/70">Sign out of your account</span>
                  </div>
                </div>
                <span className="text-rose-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 