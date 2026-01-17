import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HotelsResort from './pages/HotelsResort';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import BookingPage from './pages/BookingPage';
import UserProfilePage from './pages/UserProfilePage';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import MyBookingsPage from './pages/MyBookingsPage';
import HotelDetailsPage from './pages/HotelDetailsPage';

import { FavoritesProvider } from './context/FavoritesContext';
import { ReviewsProvider } from './context/ReviewsContext';

// Admin Imports
import AdminLayout from './Admin/layouts/AdminLayout';
import AdminDashboard from './Admin/pages/AdminDashboard';

import AdminUsers from './Admin/pages/AdminUsers';
import AdminSettings from './Admin/pages/AdminSettings';
import AdminHotels from './Admin/pages/AdminHotels';
import AdminBookings from './Admin/pages/AdminBookings';
import AdminAnalytics from './Admin/pages/AdminAnalytics';
import AdminPromotions from './Admin/pages/AdminPromotions';
import AdminLoyalty from './Admin/pages/AdminLoyalty';
import AdminTransactions from './Admin/pages/AdminTransactions';
import AdminCalendar from './Admin/pages/AdminCalendar';
import AdminSystemConfig from './Admin/pages/AdminSystemConfig';

// Owner Imports
import OwnerLayout from './owner/layouts/OwnerLayout';
import OwnerDashboard from './owner/pages/OwnerDashboard';
import OwnerRooms from './owner/pages/OwnerRooms';
import OwnerRoomForm from './owner/pages/OwnerRoomForm';
import OwnerBookings from './owner/pages/OwnerBookings';
import OwnerFinance from './owner/pages/OwnerFinance';

// Client Dashboard Imports
import ClientLayout from './client/layouts/ClientLayout';
import ClientDashboard from './client/pages/ClientDashboard';
import MyBookings from './client/pages/MyBookings';
import LoyaltyPage from './client/pages/LoyaltyPage';
import MyReviews from './client/pages/MyReviews';
import PaymentHistory from './client/pages/PaymentHistory';

// Contexts
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <FavoritesProvider>
      <ReviewsProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/hotels" element={<HotelsResort />} />
              <Route path="/hotels/:id" element={<HotelDetailsPage />} />
              <Route path="/hotels/:hotelId/rooms/:roomId" element={<RoomDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/profile-old" element={<UserProfilePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="hotels" element={<AdminHotels />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="promotions" element={<AdminPromotions />} />
                <Route path="transactions" element={<AdminTransactions />} />
                <Route path="loyalty" element={<AdminLoyalty />} />
                <Route path="calendar" element={<AdminCalendar />} />
                <Route path="config" element={<AdminSystemConfig />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Owner Routes */}
              <Route path="/owner" element={<OwnerLayout />}>
                <Route index element={<OwnerDashboard />} />
                <Route path="rooms" element={<OwnerRooms />} />
                <Route path="rooms/new" element={<OwnerRoomForm />} />
                <Route path="rooms/:id" element={<OwnerRoomForm />} />
                <Route path="bookings" element={<OwnerBookings />} />
                <Route path="finance" element={<OwnerFinance />} />
                <Route path="settings" element={<AdminSettings />} /> {/* Reuse settings for now */}
              </Route>

              {/* Client Dashboard Routes */}
              <Route path="/profile" element={<ClientLayout />}>
                <Route index element={<ClientDashboard />} />
                <Route path="bookings" element={<MyBookings />} />
                <Route path="favorites" element={<div>Favorites (Coming Soon)</div>} />
                <Route path="reviews" element={<MyReviews />} />
                <Route path="payments" element={<PaymentHistory />} />
                <Route path="loyalty" element={<LoyaltyPage />} />
                <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
              </Route>
              
            </Routes>        
          </BrowserRouter>
        </NotificationProvider>
      </ReviewsProvider>
    </FavoritesProvider>
  );
}

export default App
