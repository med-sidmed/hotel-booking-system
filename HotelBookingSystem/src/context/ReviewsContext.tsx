import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { hotelService } from '../api/hotel.service';

import type { Review } from '../types';

interface ReviewsContextType {
  reviews: Record<number | string, Review[]>;
  addReview: (bookingId: string | number, rating: number, comment: string) => Promise<void>;
  getReviewsByHotelId: (hotelId: number | string) => Review[];
  fetchReviewsForHotel: (hotelId: number | string) => Promise<void>;
  replyToReview: (hotelId: number | string, reviewId: number | string, responseText: string) => Promise<void>;
  getAllReviews: () => Review[];
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Record<number | string, Review[]>>({});

  const fetchReviewsForHotel = async (hotelId: number | string) => {
    try {
      const data = await hotelService.getReviews(hotelId);
      const normalizedData = data.map((r: any) => ({
        ...r,
        userName: r.user_name || r.userName,
        userAvatar: r.user_avatar || r.userAvatar,
        date: r.created_at ? new Date(r.created_at).toLocaleDateString() : r.date,
        ownerResponse: r.owner_response ? (
          typeof r.owner_response === 'string' 
            ? { text: r.owner_response, date: '' }
            : { text: r.owner_response.text, date: new Date(r.owner_response.created_at).toLocaleDateString() }
        ) : null
      }));
      setReviews(prev => ({
        ...prev,
        [hotelId]: normalizedData
      }));
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const addReview = async (bookingId: string | number, rating: number, comment: string) => {
    try {
      await hotelService.createReview(bookingId, { rating, comment });
      // Refresh logic would need hotelId, but we can just let pages refresh
    } catch (err) {
      console.error('Failed to add review:', err);
      throw err;
    }
  };

  const replyToReview = async (hotelId: number | string, reviewId: number | string, responseText: string) => {
    try {
      await hotelService.replyToReview(reviewId, responseText);
      await fetchReviewsForHotel(hotelId);
    } catch (err) {
      console.error('Failed to reply to review:', err);
      throw err;
    }
  };

  const getReviewsByHotelId = (hotelId: number | string) => {
    return (reviews[hotelId] || []);
  };

  const getAllReviews = () => {
    return Object.values(reviews).flat();
  };

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, getReviewsByHotelId, fetchReviewsForHotel, replyToReview, getAllReviews }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
