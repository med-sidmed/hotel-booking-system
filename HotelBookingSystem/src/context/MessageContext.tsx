import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Message, Conversation } from '../types';
import { useAuth } from './AuthContext';
import { mockMessages, mockConversations } from '../data/mockData';

interface MessageContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (receiverId: string | number, content: string, hotelId?: string | number) => Promise<void>;
  getMessages: (conversationId: string) => Message[];
  unreadTotal: number;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  // Initial mock data
  useEffect(() => {
    if (!user) return;
    // We already initialized with mockConversations/mockMessages
  }, [user]);

  const sendMessage = async (receiverId: string | number, content: string, hotelId?: string | number) => {
    if (!user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      receiverId,
      conversationId: activeConversation?.id || `conv-${Date.now()}`,
      content,
      timestamp: new Date().toISOString(),
      read: true
    };

    setMessages(prev => [...prev, newMessage]);

    // Update or create conversation
    setConversations(prev => {
      const existing = prev.find(c => c.id === newMessage.conversationId);
      if (existing) {
        return prev.map(c => c.id === existing.id ? { ...c, lastMessage: newMessage } : c);
      }
      return [{
        id: newMessage.conversationId,
        participants: [
          { id: user.id, name: user.name, role: user.role, avatar: user.avatar },
          { id: receiverId, name: 'Correspondant', role: 'USER' } // Simplified
        ],
        unreadCount: 0,
        lastMessage: newMessage,
        hotelId
      }, ...prev];
    });

    // Simulate owner reply after 2 seconds
    if (user.role === 'USER') {
      setTimeout(() => {
        const reply: Message = {
          id: `msg-${Date.now() + 1}`,
          senderId: receiverId,
          senderName: 'Hôtelier Luxotel',
          receiverId: user.id,
          conversationId: newMessage.conversationId,
          content: 'Merci pour votre message. Un de nos agents reviendra vers vous très bientôt.',
          timestamp: new Date().toISOString(),
          read: false
        };
        setMessages(prev => [...prev, reply]);
        setConversations(prev => prev.map(c => 
          c.id === reply.conversationId ? { ...c, lastMessage: reply, unreadCount: c.unreadCount + 1 } : c
        ));
      }, 3000);
    }
  };

  const getMessages = (conversationId: string) => {
    return messages.filter(m => m.conversationId === conversationId);
  };

  const unreadTotal = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  return (
    <MessageContext.Provider value={{
      conversations,
      activeConversation,
      setActiveConversation,
      sendMessage,
      getMessages,
      unreadTotal
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}
