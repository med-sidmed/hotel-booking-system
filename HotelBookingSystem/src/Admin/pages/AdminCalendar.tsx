import { useState } from 'react';
import { hotels, mockBookings } from '../../data/mockData';
import { Calendar as CalendarIcon, MapPin, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { ConfirmDialog, FormDialog } from '../../components/Dialog';
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
      // Update
      setSpecialEvents(specialEvents.map(ev =>
        ev.id === selectedEvent.id ? { ...ev, ...formData } : ev
      ));
      toast.success(`Évènement "${formData.name}" mis à jour`);
    } else {
      // Create
      const newEvent: SpecialEvent = {
        id: `EVENT-${Date.now()}`,
        ...formData
      };
      setSpecialEvents([...specialEvents, newEvent]);
      toast.success(`Évènement "${formData.name}" créé avec succès`);
    }
    setShowFormDialog(false);
  };

  // Generate calendar for current month
  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

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

      const bookingsOnDate = mockBookings.filter(b => {
        if (selectedHotel !== 'ALL' && b.hotelId !== selectedHotel) return false;
        return b.checkIn <= dateStr && b.checkOut >= dateStr;
      }).length;

      const specialEvent = specialEvents.find(ev =>
        dateStr >= ev.startDate && dateStr <= ev.endDate
      );

      days.push({
        date: i,
        isCurrentMonth: true,
        fullDate: date,
        bookings: bookingsOnDate,
        isToday: date.toDateString() === new Date().toDateString(),
        specialEvent
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Calendrier Global</h1>
          <p className="text-gray-500 text-sm mt-1">Vue d'ensemble des disponibilités</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Nouvel Évènement
        </button>
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
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 capitalize">{monthName}</h3>
          <div className="flex gap-2">
            <button
              onClick={goToPreviousMonth}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ←
            </button>
            <button
              onClick={goToNextMonth}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-700 py-2">
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`aspect-square border rounded-lg p-2 relative ${day.isCurrentMonth ? '' : 'opacity-30'
                } ${day.isToday ? 'border-[#C6A87C] bg-[#C6A87C]/5' : 'border-gray-200'
                } ${day.specialEvent ? `${eventTypeConfig[day.specialEvent.type].color}/10` : ''
                } hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className={`text-sm font-medium ${day.isToday ? 'text-[#C6A87C]' : 'text-gray-900'}`}>
                {day.date}
              </div>
              {day.bookings && day.bookings > 0 && (
                <div className="absolute bottom-1 right-1">
                  <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                    {day.bookings}
                  </span>
                </div>
              )}
              {day.specialEvent && (
                <div className="absolute top-1 left-1">
                  <div className={`w-2 h-2 rounded-full ${eventTypeConfig[day.specialEvent.type].color}`}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Special Events List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Évènements Spéciaux & Saisons</h3>
        <div className="space-y-3">
          {specialEvents.map(event => (
            <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#C6A87C]/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${eventTypeConfig[event.type].color}`}></div>
                <div>
                  <h4 className="font-semibold text-gray-900">{event.name}</h4>
                  <p className="text-sm text-gray-600">{event.startDate} → {event.endDate}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${eventTypeConfig[event.type].color}`}>
                      {eventTypeConfig[event.type].label}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      ×{event.priceMultiplier}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium text-sm transition-colors flex items-center gap-1"
                >
                  <Edit size={14} />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(event)}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium text-sm transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
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
            const occupancyRate = totalRooms > 0 ? ((hotelBookings / totalRooms) * 100).toFixed(0) : 0;

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
          {Object.entries(eventTypeConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${config.color} rounded`}></div>
              <span className="text-sm text-gray-700">{config.label} (×{config.multiplier})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'évènement"
        message={`Êtes-vous sûr de vouloir supprimer "${selectedEvent?.name}" ? Les tarifs reviendront à la normale pour cette période.`}
        confirmText="Supprimer"
        type="danger"
      />

      {/* Form Dialog */}
      <FormDialog
        isOpen={showFormDialog}
        onClose={() => setShowFormDialog(false)}
        title={selectedEvent ? 'Modifier l\'Évènement' : 'Nouvel Évènement'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'évènement *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              placeholder="Haute Saison Été"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de Début *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de Fin *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              >
                <option value="LOW_SEASON">Basse Saison</option>
                <option value="HIGH_SEASON">Haute Saison</option>
                <option value="PEAK">Pic</option>
                <option value="EVENT">Évènement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Multiplicateur Prix *</label>
              <input
                type="number"
                required
                min="0.1"
                step="0.1"
                value={formData.priceMultiplier}
                onChange={(e) => setFormData({ ...formData, priceMultiplier: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              rows={3}
              placeholder="Description de la période ou évènement..."
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Impact des prix</p>
              <p>Un multiplicateur de {formData.priceMultiplier}× signifie que les prix seront {formData.priceMultiplier > 1 ? 'augmentés' : 'réduits'} de {Math.abs((formData.priceMultiplier - 1) * 100).toFixed(0)}% durant cette période.</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowFormDialog(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-lg font-medium transition-colors"
            >
              {selectedEvent ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
