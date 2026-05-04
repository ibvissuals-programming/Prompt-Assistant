import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { generateResponse, detectMode } from '../services/aiEngine';

export function useChat(username) {
  const storageKey = `ib_chat_${username}`;
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (username) {
      const saved = storage.get(storageKey) || [];
      setMessages(saved);
    }
  }, [username]);

  const sendMessage = async (text) => {
    const userMsg = { id: Date.now(), role: 'user', content: text, timestamp: new Date().toISOString() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setIsTyping(true);

    // Simulate AI thinking delay (800-1500ms)
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

    const response = generateResponse(text, messages);
    const aiMsg = { id: Date.now() + 1, role: 'assistant', content: response, timestamp: new Date().toISOString(), mode: detectMode(text) };
    const final = [...updated, aiMsg];
    setMessages(final);
    setIsTyping(false);
    storage.set(storageKey, final);
  };

  const clearChat = () => { 
    setMessages([]); 
    storage.remove(storageKey); 
  };

  return { messages, isTyping, sendMessage, clearChat };
}
