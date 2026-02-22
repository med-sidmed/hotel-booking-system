import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HotelsResort from './pages/HotelsResort';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import BookingPage from './pages/BookingPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import NotFound from './pages/NotFound';

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
import AdminTransactions from './Admin/pages/AdminTransactions';
import AdminCalendar from './Admin/pages/AdminCalendar';
import AdminSystemConfig from './Admin/pages/AdminSystemConfig';

// Owner Imports
import OwnerLayout from './owner/layouts/OwnerLayout';
import OwnerDashboard from './owner/pages/OwnerDashboard';
import OwnerHotelInfo from './owner/pages/OwnerHotelInfo';
import OwnerRooms from './owner/pages/OwnerRooms';
import OwnerRoomForm from './owner/pages/OwnerRoomForm';
import OwnerBookings from './owner/pages/OwnerBookings';
import OwnerCalendar from './owner/pages/OwnerCalendar';
import OwnerReviews from './owner/pages/OwnerReviews';
import AdminReviews from './Admin/pages/AdminReviews';
import OwnerFinance from './owner/pages/OwnerFinance';
import OwnerMessages from './owner/pages/OwnerMessages';

// Client Dashboard Imports
import ClientLayout from './client/layouts/ClientLayout';
import ClientDashboard from './client/pages/ClientDashboard';
import MyBookings from './client/pages/MyBookings';
import MyReviews from './client/pages/MyReviews';
import PaymentHistory from './client/pages/PaymentHistory';
import MyFavorites from './client/pages/MyFavorites';
import ClientSettings from './client/pages/ClientSettings';
import ClientMessages from './client/pages/ClientMessages';

// Contexts
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MessageProvider } from './context/MessageContext';
import { PromoCodeProvider } from './context/PromoCodeContext';
import { InvitationProvider } from './context/InvitationContext';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ChatWindow } from './components/common/ChatWindow';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PromoCodeProvider>
            <InvitationProvider>
              <MessageProvider>
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
                        <Route path="/booking" element={<ProtectedRoute allowedRoles={['USER']}><BookingPage /></ProtectedRoute>} />
                        <Route path="/contact" element={<ContactPage />} />
                        
                        {/* Admin Routes */}
                        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
                          <Route index element={<AdminDashboard />} />
                          <Route path="hotels" element={<AdminHotels />} />
                          <Route path="bookings" element={<AdminBookings />} />
                          <Route path="users" element={<AdminUsers />} />
                          <Route path="analytics" element={<AdminAnalytics />} />
                          <Route path="promotions" element={<AdminPromotions />} />
                          <Route path="transactions" element={<AdminTransactions />} />
                          <Route path="reviews" element={<AdminReviews />} />
                          <Route path="calendar" element={<AdminCalendar />} />
                          <Route path="config" element={<AdminSystemConfig />} />
                          <Route path="settings" element={<AdminSettings />} />
                        </Route>

                        {/* Owner Routes */}
                        <Route path="/owner" element={<ProtectedRoute allowedRoles={['OWNER']}><OwnerLayout /></ProtectedRoute>}>
                          <Route index element={<OwnerDashboard />} />
                          <Route path="hotel-info" element={<OwnerHotelInfo />} />
                          <Route path="rooms" element={<OwnerRooms />} />
                          <Route path="rooms/new" element={<OwnerRoomForm />} />
                          <Route path="rooms/:id" element={<OwnerRoomForm />} />
                          <Route path="bookings" element={<OwnerBookings />} />
                          <Route path="calendar" element={<OwnerCalendar />} />
                          <Route path="reviews" element={<OwnerReviews />} />
                          <Route path="finance" element={<OwnerFinance />} />
                          <Route path="messages" element={<OwnerMessages />} />
                          <Route path="settings" element={<AdminSettings />} /> {/* Reuse settings for now */}
                        </Route>

                        {/* Client Dashboard Routes */}
                        <Route path="/profile" element={<ProtectedRoute allowedRoles={['USER']}><ClientLayout /></ProtectedRoute>}>
                          <Route index element={<ClientDashboard />} />
                          <Route path="bookings" element={<MyBookings />} />
                          <Route path="favorites" element={<MyFavorites />} />
                          <Route path="reviews" element={<MyReviews />} />
                          <Route path="payments" element={<PaymentHistory />} />
                          <Route path="messages" element={<ClientMessages />} />
                          <Route path="settings" element={<ClientSettings />} />
                        </Route>
                        
                        <Route path="*" element={<NotFound />} />
                        
                      </Routes>        
                    </BrowserRouter>
                  </NotificationProvider>
                </ReviewsProvider>
              </FavoritesProvider>
              <ChatWindow />
            </MessageProvider>
          </InvitationProvider>
          </PromoCodeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App
