import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiList, FiUser, FiBarChart2, FiSettings } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import GuidedTour from './GuidedTour';
import { useTour } from '../contexts/TourContext';

const Layout: React.FC = () => {
  const { mode } = useTheme();
  const location = useLocation();
  const { isTourOpen, endTour } = useTour();

  const navItems = [
    { path: '/plannr', icon: <FiHome size={24} />, label: 'Home' },
    { path: '/tasks', icon: <FiList size={24} />, label: 'Tasks' },
    { path: '/stats', icon: <FiBarChart2 size={24} />, label: 'Stats' },
    { path: '/profile', icon: <FiUser size={24} />, label: 'Profile' },
    { path: '/settings', icon: <FiSettings size={24} />, label: 'Settings' },
  ];

  return (
    <div className={`container-app min-h-screen flex flex-col ${mode}`}>
      {/* Main content */}
      <main className="flex-grow p-4 pb-20 md:pb-4 md:pl-20">
        <Outlet />
      </main>

      {/* Mobile bottom navigation */}
      <nav className="mobile-nav fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden">
        <ul className="flex justify-around">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-item flex flex-col items-center py-2 px-3 ${
                    isActive ? 'active text-primary dark:text-primary' : 'text-gray-500 dark:text-gray-400'
                  }`
                }
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop sidebar navigation */}
      <nav className="desktop-nav fixed left-0 top-0 bottom-0 w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block">
        <ul className="flex flex-col items-center py-4">
          {navItems.map((item) => (
            <li key={item.path} className="mb-4">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-item flex flex-col items-center p-2 rounded-lg ${
                    isActive ? 'active bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary' : 'text-gray-500 dark:text-gray-400'
                  }`
                }
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Guided Tour */}
      <GuidedTour isOpen={isTourOpen} onComplete={endTour} />
    </div>
  );
};

export default Layout; 