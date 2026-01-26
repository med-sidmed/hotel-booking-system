import { useState } from 'react';
import { hotels } from '../../data/mockData';
import { Edit, MapPin, Star, Phone, Mail, Globe, Image as ImageIcon } from 'lucide-react';
import type { Hotel } from '../../types';
import { FormDialog } from '../../components/Dialog';
import toast from 'react-hot-toast';

export default function OwnerHotelInfo() {
  const myHotelId = 1; // Assuming logged in owner manages Hotel ID 1
  const initialHotel = hotels.find(h => h.id === myHotelId);
  
  const [hotel, setHotel] = useState<Hotel | undefined>(initialHotel);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: hotel?.name || '',
    location: hotel?.location || '',
    description: hotel?.description || '',
    phone: hotel?.phone || '',
    email: hotel?.email || '',
    website: hotel?.website || '',
    image: hotel?.image || '',
    images: hotel?.images?.join('\n') || '' // One URL per line
  });

  const handleEdit = () => {
    if (hotel) {
      setFormData({
        name: hotel.name,
        location: hotel.location,
        description: hotel.description,
        phone: hotel.phone || '',
        email: hotel.email || '',
        website: hotel.website || '',
        image: hotel.image || '',
        images: hotel.images?.join('\n') || ''
      });
      setShowEditDialog(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hotel) {
      // Parse images from textarea (one URL per line)
      const imageUrls = formData.images
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const updatedHotel: Hotel = {
        ...hotel,
        name: formData.name,
        location: formData.location,
        description: formData.description,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        image: formData.image || imageUrls[0],
        images: imageUrls.length > 0 ? imageUrls : undefined
      };

      setHotel(updatedHotel);
      
      // Update in mock data (in real app, this would be an API call)
      const hotelIndex = hotels.findIndex(h => h.id === myHotelId);
      if (hotelIndex !== -1) {
        hotels[hotelIndex] = updatedHotel;
      }

      toast.success(`Informations de "${formData.name}" mises à jour avec succès`);
      setShowEditDialog(false);
    }
  };

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Hôtel non trouvé</p>
      </div>
    );
  }

  const displayImages = hotel.images && hotel.images.length > 0 
    ? hotel.images 
    : hotel.image ? [hotel.image] : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Informations de l'Hôtel</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les détails de votre établissement</p>
        </div>
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Edit size={18} />
          Modifier
        </button>
      </div>

      {/* Hotel Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-gray-300 to-gray-400">
          {displayImages.length > 0 ? (
            <img
              src={displayImages[0]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={64} className="text-gray-500" />
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <Star className="text-yellow-500 fill-yellow-500" size={20} />
            <span className="text-lg font-bold text-gray-900">{hotel.rating}</span>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{hotel.name}</h2>
          
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={18} className="mr-2" />
            <span>{hotel.location}</span>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">{hotel.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Prix par nuit</p>
              <p className="text-xl font-bold text-[#C6A87C]">{hotel.pricePerNight} MRU</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Nombre d'avis</p>
              <p className="text-xl font-bold text-gray-900">{hotel.reviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Coordonnées</h3>
        <div className="space-y-3">
          {hotel.phone && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Phone className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-medium text-gray-900">{hotel.phone}</p>
              </div>
            </div>
          )}
          {hotel.email && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Mail className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{hotel.email}</p>
              </div>
            </div>
          )}
          {hotel.website && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Globe className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Site web</p>
                <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                  {hotel.website}
                </a>
              </div>
            </div>
          )}
          {!hotel.phone && !hotel.email && !hotel.website && (
            <p className="text-gray-500 text-sm italic">Aucune information de contact ajoutée</p>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      {displayImages.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Galerie Photos ({displayImages.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayImages.map((img, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                <img
                  src={img}
                  alt={`${hotel.name} - Photo ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <FormDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Modifier les Informations de l'Hôtel"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'Hôtel *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Localisation *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              rows={4}
              placeholder="Décrivez votre hôtel, ses services, son ambiance..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
                placeholder="+222 XX XX XX XX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
                placeholder="contact@hotel.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Web</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              placeholder="https://www.hotel.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image Principale</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              placeholder="https://example.com/hotel-main.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Galerie Photos (une URL par ligne)
            </label>
            <textarea
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent font-mono text-sm"
              rows={6}
              placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg&#10;https://example.com/photo3.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Entrez une URL d'image par ligne</p>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowEditDialog(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-lg font-medium transition-colors"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
