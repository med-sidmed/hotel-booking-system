export interface Room {
  id: number | string;
  hotelId: number | string;
  type: string;
  description?: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  available: boolean;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  rating: number;
  reviews: number;
  image: string;
  pricePerNight?: number;
  rooms: Room[];
}

export interface UserLogin {
  id: number | string;
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'OWNER';
}

export interface Booking {
  id: number | string;
  userId: number | string;
  roomId: number | string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
}

// New Types for Advanced Features

export interface Review {
  id: string;
  hotelId: number;
  userId: number | string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  photos: string[];
  date: string;
  ownerResponse?: {
    text: string;
    date: string;
  };
  verified: boolean; // Has user stayed at hotel
}

export interface Transaction {
  id: string;
  userId: number | string;
  bookingId: string;
  amount: number;
  currency: 'MRU' | 'EUR' | 'USD';
  method: 'CARD' | 'CASH' | 'BANK_TRANSFER';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  type: 'DEPOSIT' | 'FULL_PAYMENT';
  date: string;
  invoiceUrl?: string;
}

export interface Notification {
  id: string;
  userId: number | string;
  type: 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'PAYMENT_SUCCESS' | 'REVIEW_REQUEST' | 'MESSAGE' | 'PROMOTION';
  title: string;
  message: string;
  read: boolean;
  date: string;
  actionUrl?: string;
}

export interface Message {
  id: string;
  senderId: number | string;
  senderName: string;
  receiverId: number | string;
  conversationId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface LoyaltyPoints {
  userId: number | string;
  totalPoints: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  transactionHistory: {
    id: string;
    points: number;
    reason: string;
    date: string;
  }[];
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  validFrom: string;
  validUntil: string;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
}

export interface ActivityLog {
  id: string;
  userId: number | string;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entity: 'USER' | 'BOOKING' | 'HOTEL' | 'ROOM' | 'REVIEW';
  entityId: string | number;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface UserProfile extends UserLogin {
  phone?: string;
  address?: string;
  avatar?: string;
  dateOfBirth?: string;
  loyaltyPoints?: number;
  preferences?: {
    language: 'fr' | 'en' | 'ar';
    currency: 'MRU' | 'EUR' | 'USD';
    notifications: boolean;
  };
}

export interface PricingRule {
  id: string;
  roomId: number | string;
  seasonType: 'LOW' | 'NORMAL' | 'HIGH' | 'PEAK';
  startDate: string;
  endDate: string;
  priceModifier: number; // Multiplier (e.g., 1.5 for 50% increase)
  dayOfWeek?: number[]; // 0-6 (Sunday-Saturday)
}

