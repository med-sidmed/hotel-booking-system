import { useState } from 'react';
import { hotels, mockBookings } from '../../data/mockData';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';
import { FormDialog } from '../../components/Dialog';

interface DayInfo {
  date: number;
  isCurrentMonth: boolean;
  fullDate: Date;
  bookings?: any[];
  isToday?: boolean;
  availableRooms?: number;
  totalRooms?: number;
}

export default function OwnerCalendar() {
  const myHotelId = 1;
  const myHotel = hotels.find(h => h.id === myHotelId);
  const myBookings = mockBookings.filter(b => b.hotelId === myHotelId);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('ALL');

  const totalRooms = myHotel?.rooms.length || 0;
  
  // Get unique room types
  const roomTypes = ['ALL', ...new Set(myHotel?.rooms.map(r => r.type) || [])];

  // Generate calendar for current month
  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: DayInfo[] = [];

    // Add padding days from previous month
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = startPadding; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      days.push({ date: date.getDate(), isCurrentMonth: false, fullDate: date });
    }

    // Add current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];

      // Get bookings for this date
      const bookingsOnDate = myBookings.filter(b => {
        const matchesDate = b.checkIn <= dateStr && b.checkOut >= dateStr;
        const matchesRoom = roomTypeFilter === 'ALL' || b.roomType === roomTypeFilter;
        return matchesDate && matchesRoom && b.status === 'CONFIRMED';
      });

      // Calculate available rooms
      const bookedRooms = bookingsOnDate.length;
      const filteredTotalRooms = roomTypeFilter === 'ALL' 
        ? totalRooms 
        : myHotel?.rooms.filter(r => r.type === roomTypeFilter).length || 0;
      const availableRooms = Math.max(0, filteredTotalRooms - bookedRooms);

      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: date,
        bookings: bookingsOnDate,
        isToday: date.toDateString() === new Date().toDateString(),
        availableRooms,
        totalRooms: filteredTotalRooms
      });
    }

    return days;
  };

  const calendarDays = generateCalendar();
  const monthName = selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const handleDayClick = (day: DayInfo) => {
    if (day.isCurrentMonth) {
      setSelectedDay(day);
      setShowDetailsDialog(true);
    }
  };

  const getAvailabilityColor = (day: DayInfo) => {
    if (!day.isCurrentMonth || day.totalRooms === 0) return '';
    
    const occupancyRate = ((day.totalRooms! - day.availableRooms!) / day.totalRooms!) * 100;
    
    if (occupancyRate === 0) return 'bg-green-50 border-green-200';
    if (occupancyRate < 50) return 'bg-green-50/50 border-green-100';
    if (occupancyRate < 100) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getOccupancyStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    const next7DaysStr = next7Days.toISOString().split('T')[0];

    const todayBookings = myBookings.filter(b => 
      b.checkIn <= today && b.checkOut >= today && b.status === 'CONFIRMED'
    ).length;

    const upcomingBookings = myBookings.filter(b => 
      b.checkIn > today && b.checkIn <= next7DaysStr
    ).length;

    const monthBookings = myBookings.filter(b => {
      const bookingMonth = new Date(b.checkIn).getMonth();
      const bookingYear = new Date(b.checkIn).getFullYear();
      return bookingMonth === selectedDate.getMonth() && 
             bookingYear === selectedDate.getFullYear() &&
             b.status === 'CONFIRMED';
    }).length;

    return { todayBookings, upcomingBookings, monthBookings };
  };

  const stats = getOccupancyStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Calendrier des Disponibilités</h1>
          <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de l'occupation des chambres</p>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <CalendarIcon size={18} />
          Aujourd'hui
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Occupation Aujourd'hui</p>
              <p className="text-2xl font-bold text-blue-600">{stats.todayBookings} / {totalRooms}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <CalendarIcon className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Arrivées 7 Prochains Jours</p>
              <p className="text-2xl font-bold text-green-600">{stats.upcomingBookings}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CalendarIcon className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Réservations ce Mois</p>
              <p className="text-2xl font-bold text-[#C6A87C]">{stats.monthBookings}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <CalendarIcon className="text-[#C6A87C]" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Room Type Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par type de chambre</label>
        <select
          value={roomTypeFilter}
          onChange={(e) => setRoomTypeFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
        >
          {roomTypes.map(type => (
            <option key={type} value={type}>
              {type === 'ALL' ? 'Tous les types' : type}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 capitalize">{monthName}</h3>
          <div className="flex gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-700 py-2 text-sm">
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              className={`aspect-square border rounded-lg p-2 relative transition-all ${
                day.isCurrentMonth ? 'cursor-pointer hover:shadow-md' : 'opacity-30 cursor-default'
              } ${
                day.isToday ? 'border-[#C6A87C] border-2' : 'border-gray-200'
              } ${
                getAvailabilityColor(day)
              }`}
            >
              <div className={`text-sm font-medium ${day.isToday ? 'text-[#C6A87C]' : 'text-gray-900'}`}>
                {day.date}
              </div>
              
              {day.isCurrentMonth && day.totalRooms! > 0 && (
                <>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-xs text-center">
                      <span className={`font-semibold ${
                        day.availableRooms === 0 ? 'text-red-600' :
                        day.availableRooms! < day.totalRooms! / 2 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {day.availableRooms}
                      </span>
                      <span className="text-gray-500"> / {day.totalRooms}</span>
                    </div>
                  </div>
                  
                  {day.bookings && day.bookings.length > 0 && (
                    <div className="absolute top-2 right-2">
                      <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-semibold">
                        {day.bookings.length}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Légende</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-sm text-gray-700">Disponible (0%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-50/50 border border-green-100 rounded"></div>
            <span className="text-sm text-gray-700">Faible occupation (&lt;50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-50 border border-yellow-200 rounded"></div>
            <span className="text-sm text-gray-700">Haute occupation (50-99%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-50 border border-red-200 rounded"></div>
            <span className="text-sm text-gray-700">Complet (100%)</span>
          </div>
        </div>
      </div>

      {/* Day Details Dialog */}
      <FormDialog
        isOpen={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedDay(null);
        }}
        title={selectedDay ? `Détails du ${selectedDay.fullDate.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}` : ''}
      >
        {selectedDay && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Disponibilité</p>
                  <p className="text-blue-800 text-sm">
                    {selectedDay.availableRooms} chambre{selectedDay.availableRooms! > 1 ? 's' : ''} disponible{selectedDay.availableRooms! > 1 ? 's' : ''} sur {selectedDay.totalRooms}
                  </p>
                </div>
              </div>
            </div>

            {selectedDay.bookings && selectedDay.bookings.length > 0 ? (
              <>
                <h4 className="font-semibold">Réservations ({selectedDay.bookings.length})</h4>
                <div className="space-y-3">
                  {selectedDay.bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#C6A87C]/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{booking.userName}</p>
                          <p className="text-sm text-gray-500">{booking.roomType}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Du:</span>
                          <span className="font-medium">{booking.checkIn}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Au:</span>
                          <span className="font-medium">{booking.checkOut}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span>Prix:</span>
                          <span className="font-bold text-[#6B5434]">{booking.totalPrice} MRU</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-500">Aucune réservation pour ce jour</p>
              </div>
            )}
          </div>
        )}
      </FormDialog>
    </div>
  );
}
