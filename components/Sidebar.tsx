
import React, { useContext } from 'react';
import { Conversation, ChatMode } from '../types';
import { ThemeContext } from '../App';
import { YakshxIcon } from './icons/YakshxIcon';
import { PlusIcon } from './icons/PlusIcon';
import ThemeSwitcher from './ThemeSwitcher';
import ModeSwitcher from './ModeSwitcher';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onConversationSelect: (id: string) => void;
  chatMode: ChatMode;
  onChatModeChange: (mode: ChatMode) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onNewChat,
  onConversationSelect,
  chatMode,
  onChatModeChange,
  isOpen,
  setIsOpen,
}) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`absolute lg:relative flex flex-col h-full w-64 bg-light-sidebar dark:bg-dark-sidebar shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center gap-2">
            <YakshxIcon className="w-8 h-8"/>
            <h1 className="text-xl font-bold">YAKSHx AI</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 rounded-full hover:bg-light-bg dark:hover:bg-dark-bg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-between px-4 py-2 text-left rounded-lg transition-colors duration-200 bg-light-accent text-white hover:bg-blue-600 dark:bg-dark-accent dark:hover:bg-blue-500"
          >
            New Chat
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          <h2 className="px-4 text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">History</h2>
          {conversations.map((convo) => (
            <a
              key={convo.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onConversationSelect(convo.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 rounded-lg truncate transition-colors duration-200 ${
                activeConversationId === convo.id
                  ? 'bg-light-bg dark:bg-dark-bg font-semibold'
                  : 'hover:bg-light-bg dark:hover:bg-dark-bg'
              }`}
            >
              {convo.title}
            </a>
          ))}
        </nav>
        
        <div className="p-4 border-t border-light-border dark:border-dark-border space-y-4">
          <ModeSwitcher 
            mode={chatMode} 
            setMode={onChatModeChange} 
          />
          <ThemeSwitcher 
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
