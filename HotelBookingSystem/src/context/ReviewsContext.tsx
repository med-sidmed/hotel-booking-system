import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Review {
  id: number;
  hotelId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsContextType {
  reviews: Record<number, Review[]>;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  getReviewsByHotelId: (hotelId: number) => Review[];
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
                { id: 1, hotelId: 1, userId: 101, userName: "Sophie Martin", rating: 5, comment: "Séjour incroyable, vue magnifique!", date: "2024-01-15" },
                { id: 2, hotelId: 1, userId: 102, userName: "Pierre Dupont", rating: 4, comment: "Très bon service, mais un peu cher.", date: "2024-02-10" }
            ],
            2: [
                { id: 3, hotelId: 2, userId: 103, userName: "Jean Kevin", rating: 5, comment: "Superbe expérience!", date: "2024-03-05" }
            ]
        };
        setReviews(initialReviews);
        localStorage.setItem('hotel_reviews', JSON.stringify(initialReviews));
    }
  }, []);

  const addReview = (newReviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...newReviewData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
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

  const getReviewsByHotelId = (hotelId: number) => {
    return reviews[hotelId] || [];
  };

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, getReviewsByHotelId }}>
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
