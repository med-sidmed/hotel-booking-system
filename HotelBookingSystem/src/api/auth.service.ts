import api from './axios';
import type { UserProfile } from '../types';

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('auth/login/', { email, password });
        // The backend returns { token: "..." } based on our previous refactoring
        if (response.data.token) {
            localStorage.setItem('access_token', response.data.token);
        }
        if (response.data.refresh) {
            localStorage.setItem('refresh_token', response.data.refresh);
        }
        return response.data;
    },

    register: async (data: any) => {
        const response = await api.post('auth/register/', data);
        return response.data;
    },

    getMe: async (): Promise<UserProfile> => {
        const response = await api.get('auth/me/');
        return response.data;
    },

    updateProfile: async (data: Partial<UserProfile>) => {
        // Map frontend dob to backend dob (it's already dob in backend now)
        const response = await api.patch('auth/profile/', data);
        return response.data;
    },

    logout: async () => {
        const refresh = localStorage.getItem('refresh_token');
        if (refresh) {
            try {
                await api.post('auth/logout/', { refresh });
            } catch (e) {
                console.warn('Logout session expired or invalid');
            }
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('auth_user');
    },

    // Admin Methods
    getUsers: async (params?: any): Promise<UserProfile[]> => {
        const response = await api.get('users/', { params });
        return response.data;
    },

    updateUser: async (id: string | number, data: any): Promise<UserProfile> => {
        const response = await api.patch(`users/${id}/`, data);
        return response.data;
    },

    deleteUser: async (id: string | number): Promise<void> => {
        await api.delete(`users/${id}/`);
    },

    getInvitations: async (): Promise<any[]> => {
        const response = await api.get('invitations/');
        return response.data;
    },

    createInvitation: async (data: any): Promise<any> => {
        const response = await api.post('invitations/', data);
        return response.data;
    },

    deleteInvitation: async (id: string | number): Promise<void> => {
        await api.delete(`invitations/${id}/`);
    },
    
    validateInvitation: async (token: string): Promise<any> => {
        const response = await api.get(`invitations/validate/?token=${token}`);
        return response.data;
    },
    
    markInvitationAsUsed: async (token: string): Promise<void> => {
        await api.post('invitations/mark_used/', { token });
    }
};
