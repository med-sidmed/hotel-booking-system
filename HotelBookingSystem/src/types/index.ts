export interface Hotel {
  id: number | string;
  name: string;
  location: string;
  description: string;
  reviews: number;
  image: string;
  pricePerNight?: number;
}

export interface Room {
  id: number | string;
  hotelId: number | string;
  type: string; // e.g., "Standard", "Deluxe", "Suite"
  price: number;
  capacity: number;
  amenities: string[];
  image: string;
  available: boolean;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Booking {
  id: number | string;
  userId: number | string;
  roomId: number | string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}
