import { useLocation } from 'wouter';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { Header } from '../components/Header';
import { ChatWindow } from '../components/ChatWindow';
import { InputBox } from '../components/InputBox';
import { detectMode } from '../services/aiEngine';

export default function ChatApp() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { messages, isTyping, sendMessage, clearChat } = useChat(user?.username);

  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
  const currentMode = lastUserMessage ? detectMode(lastUserMessage.content) : 'chat';

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-background" data-testid="chat-app">
      <Header user={user} onLogout={handleLogout} currentMode={currentMode} />

      <ChatWindow messages={messages} isTyping={isTyping} />

      <InputBox
        onSend={sendMessage}
        onClear={clearChat}
        disabled={isTyping}
      />
    </div>
  );
}
