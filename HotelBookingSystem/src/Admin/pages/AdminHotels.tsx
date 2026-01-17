import { useState } from 'react';
import { hotels } from '../../data/mockData';
import { Plus, Edit, Trash2, MapPin, Star, Eye } from 'lucide-react';
import type { Hotel } from '../../types';
import { ConfirmDialog, FormDialog } from '../../components/Dialog';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function AdminHotels() {
  const [hotelsList, setHotelsList] = useState<Hotel[]>(hotels);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    pricePerNight: 0,
    rating: 5,
    description: '',
    image: ''
  });

  const handleDelete = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedHotel) {
      setHotelsList(hotelsList.filter(h => h.id !== selectedHotel.id));
      toast.success(`Hôtel "${selectedHotel.name}" supprimé avec succès`);
      setSelectedHotel(null);
    }
  };

  const handleEdit = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setFormData({
      name: hotel.name,
      location: hotel.location,
      pricePerNight: hotel.pricePerNight || 0,
      rating: hotel.rating,
      description: hotel.description,
      image: hotel.image || ''
    });
    setShowFormDialog(true);
  };

  const handleCreate = () => {
    setSelectedHotel(null);
    setFormData({
      name: '',
      location: '',
      pricePerNight: 0,
      rating: 5,
      description: '',
      image: ''
    });
    setShowFormDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedHotel) {
      // Update
      setHotelsList(hotelsList.map(h => 
        h.id === selectedHotel.id 
          ? { ...h, ...formData }
          : h
      ));
      toast.success(`Hôtel "${formData.name}" mis à jour`);
    } else {
      // Create
      const newHotel: Hotel = {
        id: Math.max(...hotelsList.map(h => h.id)) + 1,
        ...formData,
        rooms: [],
        reviews: 0
      };
      setHotelsList([...hotelsList, newHotel]);
      toast.success(`Hôtel "${formData.name}" créé avec succès`);
    }
    setShowFormDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Hôtels</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez tous les hôtels de la plateforme</p>
        </div>
        <button 
          onClick={handleCreate}
          className="px-4 py-2 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Nouvel Hôtel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Hôtels</p>
              <p className="text-2xl font-bold text-gray-900">{hotelsList.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <MapPin className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Chambres</p>
              <p className="text-2xl font-bold text-green-600">
                {hotelsList.reduce((acc, h) => acc + h.rooms.length, 0)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Star className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Note Moyenne</p>
              <p className="text-2xl font-bold text-yellow-600">
                {(hotelsList.reduce((acc, h) => acc + h.rating, 0) / hotelsList.length).toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Star className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Prix Moyen</p>
              <p className="text-2xl font-bold text-[#C6A87C]">
                {Math.round(hotelsList.filter(h => h.pricePerNight).reduce((acc, h) => acc + (h.pricePerNight || 0), 0) / hotelsList.filter(h => h.pricePerNight).length) || 0}
              </p>
              <p className="text-xs text-gray-400">MRU/nuit</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <MapPin className="text-[#C6A87C]" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {hotelsList.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Hotel Image */}
            <div className="relative h-48 bg-gray-200">
              {hotel.image ? (
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                  <MapPin size={48} className="text-gray-500" />
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="text-yellow-500 fill-yellow-500" size={16} />
                <span className="text-sm font-semibold">{hotel.rating}</span>
              </div>
            </div>

            {/* Hotel Info */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{hotel.name}</h3>
              <div className="flex items-center text-gray-600 text-sm mb-3">
                <MapPin size={16} className="mr-1" />
                <span>{hotel.location}</span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hotel.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">À partir de</p>
                  <p className="text-xl font-bold text-[#C6A87C]">{hotel.pricePerNight} MRU</p>
                  <p className="text-xs text-gray-400">par nuit</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Chambres</p>
                  <p className="text-lg font-semibold text-gray-900">{hotel.rooms.length}</p>
                </div>
              </div>

              {/* Reviews count */}
              <div className="mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {hotel.reviews || 0} avis
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  to={`/hotels/${hotel.id}`}
                  className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <Eye size={16} />
                  Voir
                </Link>
                <button 
                  onClick={() => handleEdit(hotel)}
                  className="flex-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-1"
                >
                  <Edit size={16} />
                  Modifier
                </button>
                <button 
                  onClick={() => handleDelete(hotel)}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium text-sm transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hotelsList.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun hôtel</h3>
          <p className="text-gray-500 mb-6">Commencez par ajouter votre premier hôtel</p>
          <button 
            onClick={handleCreate}
            className="px-6 py-3 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-lg font-medium transition-colors"
          >
            Ajouter un Hôtel
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'hôtel"
        message={`Êtes-vous sûr de vouloir supprimer l'hôtel "${selectedHotel?.name}" ? Cette action supprimera également toutes les chambres associées. Cette action est irréversible.`}
        confirmText="Supprimer"
        type="danger"
      />

      {/* Form Dialog */}
      <FormDialog
        isOpen={showFormDialog}
        onClose={() => setShowFormDialog(false)}
        title={selectedHotel ? 'Modifier l\'Hôtel' : 'Nouvel Hôtel'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'Hôtel *</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              placeholder="Hôtel Élégance Royal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Localisation *</label>
            <input 
              type="text" 
              required
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              placeholder="Nouakchott, Mauritanie"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix par Nuit (MRU) *</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({...formData, pricePerNight: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note *</label>
              <select 
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                <option value={4}>⭐⭐⭐⭐ (4)</option>
                <option value={3}>⭐⭐⭐ (3)</option>
                <option value={2}>⭐⭐ (2)</option>
                <option value={1}>⭐ (1)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea 
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              rows={4}
              placeholder="Décrivez l'hôtel, ses services, son ambiance..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL de l'Image</label>
            <input 
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              placeholder="https://example.com/hotel-image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Entrez l'URL d'une image pour l'hôtel</p>
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
              {selectedHotel ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
