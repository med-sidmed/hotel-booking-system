import api from './axios';
import type { Hotel, Room, Review, Promotion } from '../types';

export const hotelService = {
    getHotels: async (params?: any): Promise<Hotel[]> => {
        const response = await api.get('hotels/', { params });
        // Map backend snake_case to frontend camelCase if necessary
        return response.data.map((hotel: any) => ({
            ...hotel,
            pricePerNight: hotel.price_per_night,
            rooms: [] // Rooms are usually fetched separately or nested
        }));
    },

    getOwnerHotels: async (): Promise<Hotel[]> => {
        return hotelService.getHotels({ mine: true });
    },

    getHotel: async (id: string | number): Promise<Hotel> => {
        const response = await api.get(`hotels/${id}/`);
        const hotel = response.data;
        return {
            ...hotel,
            pricePerNight: hotel.price_per_night
        };
    },

    getRooms: async (hotelId: string | number): Promise<Room[]> => {
        const response = await api.get(`hotels/${hotelId}/rooms/`);
        return response.data;
    },

    getReviews: async (hotelId: string | number): Promise<Review[]> => {
        const response = await api.get(`hotels/${hotelId}/reviews/`);
        return response.data;
    },

    getMyReviews: async (): Promise<Review[]> => {
        const response = await api.get('reviews/mine/');
        return response.data;
    },

    getPromotions: async (): Promise<Promotion[]> => {
        const response = await api.get('promotions/');
        return response.data;
    },

    validatePromotion: async (code: string, amount: number) => {
        const response = await api.post('promotions/validate/', { code, amount });
        return response.data;
    },

    deleteHotel: async (id: string | number): Promise<void> => {
        await api.delete(`hotels/${id}/`);
    },

    createHotel: async (data: any): Promise<Hotel> => {
        const backendData = {
            ...data,
            price_per_night: data.pricePerNight
        };
        const response = await api.post('hotels/', backendData);
        return {
            ...response.data,
            pricePerNight: response.data.price_per_night
        };
    },

    updateHotel: async (id: string | number, data: any): Promise<Hotel> => {
        const backendData = {
            ...data,
            price_per_night: data.pricePerNight
        };
        const response = await api.patch(`hotels/${id}/`, backendData);
        return {
            ...response.data,
            pricePerNight: response.data.price_per_night
        };
    },

    createRoom: async (hotelId: string | number, data: any): Promise<Room> => {
        const response = await api.post(`hotels/${hotelId}/rooms/`, data);
        return response.data;
    },

    updateRoom: async (hotelId: string | number, roomId: string | number, data: any): Promise<Room> => {
        const response = await api.patch(`hotels/${hotelId}/rooms/${roomId}/`, data);
        return response.data;
    },

    deleteRoom: async (hotelId: string | number, roomId: string | number): Promise<void> => {
        await api.delete(`hotels/${hotelId}/rooms/${roomId}/`);
    },

    getFavorites: async (): Promise<any[]> => {
        const response = await api.get('favorites/');
        return response.data.map((f: any) => ({
            ...f,
            hotel: {
                ...f.hotel_details,
                pricePerNight: f.hotel_details.price_per_night
            }
        }));
    },

    addFavorite: async (hotelId: string | number): Promise<void> => {
        await api.post('favorites/', { hotel: hotelId });
    },

    removeFavorite: async (favoriteId: string | number): Promise<void> => {
        await api.delete(`favorites/${favoriteId}/`);
    },

    getStats: async (): Promise<any> => {
        const response = await api.get('stats/');
        return response.data;
    },

    createReview: async (bookingId: string | number, data: any): Promise<Review> => {
        const response = await api.post(`bookings/${bookingId}/review/`, data);
        return response.data;
    },

    replyToReview: async (reviewId: string | number, text: string): Promise<any> => {
        const response = await api.post(`reviews/${reviewId}/reply/`, { text });
        return response.data;
    }
};
