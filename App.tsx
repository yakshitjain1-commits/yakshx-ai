import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Theme, ChatMode, Conversation, Message } from './types';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import { generateTextStream, generateImage } from './services/geminiService';

export const ThemeContext = React.createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: Theme.Light,
  toggleTheme: () => {},
});

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.Dark);
  const [chatMode, setChatMode] = useState<ChatMode>(ChatMode.Text);
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  const [conversationOrder, setConversationOrder] = useState<string[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.Dark : Theme.Light);
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === Theme.Light ? Theme.Dark : Theme.Light));
  }, []);
  
  const handleChatModeChange = (mode: ChatMode) => {
    setChatMode(mode);
  };

  const handleNewChat = useCallback(() => {
    const newId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
    };
    setConversations((prev) => ({ ...prev, [newId]: newConversation }));
    setConversationOrder((prev) => [newId, ...prev]);
    setActiveConversationId(newId);
  }, []);
  
  const setActiveConversation = (id: string) => {
    setActiveConversationId(id);
  }

  const handleSendMessage = useCallback(async (prompt: string) => {
    const isNewConversation = !activeConversationId;
    const conversationId = activeConversationId || `conv-${Date.now()}`;

    const history = (conversations[conversationId]?.messages || []).filter(m => m.type === 'text');
    const userMessage: Message = { id: `msg-${Date.now()}`, role: 'user', content: prompt, type: 'text' };
    const loadingMessage: Message = { id: `msg-${Date.now()}-loading`, role: 'model', content: '', type: 'loading' };
    
    if (isNewConversation) {
      setActiveConversationId(conversationId);
      setConversationOrder(prev => [conversationId, ...prev]);
    }
    
    setConversations(prev => {
        const currentConversation = prev[conversationId] || {
            id: conversationId,
            title: prompt.substring(0, 25),
            messages: [],
            createdAt: new Date(),
        };
        return { 
            ...prev, 
            [conversationId]: {
                ...currentConversation,
                messages: [...currentConversation.messages, userMessage, loadingMessage]
            }
        };
    });
    
    setIsProcessing(true);

    try {
      if (chatMode === ChatMode.Text) {
        const stream = generateTextStream(prompt, history);
        let firstChunk = true;
        let fullResponse = "";

        for await (const chunk of stream) {
          fullResponse += chunk;
          setConversations(prev => {
            const convoToUpdate = { ...prev[conversationId] };
            const messages = [...convoToUpdate.messages];
            const lastMessage = messages[messages.length - 1];

            if (lastMessage) {
              if (firstChunk) {
                messages[messages.length - 1] = { id: loadingMessage.id, role: 'model', content: chunk, type: 'text' };
                firstChunk = false;
              } else {
                messages[messages.length - 1] = { ...lastMessage, content: fullResponse };
              }
            }
            return { ...prev, [conversationId]: { ...convoToUpdate, messages } };
          });
        }
      } else if (chatMode === ChatMode.Image) {
        const imageUrl = await generateImage(prompt);
        const aiMessage: Message = { id: loadingMessage.id, role: 'model', content: imageUrl, type: 'image' };
        setConversations(prev => {
          const convoToUpdate = { ...prev[conversationId] };
          const messages = [...convoToUpdate.messages];
          if (messages.length > 0) messages[messages.length - 1] = aiMessage;
          return { ...prev, [conversationId]: { ...convoToUpdate, messages } };
        });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      const errorMessageContent = 'Sorry, I encountered an error. Please try again.';

      const errorMessage: Message = { id: loadingMessage.id, role: 'model', content: errorMessageContent, type: 'error' };
      setConversations(prev => {
        const convoToUpdate = { ...prev[conversationId] };
        const messages = [...convoToUpdate.messages];
        if (messages.length > 0) messages[messages.length - 1] = errorMessage;
        return { ...prev, [conversationId]: { ...convoToUpdate, messages } };
      });
    } finally {
        setIsProcessing(false);
    }
  }, [activeConversationId, conversations, chatMode]);
  
  const activeConversation = useMemo(() => {
      return activeConversationId ? conversations[activeConversationId] : null;
  }, [activeConversationId, conversations]);

  const sortedConversations = useMemo(() => {
    return conversationOrder.map(id => conversations[id]).filter(Boolean);
  }, [conversationOrder, conversations]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="flex h-screen w-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-sans overflow-hidden">
        <Sidebar
          conversations={sortedConversations}
          activeConversationId={activeConversationId}
          onNewChat={handleNewChat}
          onConversationSelect={setActiveConversation}
          chatMode={chatMode}
          onChatModeChange={handleChatModeChange}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <main className="flex-1 flex flex-col h-screen relative transition-all duration-300">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute top-4 left-4 z-20 lg:hidden p-2 rounded-full bg-light-card dark:bg-dark-card shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <ChatView
            conversation={activeConversation}
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
            chatMode={chatMode}
          />
        </main>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
