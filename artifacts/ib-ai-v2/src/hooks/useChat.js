import { useState, useEffect, useCallback } from 'react';
import { getChats, saveChats, setActiveChat, createDefaultChats } from '../utils/storage';
import { generateResponse, detectMode } from '../services/aiEngine';

export function useChat(username) {
  const [chatData, setChatData] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Load or initialize chat data on mount / username change
  useEffect(() => {
    if (!username) return;
    let data = getChats(username);
    if (!data) {
      data = createDefaultChats();
      saveChats(username, data);
    }
    setChatData(data);
  }, [username]);

  const persist = useCallback((data) => {
    saveChats(username, data);
    setChatData({ ...data });
  }, [username]);

  // --- Derived values ---
  const activeChatId = chatData?.activeChatId ?? null;
  const chats = chatData?.chats ?? {};
  const activeChat = activeChatId ? chats[activeChatId] : null;
  const messages = activeChat?.messages ?? [];

  // --- Actions ---
  const switchChat = useCallback((chatId) => {
    if (!chatData || !chatData.chats[chatId]) return;
    const updated = { ...chatData, activeChatId: chatId };
    persist(updated);
  }, [chatData, persist]);

  const newChat = useCallback(() => {
    if (!chatData) return;
    const id = `chat_${Date.now()}`;
    const updated = {
      ...chatData,
      chats: {
        ...chatData.chats,
        [id]: { title: 'New Chat', messages: [], createdAt: Date.now() },
      },
      activeChatId: id,
    };
    persist(updated);
  }, [chatData, persist]);

  const deleteChat = useCallback((chatId) => {
    if (!chatData) return;
    const remaining = { ...chatData.chats };
    delete remaining[chatId];

    let nextActive = chatData.activeChatId;
    if (nextActive === chatId) {
      const ids = Object.keys(remaining).sort((a, b) => (remaining[b].createdAt ?? 0) - (remaining[a].createdAt ?? 0));
      if (ids.length === 0) {
        // Always keep at least one chat
        const newId = `chat_${Date.now()}`;
        remaining[newId] = { title: 'New Chat', messages: [], createdAt: Date.now() };
        nextActive = newId;
      } else {
        nextActive = ids[0];
      }
    }

    persist({ ...chatData, chats: remaining, activeChatId: nextActive });
  }, [chatData, persist]);

  const renameChat = useCallback((chatId, title) => {
    if (!chatData || !chatData.chats[chatId]) return;
    const updated = {
      ...chatData,
      chats: {
        ...chatData.chats,
        [chatId]: { ...chatData.chats[chatId], title: title.trim() || 'New Chat' },
      },
    };
    persist(updated);
  }, [chatData, persist]);

  const sendMessage = useCallback(async (text) => {
    if (!chatData || !activeChatId) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const currentMessages = chatData.chats[activeChatId]?.messages ?? [];
    const updatedMessages = [...currentMessages, userMsg];

    // Auto-title: use first user message (truncated) if chat is still "New Chat"
    const currentTitle = chatData.chats[activeChatId]?.title;
    const autoTitle = currentTitle === 'New Chat'
      ? text.slice(0, 36) + (text.length > 36 ? '...' : '')
      : currentTitle;

    const withUserMsg = {
      ...chatData,
      chats: {
        ...chatData.chats,
        [activeChatId]: {
          ...chatData.chats[activeChatId],
          title: autoTitle,
          messages: updatedMessages,
        },
      },
    };
    persist(withUserMsg);
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

    const response = generateResponse(text, currentMessages);
    const aiMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
      mode: detectMode(text),
    };

    const withAiMsg = {
      ...withUserMsg,
      chats: {
        ...withUserMsg.chats,
        [activeChatId]: {
          ...withUserMsg.chats[activeChatId],
          messages: [...updatedMessages, aiMsg],
        },
      },
    };
    persist(withAiMsg);
    setIsTyping(false);
  }, [chatData, activeChatId, persist]);

  const clearChat = useCallback(() => {
    if (!chatData || !activeChatId) return;
    const updated = {
      ...chatData,
      chats: {
        ...chatData.chats,
        [activeChatId]: { ...chatData.chats[activeChatId], messages: [] },
      },
    };
    persist(updated);
  }, [chatData, activeChatId, persist]);

  return {
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
  };
}
