
import React from 'react';
import { ChatMode } from '../types';
import { TextIcon } from './icons/TextIcon';
import { ImageIcon } from './icons/ImageIcon';

interface ModeSwitcherProps {
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ mode, setMode }) => {
  return (
    <div className="flex w-full rounded-lg bg-light-bg dark:bg-dark-bg p-1">
      <button
        onClick={() => setMode(ChatMode.Text)}
        className={`w-1/2 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
          mode === ChatMode.Text ? 'bg-white dark:bg-dark-card shadow' : 'text-light-text-secondary dark:text-dark-text-secondary'
        }`}
      >
        <TextIcon className="w-5 h-5" />
        Text
      </button>
      <button
        onClick={() => setMode(ChatMode.Image)}
        className={`w-1/2 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
          mode === ChatMode.Image ? 'bg-white dark:bg-dark-card shadow' : 'text-light-text-secondary dark:text-dark-text-secondary'
        }`}
      >
        <ImageIcon className="w-5 h-5" />
        Image
      </button>
    </div>
  );
};

export default ModeSwitcher;