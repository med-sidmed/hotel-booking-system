import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Booking } from "../types";

export default function MyBookingsPage() {
  // Mock data for bookings
  const bookings: Booking[] = [
    {
      id: "BK-2024-001",
      userId: 1,
      roomId: 101,
      checkIn: "2024-04-10",
      checkOut: "2024-04-15",
      totalPrice: 1250,
      status: "CONFIRMED",
    },
    {
      id: "BK-2023-089",
      userId: 1,
      roomId: 205,
      checkIn: "2023-12-20",
      checkOut: "2023-12-25",
      totalPrice: 900,
      status: "COMPLETED" as any, 
    },
    {
      id: "BK-2023-045",
      userId: 1,
      roomId: 304,
      checkIn: "2023-10-01",
      checkOut: "2023-10-03",
      totalPrice: 450,
      status: "CANCELLED",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Reservations</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No bookings found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't made any reservations yet.
            </p>
            <div className="mt-6">
              <a
                href="/hotels"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#6B5434] hover:bg-[#5B4424]"
              >
                Browse Hotels
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <li key={booking.id}>
                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-[#6B5434] truncate">
                            Booking #{booking.id}
                          </p>
                          <p className="flex items-center text-sm text-gray-500 mt-1">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {booking.checkIn} — {booking.checkOut}
                          </p>
                        </div>
                        <div className="flex items-center">
                           <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 mr-4">
                            ${booking.totalPrice}
                          </p>
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === "CONFIRMED"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 sm:flex sm:justify-between">
                         <div className="sm:flex">
                              {/* Future: Add room details here if available from a join or API */}
                         </div>
                         <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <button className="text-[#6B5434] hover:text-[#8B7355] font-medium transition-colors">View Details &rarr;</button>
                         </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
