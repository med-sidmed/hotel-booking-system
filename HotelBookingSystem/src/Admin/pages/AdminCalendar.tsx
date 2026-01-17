import { useState } from 'react';
import { hotels, mockBookings } from '../../data/mockData';
import { Calendar as CalendarIcon, Settings, Lock, MapPin } from 'lucide-react';

export default function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHotel, setSelectedHotel] = useState<number | 'ALL'>('ALL');

  // Generate calendar for current month
  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      
      const bookingsOnDate = mockBookings.filter(b => {
        if (selectedHotel !== 'ALL' && b.hotelId !== selectedHotel) return false;
        return b.checkIn <= dateStr && b.checkOut >= dateStr;
      }).length;

      days.push({
        date: i,
        bookings: bookingsOnDate,
        isToday: date.toDateString() === new Date().toDateString()
      });
    }
    return days;
  };

  const calendarDays = generateCalendar();
  const monthName = selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Calendrier Global</h1>
          <p className="text-gray-500 text-sm mt-1">Vue d'ensemble des disponibilités</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Hôtel</label>
            <select 
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
            >
              <option value="ALL">Tous les hôtels</option>
              {hotels.map(hotel => (
                <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mois</label>
            <input 
              type="month"
              value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split('-');
                setSelectedDate(new Date(Number(year), Number(month) - 1, 1));
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 capitalize">{monthName}</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-700 py-2">
              {day}
            </div>
          ))}
          {calendarDays.map((day) => (
            <div 
              key={day.date}
              className={`aspect-square border rounded-lg p-2 relative ${
                day.isToday ? 'border-[#C6A87C] bg-[#C6A87C]/5' : 'border-gray-200'
              } ${day.bookings > 0 ? 'bg-blue-50' : ''}`}
            >
              <div className="text-sm font-medium text-gray-900">{day.date}</div>
              {day.bookings > 0 && (
                <div className="absolute bottom-1 right-1">
                  <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                    {day.bookings}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hotel Availability Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Disponibilité par Hôtel</h3>
        <div className="space-y-3">
          {hotels.map(hotel => {
            const hotelBookings = mockBookings.filter(b => b.hotelId === hotel.id && b.status === 'CONFIRMED').length;
            const totalRooms = hotel.rooms.length;
            const occupancyRate = ((hotelBookings / totalRooms) * 100).toFixed(0);

            return (
              <div key={hotel.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#C6A87C]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MapPin className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{hotel.name}</h4>
                    <p className="text-sm text-gray-500">{hotel.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#C6A87C]">{occupancyRate}%</p>
                  <p className="text-xs text-gray-500">{hotelBookings}/{totalRooms} chambres</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seasonal Pricing Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Légende & Saisons</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Basse Saison (-20%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">Normale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-700">Haute Saison (+30%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700">Pic (+50%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
