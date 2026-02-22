import { useState, useEffect } from 'react';
import { hotelService } from '../../api/hotel.service';
import { bookingService } from '../../api/booking.service';
import { MapPin, Plus, Edit, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { ConfirmDialog, FormDialog } from '../../components/Dialog';
import type { Hotel, Booking } from '../../types';
import toast from 'react-hot-toast';

interface SpecialEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: 'HIGH_SEASON' | 'PEAK' | 'LOW_SEASON' | 'EVENT';
  priceMultiplier: number;
  description: string;
}

export default function AdminCalendar() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHotel, setSelectedHotel] = useState<number | 'ALL'>('ALL');
  
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([
    {
      id: '1',
      name: 'Haute Saison Été',
      startDate: '2026-06-01',
      endDate: '2026-08-31',
      type: 'HIGH_SEASON',
      priceMultiplier: 1.3,
      description: 'Période estivale avec forte affluence touristique'
    },
    {
      id: '2',
      name: 'Fête Nationale',
      startDate: '2026-11-28',
      endDate: '2026-11-28',
      type: 'PEAK',
      priceMultiplier: 1.5,
      description: 'Jour férié national - tarifs maximaux'
    }
  ]);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SpecialEvent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    type: 'EVENT' as 'HIGH_SEASON' | 'PEAK' | 'LOW_SEASON' | 'EVENT',
    priceMultiplier: 1,
    description: ''
  });

  const fetchGlobalData = async () => {
    try {
      const [hotelsData, bookingsData] = await Promise.all([
        hotelService.getHotels(),
        bookingService.getBookings()
      ]);
      setHotels(hotelsData);
      setBookings(bookingsData);
    } catch (err) {
      console.error('Failed to fetch admin calendar data:', err);
      toast.error('Erreur lors du chargement des données globales');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const eventTypeConfig = {
    LOW_SEASON: { label: 'Basse Saison', color: 'bg-green-500', multiplier: 0.8 },
    HIGH_SEASON: { label: 'Haute Saison', color: 'bg-orange-500', multiplier: 1.3 },
    PEAK: { label: 'Pic', color: 'bg-red-500', multiplier: 1.5 },
    EVENT: { label: 'Évènement', color: 'bg-blue-500', multiplier: 1.2 }
  };

  const handleDelete = (event: SpecialEvent) => {
    setSelectedEvent(event);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      setSpecialEvents(specialEvents.filter(e => e.id !== selectedEvent.id));
      toast.success(`Évènement "${selectedEvent.name}" supprimé`);
      setSelectedEvent(null);
    }
  };

  const handleEdit = (event: SpecialEvent) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      type: event.type,
      priceMultiplier: event.priceMultiplier,
      description: event.description
    });
    setShowFormDialog(true);
  };

  const handleCreate = () => {
    setSelectedEvent(null);
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      type: 'EVENT',
      priceMultiplier: 1,
      description: ''
    });
    setShowFormDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedEvent) {
      setSpecialEvents(specialEvents.map(ev =>
        ev.id === selectedEvent.id ? { ...ev, ...formData } : ev
      ));
      toast.success(`Évènement "${formData.name}" mis à jour`);
    } else {
      const newEvent: SpecialEvent = {
        id: `EVENT-${Date.now()}`,
        ...formData
      };
      setSpecialEvents([...specialEvents, newEvent]);
      toast.success(`Évènement "${formData.name}" créé avec succès`);
    }
    setShowFormDialog(false);
  };

  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = startPadding; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      days.push({ date: date.getDate(), isCurrentMonth: false, fullDate: date });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        const dateStr = date.toISOString().split('T')[0];

        const bookingsOnDateCount = bookings.filter(b => {
          if (selectedHotel !== 'ALL' && Number(b.hotelId) !== Number(selectedHotel)) return false;
          const checkIn = String(b.checkIn || b.check_in || '').split('T')[0];
          const checkOut = String(b.checkOut || b.check_out || '').split('T')[0];
          return checkIn <= dateStr && checkOut > dateStr;
        }).length;

        const specialEvent = specialEvents.find(ev =>
          dateStr >= ev.startDate && dateStr <= ev.endDate
        );

        days.push({
          date: i,
          isCurrentMonth: true,
          fullDate: date,
          bookings: bookingsOnDateCount,
          isToday: date.toDateString() === new Date().toDateString(),
          specialEvent
        });
    }

    return days;
  };

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#6B5434] mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Chargement du calendrier global...</p>
        </div>
    );
  }

  const calendarDays = generateCalendar();
  const monthName = selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Calendrier Global</h1>
          <p className="text-gray-500 text-sm mt-1">Vue stratégique sur l'ensemble du parc hôtelier</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-2.5 bg-[#6B5434] hover:bg-[#5A462C] text-white rounded-lg font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Plus size={16} />
          Planifier un évènement
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Filtrer par établissement</label>
            <select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#C6A87C] outline-none"
            >
              <option value="ALL">TOUS LES HÔTELS</option>
              {hotels.map(h => (
                <option key={h.id} value={h.id}>{h.name.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">{monthName}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
              className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
              className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`aspect-square border rounded-2xl p-3 relative transition-all group ${day.isCurrentMonth ? 'hover:shadow-xl' : 'opacity-10 grayscale'
                } ${day.isToday ? 'border-[#C6A87C] bg-[#C6A87C]/5' : 'border-gray-50'
                } ${day.specialEvent ? `${eventTypeConfig[day.specialEvent.type].color}/10` : 'bg-gray-50/30'
                }`}
            >
              <div className={`text-xs font-black ${day.isToday ? 'text-[#C6A87C]' : 'text-gray-900'}`}>
                {day.date}
              </div>
              {day.bookings && day.bookings > 0 && (
                <div className="absolute bottom-3 right-3">
                  <span className="text-[10px] bg-blue-600/10 text-blue-600 px-2 py-0.5 rounded-full font-black">
                    {day.bookings} RES.
                  </span>
                </div>
              )}
              {day.specialEvent && (
                <div className="absolute top-3 right-3">
                  <div className={`w-2 h-2 rounded-full ring-4 ring-white ${eventTypeConfig[day.specialEvent.type].color}`}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xs font-black text-[#C6A87C] uppercase tracking-widest mb-6 uppercase">Évènements & Saisonalité</h3>
          <div className="space-y-4">
            {specialEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${eventTypeConfig[event.type].color}`}></div>
                  <div>
                    <h4 className="font-black text-gray-900 text-sm uppercase">{event.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400">{event.startDate} → {event.endDate}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black text-white ${eventTypeConfig[event.type].color} uppercase`}>
                        {eventTypeConfig[event.type].label}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-black bg-white text-gray-700 uppercase border border-gray-200">
                        ×{event.priceMultiplier} TARIF
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(event)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(event)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xs font-black text-[#C6A87C] uppercase tracking-widest mb-6">Performance du Parc</h3>
          <div className="space-y-4">
            {hotels.map(h => {
              const hBookings = bookings.filter(b => Number(b.hotelId) === h.id && (b.status === 'CONFIRMED' || b.status === 'COMPLETED')).length;
              const tRooms = h.rooms?.length || 0;
              const occRate = tRooms > 0 ? ((hBookings / tRooms) * 100).toFixed(0) : 0;

              return (
                <div key={h.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <MapPin className="text-[#C6A87C]" size={18} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-sm uppercase">{h.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{h.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-[#6B5434]">{occRate}%</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{hBookings}/{tRooms} CHAMBRES</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="SUPPRESSION ÉVÈNEMENT"
        message={`Confirmez-vous la suppression de "${selectedEvent?.name}" ? Les tarifs automatiques seront restaurés.`}
        confirmText="SUPPRIMER"
        type="danger"
      />

      <FormDialog
        isOpen={showFormDialog}
        onClose={() => setShowFormDialog(false)}
        title={selectedEvent ? 'MODIFIER L\'ÉVÈNEMENT' : 'NOUVELLE PLANIFICATION'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Intitulé de l'évènement</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl font-bold focus:ring-2 focus:ring-[#C6A87C] outline-none"
              placeholder="ex: Fête du Trône, Salon de l'Auto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Début</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl font-bold focus:ring-2 focus:ring-[#C6A87C] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Fin</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl font-bold focus:ring-2 focus:ring-[#C6A87C] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type de Saisonalité</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl font-bold focus:ring-2 focus:ring-[#C6A87C] outline-none"
              >
                <option value="LOW_SEASON">BASSE SAISON</option>
                <option value="HIGH_SEASON">HAUTE SAISON</option>
                <option value="PEAK">PIC D'AFFLUENCE</option>
                <option value="EVENT">ÉVÈNEMENT PONCTUEL</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Multiplicateur (Coût)</label>
              <input
                type="number"
                required
                min="0.1"
                step="0.1"
                value={formData.priceMultiplier}
                onChange={(e) => setFormData({ ...formData, priceMultiplier: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl font-bold focus:ring-2 focus:ring-[#C6A87C] outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4">
            <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
            <p className="text-[10px] font-bold text-blue-900 leading-relaxed">
              IMPACT : Un multiplicateur de {formData.priceMultiplier}× appliquera une variation de {Math.abs((formData.priceMultiplier - 1) * 100).toFixed(0)}% sur les tarifs de base des établissements concernés.
            </p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowFormDialog(false)}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#6B5434] hover:bg-[#5A462C] text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg transition-all"
            >
              {selectedEvent ? 'METTRE À JOUR' : 'CRÉER L\'ÉVÈNEMENT'}
            </button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
