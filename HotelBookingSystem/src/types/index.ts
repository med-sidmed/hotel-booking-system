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
  role: 'USER' | 'ADMIN';
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
