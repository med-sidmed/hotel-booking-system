import { useState, useEffect } from 'react';
import { hotelService } from '../../api/hotel.service';
import { Edit, MapPin, Star, Phone, Mail, Globe, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { Hotel } from '../../types';
import { FormDialog } from '../../components/Dialog';
import toast from 'react-hot-toast';

export default function OwnerHotelInfo() {
  const [hotel, setHotel] = useState<Hotel | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    image: '',
    images: '' 
  });

  const fetchHotel = async () => {
    try {
      const hotels = await hotelService.getOwnerHotels();
      if (hotels.length > 0) {
        const h = hotels[0];
        setHotel(h);
        setFormData({
          name: h.name,
          location: h.location,
          description: h.description,
          phone: h.phone || '',
          email: h.email || '',
          website: h.website || '',
          image: h.image || '',
          images: h.images?.join('\n') || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch owner hotel:', err);
      toast.error('Erreur lors du chargement des informations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotel();
  }, []);

  const handleEdit = () => {
    if (hotel) {
      setShowEditDialog(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hotel) {
      const imageUrls = formData.images
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const updateData = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        image: formData.image || imageUrls[0],
        images: imageUrls
      };

      try {
        const updated = await hotelService.updateHotel(hotel.id, updateData);
        setHotel(updated);
        toast.success(`Informations de "${formData.name}" mises à jour avec succès`);
        setShowEditDialog(false);
      } catch (err) {
        console.error('Failed to update hotel:', err);
        toast.error('Erreur lors de la mise à jour');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#6B5434] mb-4" />
        <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Chargement de votre établissement...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Hôtel non trouvé</p>
        <p className="text-gray-400 text-xs mt-2">Vous n'avez pas encore configuré d'établissement.</p>
      </div>
    );
  }

  const displayImages = hotel.images && hotel.images.length > 0 
    ? hotel.images 
    : hotel.image ? [hotel.image] : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Votre Établissement</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez l'identité visuelle et les contacts de votre hôtel</p>
        </div>
        <button
          onClick={handleEdit}
          className="px-6 py-2.5 bg-[#6B5434] hover:bg-[#5A462C] text-white rounded-lg font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Edit size={16} />
          Modifier
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="relative h-80 bg-gray-100">
          {displayImages.length > 0 ? (
            <img
              src={displayImages[0]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={64} className="text-gray-300" />
            </div>
          )}
          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-xl border border-white">
            <Star className="text-yellow-500 fill-yellow-500" size={18} />
            <span className="text-lg font-black text-gray-900">{hotel.rating || 'N/A'}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
             <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{hotel.name}</h2>
             <div className="flex items-center text-gray-300 mt-2 font-medium">
                <MapPin size={16} className="mr-2 text-[#C6A87C]" />
                <span>{hotel.location}</span>
             </div>
          </div>
        </div>

        <div className="p-8">
          <div className="max-w-3xl">
            <h3 className="text-xs font-black text-[#C6A87C] uppercase tracking-widest mb-4">À propos de l'établissement</h3>
            <p className="text-gray-700 leading-relaxed font-medium text-lg italic bg-gray-50 p-6 rounded-2xl border-l-4 border-[#C6A87C]">"{hotel.description}"</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-100">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Prix de base</p>
              <p className="text-2xl font-black text-[#6B5434]">{hotel.pricePerNight?.toLocaleString()} <span className="text-sm font-bold">MRU / nuit</span></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Popularité</p>
              <p className="text-2xl font-black text-gray-900">{hotel.reviews} <span className="text-sm font-bold text-gray-400">avis clients</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xs font-black text-[#C6A87C] uppercase tracking-widest mb-6">Informations de contact</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-[#C6A87C]/10 rounded-xl group-hover:bg-[#C6A87C] transition-colors">
                <Phone className="text-[#C6A87C] group-hover:text-white" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</p>
                <p className="font-bold text-gray-900">{hotel.phone || 'Non renseigné'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-[#C6A87C]/10 rounded-xl group-hover:bg-[#C6A87C] transition-colors">
                <Mail className="text-[#C6A87C] group-hover:text-white" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email professionnel</p>
                <p className="font-bold text-gray-900">{hotel.email || 'Non renseigné'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-[#C6A87C]/10 rounded-xl group-hover:bg-[#C6A87C] transition-colors">
                <Globe className="text-[#C6A87C] group-hover:text-white" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Site Web Officiel</p>
                {hotel.website ? (
                  <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline truncate inline-block max-w-[180px]">
                    {hotel.website.replace(/^https?:\/\//, '')}
                  </a>
                ) : (
                  <p className="font-bold text-gray-400">Non renseigné</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xs font-black text-[#C6A87C] uppercase tracking-widest mb-6 flex justify-between items-center">
            <span>Galerie Visuelle</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-gray-400">{displayImages.length} Photos</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {displayImages.map((img, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all cursor-pointer group">
                <img
                  src={img}
                  alt={`${hotel.name} - Photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <FormDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="Configuration de l'Hôtel"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom Commercial</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C] outline-none font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Localisation / Ville</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C] outline-none font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description de l'expérience client</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C] outline-none font-medium h-32"
              placeholder="Décrivez ce qui rend votre établissement unique..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone de réservation</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C] outline-none font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Management</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C] outline-none font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Galerie Photo (URLs - une par ligne)</label>
            <textarea
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C] outline-none font-mono text-xs h-32"
              placeholder="https://images.unsplash.com/photo-1..."
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => setShowEditDialog(false)}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-colors uppercase tracking-widest text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#6B5434] hover:bg-[#5A462C] text-white rounded-xl font-bold transition-shadow shadow-lg uppercase tracking-widest text-xs"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
