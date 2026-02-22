import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Hotel {
  id: number;
  name: string;
  location: string;
  rating: number;
}

export default function ApiExample() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        // Consuming the API endpoint created in Django
        const response = await api.get<Hotel[]>('hotels/');
        setHotels(response.data);
      } catch (err) {
        setError('Failed to fetch hotels from the backend.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) return <div className="p-4 text-center">Chargement des données...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">API Integration Example (Django + React)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div key={hotel.id} className="p-4 border rounded-lg hover:border-[#C6A87C] transition-colors">
              <h3 className="font-semibold text-lg">{hotel.name}</h3>
              <p className="text-gray-500 text-sm">{hotel.location}</p>
              <div className="mt-2 flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">Aucun hôtel trouvé. Vérifiez que la base de données Django contient des données.</p>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
        <p className="font-bold mb-2 font-serif">Best Practices Implemented:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li><strong>Centralized Axios Instance:</strong> Configured in <code>src/api/axios.ts</code>.</li>
          <li><strong>Async/Await:</strong> Used for clean asynchronous requests.</li>
          <li><strong>Type Safety:</strong> Interfaces defined for API responses.</li>
          <li><strong>Loading & Error States:</strong> Component handles UI feedback correctly.</li>
          <li><strong>Interceptors:</strong> Request interceptor handles JWT auth headers.</li>
        </ul>
      </div>
    </div>
  );
}
