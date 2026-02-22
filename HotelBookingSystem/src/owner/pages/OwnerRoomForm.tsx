import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hotelService } from '../../api/hotel.service';
import { Save, ArrowLeft, Trash, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OwnerRoomForm() {
    const navigate = useNavigate();
    const { hotelId: paramHotelId, id: roomId } = useParams();
    const isEditMode = !!roomId;

    const [isLoading, setIsLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [hotelId, setHotelId] = useState<string | number | null>(paramHotelId || null);
    
    const [formData, setFormData] = useState({
        type: '',
        description: '',
        price: 0,
        capacity: 2,
        amenities: [] as string[],
        images: [] as string[]
    });

    const [newImage, setNewImage] = useState('');
    const [newAmenity, setNewAmenity] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                // 1. Get Hotel ID if not provided in params
                let activeHotelId = hotelId;
                if (!activeHotelId) {
                    const ownerHotels = await hotelService.getOwnerHotels();
                    if (ownerHotels.length === 0) {
                        toast.error('Veuillez d\'abord créer un hôtel');
                        navigate('/owner/hotel-info');
                        return;
                    }
                    activeHotelId = ownerHotels[0].id;
                    setHotelId(activeHotelId);
                }

                // 2. Fetch room data if in edit mode
                if (isEditMode && roomId && activeHotelId) {
                    const rooms = await hotelService.getRooms(activeHotelId);
                    const room = rooms.find(r => String(r.id) === String(roomId));
                    if (room) {
                        setFormData({
                            type: room.type,
                            description: room.description || '',
                            price: room.price,
                            capacity: room.capacity,
                            amenities: room.amenities || [],
                            images: room.images || []
                        });
                    } else {
                        toast.error('Chambre introuvable');
                        navigate('/owner/rooms');
                    }
                }
            } catch (err) {
                console.error('Failed to initialize room form:', err);
                toast.error('Erreur lors de l\'initialisation');
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [isEditMode, roomId, navigate]);

    const handleAddImage = () => {
        if (newImage && !formData.images.includes(newImage)) {
            setFormData({ ...formData, images: [...formData.images, newImage] });
            setNewImage('');
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
    };

    const handleAddAmenity = () => {
        if (newAmenity && !formData.amenities.includes(newAmenity)) {
             setFormData({ ...formData, amenities: [...formData.amenities, newAmenity] });
             setNewAmenity('');
        }
    };

    const handleRemoveAmenity = (index: number) => {
        setFormData({ ...formData, amenities: formData.amenities.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hotelId) return;

        setSubmitting(true);
        try {
            if (isEditMode && roomId) {
                await hotelService.updateRoom(hotelId, roomId, formData);
                toast.success('Chambre mise à jour avec succès');
            } else {
                await hotelService.createRoom(hotelId, formData);
                toast.success('Nouvelle chambre créée avec succès');
            }
            navigate('/owner/rooms');
        } catch (err) {
            console.error('Failed to save room:', err);
            toast.error('Erreur lors de l\'enregistrement');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#6B5434] mb-4" />
                <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/owner/rooms')} 
                  className="p-2 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90 border border-transparent hover:border-gray-100"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                        {isEditMode ? 'Configuration de l\'Unité' : 'Nouvelle Unité / Chambre'}
                    </h1>
                    <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-0.5">Hôtel ID: {hotelId}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#C6A87C] uppercase tracking-widest">Type d'hébergement</label>
                        <input
                            type="text"
                            required
                            className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent outline-none font-bold text-gray-900 transition-all"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                            placeholder="ex: Suite Royale, Chambre Standard..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#C6A87C] uppercase tracking-widest">Capacité d'accueil</label>
                        <input
                            type="number"
                            required
                            min="1"
                            className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent outline-none font-bold text-gray-900"
                            value={formData.capacity}
                            onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#C6A87C] uppercase tracking-widest">Tarif par nuit (MRU)</label>
                        <div className="relative">
                            <input
                                type="number"
                                required
                                min="0"
                                className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent outline-none font-bold text-[#6B5434] text-xl"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">MRU</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#C6A87C] uppercase tracking-widest">Description détaillée</label>
                    <textarea
                        rows={4}
                        className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent outline-none font-medium text-gray-700"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Qu'est-ce qui rend cette chambre unique ?"
                    />
                </div>

                <div className="space-y-4">
                     <label className="text-[10px] font-black text-[#C6A87C] uppercase tracking-widest">Galerie Visuelle de l'unité</label>
                     <div className="flex gap-2">
                         <input 
                            type="url" 
                            placeholder="Lien URL de l'image (Unsplash, Firebase, etc.)" 
                            className="flex-1 px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-[#C6A87C] outline-none font-medium"
                            value={newImage}
                            onChange={e => setNewImage(e.target.value)}
                         />
                         <button 
                            type="button" 
                            onClick={handleAddImage} 
                            className="bg-[#FAF6F1] hover:bg-[#F3EDE4] px-6 py-2 rounded-xl text-[#6B5434] font-black uppercase tracking-widest text-[10px] transition-all"
                         >
                             Ajouter
                         </button>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {formData.images.map((img: string, idx: number) => (
                             <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                                 <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                 <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                     <Trash size={20} className="text-white bg-red-500 p-2 rounded-xl" />
                                 </button>
                             </div>
                         ))}
                     </div>
                </div>

                <div className="space-y-4">
                     <label className="text-[10px] font-black text-[#C6A87C] uppercase tracking-widest">Services & Équipements inclus</label>
                     <div className="flex gap-2">
                         <input 
                            type="text" 
                            placeholder="ex: Balcon, Jacuzzi, Vue sur mer..." 
                            className="flex-1 px-5 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-[#C6A87C] outline-none font-medium"
                            value={newAmenity}
                            onChange={e => setNewAmenity(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                         />
                         <button 
                            type="button" 
                            onClick={handleAddAmenity} 
                            className="bg-[#FAF6F1] hover:bg-[#F3EDE4] px-6 py-2 rounded-xl text-[#6B5434] font-black uppercase tracking-widest text-[10px] transition-all"
                         >
                             Inclure
                         </button>
                     </div>
                     <div className="flex flex-wrap gap-2">
                         {formData.amenities.map((item: string, idx: number) => (
                             <span key={idx} className="bg-white text-[#6B5434] px-4 py-2 rounded-xl text-xs font-bold border border-[#FAF6F1] shadow-sm flex items-center gap-3">
                                 {item}
                                 <button 
                                    type="button" 
                                    onClick={() => handleRemoveAmenity(idx)} 
                                    className="hover:text-red-500 transition-colors"
                                 >
                                     <X size={14} />
                                 </button>
                             </span>
                         ))}
                     </div>
                </div>

                <div className="pt-8 border-t border-gray-50 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="bg-[#6B5434] hover:bg-[#5A462C] disabled:bg-gray-400 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl flex items-center gap-3 transition-all active:scale-95"
                    >
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isEditMode ? 'Enregistrer les modifications' : 'Confirmer la création'}
                    </button>
                </div>
            </form>
        </div>
    );
}
