import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Message, Conversation } from '../types';
import { useAuth } from './AuthContext';
import { messageService } from '../api/message.service';
import toast from 'react-hot-toast';

interface MessageContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (receiverId: string | number, content: string, hotelId?: string | number) => Promise<void>;
  getMessages: (conversationId: string) => Message[];
  unreadTotal: number;
  refreshConversations: () => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const refreshConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  }, [isAuthenticated]);

  const refreshMessages = useCallback(async () => {
    if (!isAuthenticated || !activeConversation) return;
    try {
      const data = await messageService.getMessages(activeConversation.id);
      setMessages(prev => ({
        ...prev,
        [activeConversation.id]: data
      }));
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, [isAuthenticated, activeConversation]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshConversations();
      const interval = setInterval(refreshConversations, 30000); // Poll every 30s
      return () => clearInterval(interval);
    } else {
      setConversations([]);
      setMessages({});
      setActiveConversation(null);
    }
  }, [isAuthenticated, refreshConversations]);

  useEffect(() => {
    if (activeConversation) {
      refreshMessages();
      const interval = setInterval(refreshMessages, 5000); // Poll every 5s for active chat
      return () => clearInterval(interval);
    }
  }, [activeConversation, refreshMessages]);

  const sendMessage = async (receiverId: string | number, content: string, hotelId?: string | number) => {
    if (!user) return;

    try {
      let convId = activeConversation?.id;
      
      // If no conversation exists yet, we create it
      if (!convId) {
        const newConv = await messageService.createConversation({
          participants_ids: [user.id, receiverId],
          hotel_id: hotelId
        });
        convId = newConv.id;
        setActiveConversation(newConv);
      }

      const newMessage = await messageService.sendMessage(convId as string, content);
      
      setMessages(prev => ({
        ...prev,
        [convId as string]: [...(prev[convId as string] || []), newMessage]
      }));

      refreshConversations(); // Update last message in list
    } catch (err) {
      console.error('Send message failed:', err);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const getMessages = (conversationId: string) => {
    return messages[conversationId] || [];
  };

  const unreadTotal = useMemo(() => 
    conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0)
  , [conversations]);

  return (
    <MessageContext.Provider value={{
      conversations,
      activeConversation,
      setActiveConversation,
      sendMessage,
      getMessages,
      unreadTotal,
      refreshConversations
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
