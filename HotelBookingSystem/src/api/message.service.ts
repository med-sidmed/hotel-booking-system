import api from './axios';
import type { Conversation, Message } from '../types';

export const messageService = {
    getConversations: async (): Promise<Conversation[]> => {
        const response = await api.get('conversations/');
        return response.data.map((c: any) => ({
            ...c,
            unreadCount: c.unread_count,
            hotelId: c.hotel_id,
            participants: c.participants_details || c.participants
        }));
    },

    getMessages: async (conversationId: string | number): Promise<Message[]> => {
        const response = await api.get(`messages/?conversation=${conversationId}`);
        return response.data.map((m: any) => ({
            ...m,
            senderId: m.sender,
            timestamp: m.created_at
        }));
    },

    sendMessage: async (conversationId: string | number, content: string): Promise<Message> => {
        const response = await api.post('messages/', {
            conversation: conversationId,
            content
        });
        return {
            ...response.data,
            senderId: response.data.sender,
            timestamp: response.data.created_at
        };
    },

    createConversation: async (data: { participants_ids: (string | number)[], hotel_id?: string | number }): Promise<Conversation> => {
        const response = await api.post('conversations/', data);
        return {
            ...response.data,
            unreadCount: response.data.unread_count,
            hotelId: response.data.hotel_id,
            participants: response.data.participants
        };
    }
};
