import api from './axios';
import type { Notification } from '../types';

export const notificationService = {
    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get('notifications/');
        return response.data.map((n: any) => ({
            ...n,
            actionUrl: n.action_url,
            date: n.created_at
        }));
    },

    markAsRead: async (id: string | number): Promise<void> => {
        await api.patch(`notifications/${id}/read/`);
    },

    markAllAsRead: async (): Promise<void> => {
        await api.post('notifications/mark_all_read/');
    },

    deleteNotification: async (id: string | number): Promise<void> => {
        await api.delete(`notifications/${id}/`);
    }
};
