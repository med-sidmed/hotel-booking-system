import { useState } from 'react';
import { hotels } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import type { Room } from '../../types';

export default function OwnerRooms() {
    const myHotelId = 1;
    const initialRooms = hotels.find(h => h.id === myHotelId)?.rooms || [];
    const [rooms, setRooms] = useState<Room[]>(initialRooms);

    const handleDelete = (id: number | string) => {
        if (confirm('Voulez-vous vraiment supprimer cette chambre ?')) {
            setRooms(rooms.filter(r => r.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mes Chambres</h1>
                    <p className="text-gray-500 text-sm mt-1">Gérez les types de chambres et leur disponibilité</p>
                </div>
                <Link to="/owner/rooms/new" className="bg-[#6B5434] hover:bg-[#5B4424] text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm">
                    <Plus size={18} className="mr-2" />
                    Ajouter une chambre
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map(room => (
                    <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="h-48 overflow-hidden relative">
                            <img src={room.images[0]} alt={room.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800">
                                {room.price} MRU / nuit
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-800">{room.type}</h3>
                                {room.available ? (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Disponible</span>
                                ) : (
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Occupé</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                {room.amenities.join(' • ')}
                            </p>
                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                                <button className="p-2 text-gray-400 hover:text-[#C6A87C] transition-colors" title="Modifier">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(room.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Supprimer">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {rooms.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">Aucune chambre ajoutée pour le moment.</p>
                </div>
            )}
        </div>
    );
}
