
import React from 'react';
import { Theme } from '../types';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface ThemeSwitcherProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, toggleTheme }) => {
  const isDark = theme === Theme.Dark;

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-light-bg dark:bg-dark-bg">
      <span className="font-medium text-sm">Theme</span>
      <button
        onClick={toggleTheme}
        className="relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-accent dark:focus:ring-dark-accent bg-gray-200 dark:bg-gray-700"
      >
        <span
          className={`${
            isDark ? 'translate-x-7' : 'translate-x-1'
          } inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 flex items-center justify-center`}
        >
          {isDark ? <MoonIcon className="w-4 h-4 text-dark-text" /> : <SunIcon className="w-4 h-4 text-light-text" />}
        </span>
      </button>
    </div>
  );
};

export default ThemeSwitcher;
