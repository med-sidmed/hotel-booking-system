import api from './axios';

export interface AdminStats {
  kpis: {
    total_revenue: number;
    occupancy_rate: number;
    adr: number;
    rev_par: number;
    total_rooms: number;
    occupied_rooms: number;
  };
  monthly_data: {
    month: string;
    revenue: number;
    bookings: number;
  }[];
  top_hotels: {
    name: string;
    bookings: number;
    revenue: number;
  }[];
  status_distribution: {
    status: string;
    count: number;
  }[];
}

export const statsService = {
  getAdminStats: async (): Promise<AdminStats> => {
    const response = await api.get('stats/');
    return response.data;
  }
};
