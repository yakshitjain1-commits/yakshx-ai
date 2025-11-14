import React, { useEffect, useRef } from 'react';
import { Conversation, ChatMode } from '../types';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import { YakshxIcon } from './icons/YakshxIcon';

interface ChatViewProps {
  conversation: Conversation | null;
  onSendMessage: (prompt: string) => void;
  isProcessing: boolean;
  chatMode: ChatMode;
}

const WelcomeScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <YakshxIcon className="w-20 h-20 mb-4 text-light-accent dark:text-dark-accent"/>
    <h1 className="text-4xl font-bold mb-2">YAKSHx AI</h1>
    <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">The Mind of All AIs in One. How can I help you today?</p>
  </div>
);

const ChatView: React.FC<ChatViewProps> = ({ 
  conversation, 
  onSendMessage, 
  isProcessing, 
  chatMode,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const renderMainContent = () => {
    if (conversation && conversation.messages.length > 0) {
        return (
            <div className="space-y-6">
                {conversation.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>
        );
    }
    return <WelcomeScreen />;
  };

  return (
    <div className="flex-1 flex flex-col h-full max-h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {renderMainContent()}
        </div>
      </div>
      <div className="w-full bg-light-bg dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <ChatInput 
            onSendMessage={onSendMessage} 
            isProcessing={isProcessing} 
            mode={chatMode}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatView;