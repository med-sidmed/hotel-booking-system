import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Review {
  id: number;
  hotelId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  ownerResponse?: {
    text: string;
    date: string;
  };
  status: 'visible' | 'flagged' | 'hidden';
}

interface ReviewsContextType {
  reviews: Record<number, Review[]>;
  addReview: (review: Omit<Review, 'id' | 'date' | 'status'>) => void;
  getReviewsByHotelId: (hotelId: number) => Review[];
  replyToReview: (hotelId: number, reviewId: number, responseText: string) => void;
  moderateReview: (hotelId: number, reviewId: number, action: 'flag' | 'delete' | 'approve') => void;
  getAllReviews: () => Review[];
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Record<number, Review[]>>({});

  useEffect(() => {
    const storedReviews = localStorage.getItem('hotel_reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
        // Mock initial reviews if none exist
        const initialReviews: Record<number, Review[]> = {
            1: [
                { id: 1, hotelId: 1, userId: 101, userName: "Sophie Martin", rating: 5, comment: "Séjour incroyable, vue magnifique!", date: "2024-01-15", status: 'visible' },
                { id: 2, hotelId: 1, userId: 102, userName: "Pierre Dupont", rating: 4, comment: "Très bon service, mais un peu cher.", date: "2024-02-10", status: 'visible', ownerResponse: { text: "Merci Pierre ! Nous espérons vous revoir bientôt.", date: "2024-02-11" } }
            ],
            2: [
                { id: 3, hotelId: 2, userId: 103, userName: "Jean Kevin", rating: 5, comment: "Superbe expérience!", date: "2024-03-05", status: 'visible' }
            ]
        };
        setReviews(initialReviews);
        localStorage.setItem('hotel_reviews', JSON.stringify(initialReviews));
    }
  }, []);

  const addReview = (newReviewData: Omit<Review, 'id' | 'date' | 'status'>) => {
    const newReview: Review = {
      ...newReviewData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'visible'
    };

    setReviews(prev => {
      const hotelReviews = prev[newReview.hotelId] || [];
      const updatedReviews = {
        ...prev,
        [newReview.hotelId]: [newReview, ...hotelReviews]
      };
      localStorage.setItem('hotel_reviews', JSON.stringify(updatedReviews));
      return updatedReviews;
    });
  };

  const replyToReview = (hotelId: number, reviewId: number, responseText: string) => {
    setReviews(prev => {
      const hotelReviews = prev[hotelId] || [];
      const updatedHotelReviews = hotelReviews.map(review => 
        review.id === reviewId 
          ? { ...review, ownerResponse: { text: responseText, date: new Date().toISOString().split('T')[0] } }
          : review
      );
      const updatedReviews = { ...prev, [hotelId]: updatedHotelReviews };
      localStorage.setItem('hotel_reviews', JSON.stringify(updatedReviews));
      return updatedReviews;
    });
  };

  const moderateReview = (hotelId: number, reviewId: number, action: 'flag' | 'delete' | 'approve') => {
    setReviews(prev => {
      const hotelReviews = prev[hotelId] || [];
      const updatedHotelReviews = hotelReviews.map(review => {
        if (review.id === reviewId) {
          if (action === 'flag') return { ...review, status: 'flagged' as const };
          if (action === 'delete') return { ...review, status: 'hidden' as const };
          if (action === 'approve') return { ...review, status: 'visible' as const };
        }
        return review;
      });
      const updatedReviews = { ...prev, [hotelId]: updatedHotelReviews };
      localStorage.setItem('hotel_reviews', JSON.stringify(updatedReviews));
      return updatedReviews;
    });
  };

  const getReviewsByHotelId = (hotelId: number) => {
    return (reviews[hotelId] || []).filter(r => r.status !== 'hidden');
  };

  const getAllReviews = () => {
    return Object.values(reviews).flat();
  };

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, getReviewsByHotelId, replyToReview, moderateReview, getAllReviews }}>
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
