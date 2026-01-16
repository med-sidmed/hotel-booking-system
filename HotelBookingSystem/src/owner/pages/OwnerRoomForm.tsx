import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hotels } from '../../data/mockData';
import { Save, ArrowLeft, Plus, Trash } from 'lucide-react';

export default function OwnerRoomForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    // Mock initial data if editing (simplified for mock)
    const initialData = (isEditMode
        ? hotels[0].rooms.find(r => r.id === Number(id)) 
        : {}) as any; // Using any for simplicity in mock form to avoid strict Partial<Room> checks vs empty object

    const [formData, setFormData] = useState({
        type: initialData.type || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        capacity: initialData.capacity || 2,
        amenities: initialData.amenities || [],
        images: initialData.images || []
    });

    const [newImage, setNewImage] = useState('');
    const [newAmenity, setNewAmenity] = useState('');

    const handleAddImage = () => {
        if (newImage) {
            setFormData({ ...formData, images: [...formData.images, newImage] });
            setNewImage('');
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
    };

    const handleAddAmenity = () => {
        if (newAmenity) {
             setFormData({ ...formData, amenities: [...formData.amenities, newAmenity] });
             setNewAmenity('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically make an API call
        alert('Chambre enregistrée avec succès (Simulation)');
        navigate('/owner/rooms');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/owner/rooms')} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? 'Modifier la Chambre' : 'Ajouter une Chambre'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type de Chambre</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6B5434] focus:border-transparent outline-none"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                            placeholder="ex: Suite Deluxe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacité (Personnes)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6B5434] focus:border-transparent outline-none"
                            value={formData.capacity}
                            onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prix par nuit (MRU)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6B5434] focus:border-transparent outline-none"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6B5434] focus:border-transparent outline-none"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Description détaillée de la chambre..."
                    />
                </div>

                {/* Images Manager */}
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                     <div className="flex gap-2 mb-4">
                         <input 
                            type="url" 
                            placeholder="URL de l'image (https://...)" 
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6B5434] outline-none"
                            value={newImage}
                            onChange={e => setNewImage(e.target.value)}
                         />
                         <button type="button" onClick={handleAddImage} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-medium">
                             Ajouter
                         </button>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {formData.images.map((img: string, idx: number) => (
                             <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden bg-gray-100">
                                 <img src={img} alt="" className="w-full h-full object-cover" />
                                 <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                     <Trash size={14} />
                                 </button>
                             </div>
                         ))}
                     </div>
                </div>

                {/* Amenities Manager */}
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Équipements</label>
                     <div className="flex gap-2 mb-4">
                         <input 
                            type="text" 
                            placeholder="ex: Wi-Fi, Climatisation..." 
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6B5434] outline-none"
                            value={newAmenity}
                            onChange={e => setNewAmenity(e.target.value)}
                         />
                         <button type="button" onClick={handleAddAmenity} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-medium">
                             Ajouter
                         </button>
                     </div>
                     <div className="flex flex-wrap gap-2">
                         {formData.amenities.map((item: string, idx: number) => (
                             <span key={idx} className="bg-orange-50 text-[#6B5434] px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                 {item}
                                 <button type="button" onClick={() => {
                                     const newAmenities = [...formData.amenities];
                                     newAmenities.splice(idx, 1);
                                     setFormData({...formData, amenities: newAmenities});
                                 }} className="hover:text-red-500">
                                     <X size={14} />
                                 </button>
                             </span>
                         ))}
                     </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button type="submit" className="bg-[#6B5434] hover:bg-[#5B4424] text-white px-8 py-3 rounded-lg font-medium shadow-sm flex items-center gap-2 transition-colors">
                        <Save size={20} />
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    );
}

function X({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
