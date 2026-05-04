import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { Header } from '../components/Header';
import { ChatWindow } from '../components/ChatWindow';
import { InputBox } from '../components/InputBox';
import { Sidebar, MobileSidebar } from '../components/Sidebar';
import { detectMode } from '../services/aiEngine';

export default function ChatApp() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const {
    chats,
    activeChatId,
    messages,
    isTyping,
    sendMessage,
    clearChat,
    switchChat,
    newChat,
    deleteChat,
    renameChat,
  } = useChat(user?.username);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
  const currentMode = lastUserMessage ? detectMode(lastUserMessage.content) : 'chat';

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const handleSwitchChat = (id) => {
    switchChat(id);
    setMobileSidebarOpen(false);
  };

  const sidebarContent = (
    <Sidebar
      chats={chats}
      activeChatId={activeChatId}
      onSwitch={handleSwitchChat}
      onNew={() => { newChat(); setMobileSidebarOpen(false); }}
      onDelete={deleteChat}
      onRename={renameChat}
      user={user}
    />
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden" data-testid="chat-app">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        {sidebarContent}
      </div>

      {/* Mobile sidebar */}
      <MobileSidebar open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)}>
        {sidebarContent}
      </MobileSidebar>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header
          user={user}
          onLogout={handleLogout}
          currentMode={currentMode}
          onMenuToggle={() => setMobileSidebarOpen(o => !o)}
          mobileSidebarOpen={mobileSidebarOpen}
          activeTitle={activeChatId ? chats[activeChatId]?.title : undefined}
        />

        <ChatWindow messages={messages} isTyping={isTyping} />

        <InputBox
          onSend={sendMessage}
          onClear={clearChat}
          disabled={isTyping}
        />
      </div>
    </div>
  );
}
