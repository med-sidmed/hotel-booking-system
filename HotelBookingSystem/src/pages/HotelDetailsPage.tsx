import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { hotels } from "../data/mockData";
import { useReviews } from "../context/ReviewsContext";
import { ReviewList } from "../components/reviews/ReviewList";
import { AddReviewDialog } from "../components/reviews/AddReviewDialog";

export default function HotelDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hotel = hotels.find((h) => h.id.toString() === id);
  const { getReviewsByHotelId } = useReviews();
  const hotelReviews = hotel ? getReviewsByHotelId(hotel.id) : [];

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Hotel not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="relative h-96">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
          <div className="max-w-7xl mx-auto w-full text-white">
            <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
            <p className="text-xl opacity-90">{hotel.location}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">À propos de {hotel.name}</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {hotel.description}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center text-yellow-500">
               <span className="text-xl font-bold mr-1">★</span>
               {hotel.reviews} avis
            </span>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-8">Chambres disponibles</h2>
        
        {hotel.rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotel.rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-56 relative">
                  <img src={room.images[0]} alt={room.type} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full font-bold text-[#6B5434]">
                    {room.price}€ / nuit
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{room.type}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities?.slice(0, 3).map((amenity, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                    {room.amenities && room.amenities.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        +{room.amenities.length - 3} de plus
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => navigate(`/hotels/${hotel.id}/rooms/${room.id}`)}
                    className="w-full bg-[#6B5434] hover:bg-[#5B4424] text-white py-3 rounded-md font-semibold transition-colors"
                  >
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">Aucune chambre disponible pour le moment.</p>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-16 border-t border-gray-200 pt-12">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Avis des voyageurs</h2>
              <AddReviewDialog hotelId={hotel.id} />
           </div>
           <ReviewList reviews={hotelReviews} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
