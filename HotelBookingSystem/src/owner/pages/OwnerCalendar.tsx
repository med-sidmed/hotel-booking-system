import { useState, useEffect } from 'react';
import { hotelService } from '../../api/hotel.service';
import { bookingService } from '../../api/booking.service';
import type { Booking, Hotel } from '../../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { FormDialog } from '../../components/Dialog';
import toast from 'react-hot-toast';

interface DayInfo {
  date: number;
  isCurrentMonth: boolean;
  fullDate: Date;
  bookings?: Booking[];
  isToday?: boolean;
  availableRooms?: number;
  totalRooms?: number;
}

export default function OwnerCalendar() {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('ALL');

  const fetchCalendarData = async () => {
    try {
      const [hotelsData, bookingsData] = await Promise.all([
        hotelService.getOwnerHotels(),
        bookingService.getOwnerBookings()
      ]);

      if (hotelsData.length > 0) {
        setHotel(hotelsData[0]);
      }
      setBookings(bookingsData);
    } catch (err) {
      console.error('Failed to fetch calendar data:', err);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const totalRoomsCount = hotel?.rooms?.length || 0;
  const roomTypes = ['ALL', ...new Set(hotel?.rooms?.map(r => r.type) || [])];

  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: DayInfo[] = [];

    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = startPadding; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      days.push({ date: date.getDate(), isCurrentMonth: false, fullDate: date });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        const dateStr = date.toISOString().split('T')[0];

        const bookingsOnDate = bookings.filter(b => {
          const checkIn = String(b.checkIn || b.check_in || '').split('T')[0];
          const checkOut = String(b.checkOut || b.check_out || '').split('T')[0];
          const matchesDate = checkIn <= dateStr && checkOut > dateStr;
          const matchesRoomType = roomTypeFilter === 'ALL' || b.roomType === roomTypeFilter || b.room_type_name === roomTypeFilter;
          return matchesDate && matchesRoomType && (b.status === 'CONFIRMED' || b.status === 'COMPLETED');
        });

        const bookedRooms = bookingsOnDate.length;
        const filteredTotalRooms = roomTypeFilter === 'ALL' 
          ? totalRoomsCount
          : hotel?.rooms?.filter(r => r.type === roomTypeFilter).length || 0;
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

  const getOccupancyStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    const next7DaysStr = next7Days.toISOString().split('T')[0];

    const todayBookings = bookings.filter(b => {
      const checkIn = String(b.checkIn || b.check_in || '').split('T')[0];
      const checkOut = String(b.checkOut || b.check_out || '').split('T')[0];
      return checkIn <= today && checkOut > today && (b.status === 'CONFIRMED' || b.status === 'COMPLETED');
    }).length;

    const upcomingBookings = bookings.filter(b => {
      const checkIn = String(b.checkIn || b.check_in || '').split('T')[0];
      return checkIn > today && checkIn <= next7DaysStr;
    }).length;

    const monthBookings = bookings.filter(b => {
      const bDate = new Date(b.checkIn || b.check_in || '');
      return bDate.getMonth() === selectedDate.getMonth() && 
             bDate.getFullYear() === selectedDate.getFullYear() &&
             (b.status === 'CONFIRMED' || b.status === 'COMPLETED');
    }).length;

    return { todayBookings, upcomingBookings, monthBookings };
  };

  const stats = getOccupancyStats();

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#6B5434] mb-4" />
            <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Chargement du planning...</p>
        </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <CalendarIcon className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Hôtel non configuré</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Planning & Disponibilités</h1>
          <p className="text-gray-500 text-sm mt-1">Vision stratégique de l'occupation en temps réel</p>
        </div>
        <button
          onClick={() => setSelectedDate(new Date())}
          className="px-6 py-2.5 bg-[#6B5434] hover:bg-[#5A462C] text-white rounded-lg font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <CalendarIcon size={16} />
          Aujourd'hui
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Occupation Immédiate</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black text-[#6B5434]">{stats.todayBookings}</p>
            <p className="text-sm font-bold text-gray-300 mb-1">/ {totalRoomsCount} UNITÉS</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Arrivées (J+7)</p>
          <p className="text-3xl font-black text-green-600">{stats.upcomingBookings}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Réservations validées (Mois)</p>
          <p className="text-3xl font-black text-[#C6A87C]">{stats.monthBookings}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
               <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">{monthName}</h3>
               <select
                 value={roomTypeFilter}
                 onChange={(e) => setRoomTypeFilter(e.target.value)}
                 className="px-3 py-1 bg-gray-50 border-none rounded-lg text-[10px] font-black uppercase tracking-widest text-[#6B5434] focus:ring-1 focus:ring-[#C6A87C] outline-none"
               >
                 {roomTypes.map(type => (
                   <option key={type} value={type}>{type === 'ALL' ? 'Toutes catégories' : type}</option>
                 ))}
               </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))} className="p-2 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))} className="p-2 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{day}</div>
            ))}
            {calendarDays.map((day, index) => {
              const isFull = day.availableRooms === 0;
              const isHigh = day.availableRooms! < day.totalRooms! / 2;
              
              return (
                <div
                  key={index}
                  onClick={() => day.isCurrentMonth && (setSelectedDay(day), setShowDetailsDialog(true))}
                  className={`aspect-square border rounded-2xl p-3 relative transition-all group ${
                    day.isCurrentMonth ? 'cursor-pointer hover:shadow-xl hover:scale-105 z-10' : 'opacity-10 cursor-default grayscale'
                  } ${day.isToday ? 'border-[#C6A87C] border-2 ring-4 ring-[#C6A87C]/10' : 'border-gray-50'} ${
                    day.isCurrentMonth ? (isFull ? 'bg-red-50' : isHigh ? 'bg-amber-50' : 'bg-[#FAF6F1]') : ''
                  }`}
                >
                  <span className={`text-xs font-black ${day.isToday ? 'text-[#C6A87C]' : 'text-gray-900'}`}>{day.date}</span>
                  {day.isCurrentMonth && day.totalRooms! > 0 && (
                    <div className="absolute inset-x-0 bottom-3 text-center">
                      <p className={`text-[10px] font-black ${isFull ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-[#6B5434]'}`}>
                        {day.availableRooms} / {day.totalRooms}
                      </p>
                    </div>
                  )}
                  {day.bookings && day.bookings.length > 0 && (
                      <div className="absolute top-3 right-3 flex gap-0.5">
                         <div className="w-1.5 h-1.5 bg-[#C6A87C] rounded-full"></div>
                      </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full md:w-80 space-y-6">
           <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl">
              <h4 className="text-[10px] font-black text-[#C6A87C] uppercase tracking-widest mb-4">Légende Dynamique</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[#FAF6F1] rounded-md border border-white/10"></div>
                  <p className="text-xs font-bold text-gray-300">Haute disponibilité</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-amber-100 rounded-md border border-white/10"></div>
                  <p className="text-xs font-bold text-gray-300">Disponibilité limitée (&lt;50%)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-100 rounded-md border border-white/10"></div>
                  <p className="text-xs font-bold text-gray-300">Établissement Complet</p>
                </div>
              </div>
           </div>

           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="text-[10px] font-black text-[#C6A87C] uppercase tracking-widest mb-4">Conseil Expert</h4>
              <p className="text-gray-600 text-xs italic leading-relaxed">"Une occupation supérieure à 80% sur les 7 prochains jours suggère qu'une mise à jour de vos tarifs haute saison serait pertinente."</p>
           </div>
        </div>
      </div>

      <FormDialog
        isOpen={showDetailsDialog}
        onClose={() => (setShowDetailsDialog(false), setSelectedDay(null))}
        title={selectedDay ? `FOCUS - ${selectedDay.fullDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}` : ''}
      >
        {selectedDay && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Capacité Restante</p>
                  <p className="text-xl font-black text-gray-900">{selectedDay.availableRooms} / {selectedDay.totalRooms}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Occupation</p>
                  <p className="text-xl font-black text-[#C6A87C]">{Math.round(((selectedDay.totalRooms! - selectedDay.availableRooms!) / selectedDay.totalRooms!) * 100)}%</p>
               </div>
            </div>

            {selectedDay.bookings && selectedDay.bookings.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-[#6B5434] uppercase tracking-widest">Détail des occupants ({selectedDay.bookings.length})</h4>
                {selectedDay.bookings.map((booking) => (
                  <div key={booking.id} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-gray-900 text-sm uppercase">{booking.guest_name || booking.user?.toString() || 'Client Inconnu'}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{booking.room_type_name || booking.roomType}</p>
                      </div>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-black tracking-tighter uppercase">{booking.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 opacity-30">
                <CalendarIcon className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest">Aucune activité enregistrée</p>
              </div>
            )}
          </div>
        )}
      </FormDialog>
    </div>
  );
}
