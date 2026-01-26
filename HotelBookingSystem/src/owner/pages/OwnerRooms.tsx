import { useState } from 'react';
import { hotels } from '../../data/mockData';
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import type { Room } from '../../types';
import { ConfirmDialog, FormDialog } from '../../components/Dialog';
import toast from 'react-hot-toast';

export default function OwnerRooms() {
  const myHotelId = 1;
  const initialRooms = hotels.find(h => h.id === myHotelId)?.rooms || [];
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    price: 0,
    capacity: 1,
    amenities: '',
    images: '',
    available: true
  });

  const handleDelete = (room: Room) => {
    setSelectedRoom(room);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedRoom) {
      setRooms(rooms.filter(r => r.id !== selectedRoom.id));
      toast.success(`Chambre "${selectedRoom.type}" supprimée avec succès`);
      setSelectedRoom(null);
    }
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      type: room.type,
      description: room.description || '',
      price: room.price,
      capacity: room.capacity,
      amenities: room.amenities.join(', '),
      images: room.images.join('\n'),
      available: room.available
    });
    setShowFormDialog(true);
  };

  const handleCreate = () => {
    setSelectedRoom(null);
    setFormData({
      type: '',
      description: '',
      price: 0,
      capacity: 1,
      amenities: '',
      images: '',
      available: true
    });
    setShowFormDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amenitiesArray = formData.amenities
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    const imagesArray = formData.images
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (selectedRoom) {
      // Update
      const updatedRoom: Room = {
        ...selectedRoom,
        type: formData.type,
        description: formData.description,
        price: formData.price,
        capacity: formData.capacity,
        amenities: amenitiesArray,
        images: imagesArray,
        available: formData.available
      };

      setRooms(rooms.map(r => r.id === selectedRoom.id ? updatedRoom : r));
      toast.success(`Chambre "${formData.type}" mise à jour`);
    } else {
      // Create
      const newRoom: Room = {
        id: Math.max(...rooms.map(r => Number(r.id)), 100) + 1,
        hotelId: myHotelId,
        type: formData.type,
        description: formData.description,
        price: formData.price,
        capacity: formData.capacity,
        amenities: amenitiesArray,
        images: imagesArray,
        available: formData.available
      };

      setRooms([...rooms, newRoom]);
      toast.success(`Chambre "${formData.type}" créée avec succès`);
    }

    setShowFormDialog(false);
  };

  const toggleAvailability = (room: Room) => {
    const updatedRoom = { ...room, available: !room.available };
    setRooms(rooms.map(r => r.id === room.id ? updatedRoom : r));
    toast.success(
      updatedRoom.available 
        ? `"${room.type}" est maintenant disponible` 
        : `"${room.type}" est maintenant indisponible`
    );
  };

  const availableCount = rooms.filter(r => r.available).length;
  const occupiedCount = rooms.length - availableCount;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mes Chambres</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les types de chambres et leur disponibilité</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-[#6B5434] hover:bg-[#5B4424] text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Ajouter une chambre
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Chambres</p>
              <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">{availableCount}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Eye className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Occupées</p>
              <p className="text-2xl font-bold text-red-600">{occupiedCount}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <EyeOff className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={room.images[0]} 
                alt={room.type} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800">
                {room.price} MRU / nuit
              </div>
              {room.images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                  +{room.images.length - 1} photos
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800">{room.type}</h3>
                <button
                  onClick={() => toggleAvailability(room)}
                  className={`text-xs px-2 py-1 rounded-full font-semibold transition-colors ${
                    room.available 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {room.available ? 'Disponible' : 'Occupée'}
                </button>
              </div>
              {room.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{room.description}</p>
              )}
              <p className="text-sm text-gray-500 mb-4">
                Capacité: {room.capacity} personne{room.capacity > 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-1 mb-4">
                {room.amenities.slice(0, 3).map((amenity, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
                {room.amenities.length > 3 && (
                  <span className="text-xs text-gray-400 px-2 py-1">
                    +{room.amenities.length - 3}
                  </span>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleEdit(room)}
                  className="p-2 text-gray-400 hover:text-[#C6A87C] transition-colors" 
                  title="Modifier"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(room)} 
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors" 
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {rooms.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune chambre</h3>
          <p className="text-gray-500 mb-6">Commencez par ajouter votre première chambre</p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-[#6B5434] hover:bg-[#5B4424] text-white rounded-lg font-medium transition-colors"
          >
            Ajouter une Chambre
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Supprimer la chambre"
        message={`Êtes-vous sûr de vouloir supprimer la chambre "${selectedRoom?.type}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        type="danger"
      />

      {/* Form Dialog */}
      <FormDialog
        isOpen={showFormDialog}
        onClose={() => setShowFormDialog(false)}
        title={selectedRoom ? 'Modifier la Chambre' : 'Nouvelle Chambre'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de Chambre *</label>
            <input
              type="text"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              placeholder="Suite Deluxe, Chambre Standard..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              rows={3}
              placeholder="Décrivez la chambre..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix par Nuit (MRU) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacité *</label>
              <input
                type="number"
                required
                min="1"
                max="10"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Équipements (séparés par des virgules) *
            </label>
            <input
              type="text"
              required
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              placeholder="WiFi, TV, Climatisation, Mini-bar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (une URL par ligne) *
            </label>
            <textarea
              required
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent font-mono text-sm"
              rows={4}
              placeholder="https://example.com/room1.jpg&#10;https://example.com/room2.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Entrez au moins une URL d'image</p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="w-4 h-4 text-[#C6A87C] border-gray-300 rounded focus:ring-[#C6A87C]"
            />
            <label htmlFor="available" className="ml-2 text-sm text-gray-700">
              Chambre disponible à la réservation
            </label>
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
              {selectedRoom ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
