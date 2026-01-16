import { useState } from 'react';
/* import { useParams, useNavigate } from 'react-router-dom'; */
import NavBar from "../components/common/NavBar";
import Header from '../components/Header';

export default function BookingPage() {
  /* const { roomId } = useParams<{ roomId: string }>(); */
  /* const navigate = useNavigate(); */
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement booking logic
    console.log('Booking attempt', dates);
    alert('Booking Confirmed!');
    /* navigate('/profile'); */
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
   
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#6B5434] text-white py-6 px-8">
            <h1 className="text-2xl font-bold">Complete Your Booking</h1>
            <p className="opacity-90 mt-2">Secure your stay with us</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleBooking} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                  <input
                    type="date"
                    required
                    value={dates.checkIn}
                    onChange={(e) => setDates({...dates, checkIn: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6B5434] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                  <input
                    type="date"
                    required
                    value={dates.checkOut}
                    onChange={(e) => setDates({...dates, checkOut: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6B5434] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#6B5434] focus:outline-none"
                  placeholder="Any special requirements for your stay?"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-2">Price Details</h3>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Room Charge</span>
                  <span>$250.00</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Taxes & Fees</span>
                  <span>$45.00</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>$295.00</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#6B5434] hover:bg-[#5B4424] text-white font-bold py-3 rounded-md transition-colors"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
