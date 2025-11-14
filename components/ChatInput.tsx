
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ChatMode } from '../types';
import { SendIcon } from './icons/SendIcon';

interface ChatInputProps {
  onSendMessage: (prompt: string) => void;
  isProcessing: boolean;
  mode: ChatMode;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isProcessing, mode }) => {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const placeholderText = mode === ChatMode.Text 
    ? 'Ask anything...' 
    : 'Describe the image you want to create...';

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);
  
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (prompt.trim() && !isProcessing) {
      onSendMessage(prompt.trim());
      setPrompt('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholderText}
        disabled={isProcessing}
        rows={1}
        className="w-full p-4 pr-14 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none resize-none transition-all duration-200 disabled:opacity-50"
        style={{ maxHeight: '200px' }}
      />
      <button
        type="submit"
        disabled={isProcessing || !prompt.trim()}
        className="absolute right-3 bottom-3 p-2.5 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed enabled:bg-light-accent enabled:text-white enabled:hover:bg-blue-600 dark:enabled:bg-dark-accent dark:enabled:hover:bg-blue-500 active:enabled:scale-95"
      >
        <SendIcon className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatInput;