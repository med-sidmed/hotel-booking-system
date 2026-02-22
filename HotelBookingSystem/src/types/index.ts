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
  image?: string;
  images?: string[];
  pricePerNight?: number;
  rooms: Room[];
  amenities?: string[];
  phone?: string;
  email?: string;
  website?: string;
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
  userId?: number | string;
  user?: number | string;
  roomId?: number | string;
  room?: number | string;
  hotelId?: number | string;
  hotelName?: string;
  hotel_name?: string;
  roomType?: string;
  room_type_name?: string;
  guest_name?: string;
  checkIn: string;
  check_in?: string;
  checkOut: string;
  check_out?: string;
  guests: number;
  totalPrice: number;
  total_price?: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED' | 'CANCELLED';
  date?: string;
  created_at?: string;
}

// New Types for Advanced Features

export interface Review {
  id: string;
  hotelId: number;
  userId: number | string;
  userName?: string;
  user_name?: string;
  userAvatar?: string;
  user_avatar?: string;
  hotel_name?: string;
  rating: number; // 1-5
  comment: string;
  photos: string[];
  date: string;
  created_at?: string;
  ownerResponse?: {
    text: string;
    date: string;
  };
  owner_response?: string | { text: string; created_at: string };
  verified: boolean;
}

export interface Transaction {
  id: string | number;
  userId?: number | string;
  user?: number | string;
  bookingId?: string | number;
  booking?: string | number;
  amount: number | string;
  currency: string;
  method: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  type?: string;
  payment_type?: string;
  date?: string;
  created_at?: string;
  invoiceUrl?: string;
  invoice_url?: string;
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
  isDeleted?: boolean;
}

export interface Conversation {
  id: string;
  participants: {
    id: string | number;
    name: string;
    avatar?: string;
    role: 'USER' | 'OWNER' | 'ADMIN';
  }[];
  lastMessage?: Message;
  unreadCount: number;
  hotelId?: number | string;
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

export interface Invitation {
  id: string;
  token: string;
  email?: string;
  role: 'ADMIN' | 'OWNER';
  expiresAt: string;
  used: boolean;
  createdAt: string;
  hotelName?: string;
}

export interface UserProfile extends UserLogin {
  phone?: string;
  address?: string;
  avatar?: string;
  dob?: string;
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

