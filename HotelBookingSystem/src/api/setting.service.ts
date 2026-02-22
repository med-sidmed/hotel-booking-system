import api from './axios';

export interface SystemSetting {
    key: string;
    value: any;
    description: string;
    updated_at: string;
}

export const settingService = {
    getSettings: async (): Promise<SystemSetting[]> => {
        const response = await api.get('settings/');
        return response.data;
    },
    updateSetting: async (key: string, value: any): Promise<SystemSetting> => {
        const response = await api.patch(`settings/${key}/`, { value });
        return response.data;
    }
};
