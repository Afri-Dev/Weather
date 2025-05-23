import React from 'react';
import { ThemeConfig } from '../../lib/types';

interface HeaderProps {
  themeConfig: ThemeConfig;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ themeConfig, onToggleTheme, onOpenSearch }) => {
  return (
    <header className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-primary" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
          <h1 className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">WeatherVue</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={onOpenSearch}
            className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
            aria-label="Search locations"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <button 
            onClick={onToggleTheme}
            className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
            aria-label={themeConfig.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {themeConfig.mode === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
