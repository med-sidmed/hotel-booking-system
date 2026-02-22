import api from './axios';
import type { Booking, Transaction } from '../types';

export const bookingService = {
    createBooking: async (data: { room: string | number, check_in: string, check_out: string, guests: number, promotion?: string }): Promise<Booking> => {
        const response = await api.post('bookings/', data);
        return {
            ...response.data,
            checkIn: response.data.check_in,
            checkOut: response.data.check_out,
            totalPrice: response.data.total_price
        };
    },

    getBookings: async (): Promise<Booking[]> => {
        const response = await api.get('bookings/');
        return response.data.map((b: any) => ({
            ...b,
            checkIn: b.check_in,
            checkOut: b.check_out,
            totalPrice: b.total_price
        }));
    },

    getOwnerBookings: async (): Promise<Booking[]> => {
        const response = await api.get('bookings/owner/');
        return response.data;
    },

    getBookingDetails: async (id: string | number): Promise<Booking> => {
        const response = await api.get(`bookings/${id}/`);
        return response.data;
    },

    cancelBooking: async (id: string | number) => {
        const response = await api.patch(`bookings/${id}/cancel/`);
        return response.data;
    },

    getTransactions: async (): Promise<Transaction[]> => {
        const response = await api.get('transactions/');
        return response.data;
    },

    updateBookingStatus: async (id: string | number, status: string): Promise<Booking> => {
        const uppercaseStatus = status.toUpperCase();
        let response;
        if (uppercaseStatus === 'CANCELLED') {
            response = await api.patch(`bookings/${id}/cancel/`);
        } else {
            response = await api.patch(`bookings/${id}/status/`, { status: uppercaseStatus });
        }
        return {
            ...response.data,
            checkIn: response.data.check_in,
            checkOut: response.data.check_out,
            totalPrice: response.data.total_price
        };
    }
};
