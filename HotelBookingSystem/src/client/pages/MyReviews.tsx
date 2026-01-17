import { mockReviews } from '../../data/mockData';
import { Star } from 'lucide-react';

export default function MyReviews() {
  const userId = 101;
  const userReviews = mockReviews.filter(r => r.userId === userId);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, idx) => (
      <Star
        key={idx}
        size={16}
        className={idx < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mes Avis</h1>
        <p className="text-gray-500 text-sm mt-1">Consultez et gérez vos avis</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {userReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={review.userAvatar} 
                  alt={review.userName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-gray-800">{review.userName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
              {review.verified && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  Vérifié
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-4">{review.comment}</p>

            {review.photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {review.photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt="Review photo"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {review.ownerResponse && (
              <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                <p className="text-sm font-semibold text-gray-700 mb-1">Réponse du propriétaire:</p>
                <p className="text-sm text-gray-600">{review.ownerResponse.text}</p>
                <p className="text-xs text-gray-400 mt-2">{review.ownerResponse.date}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {userReviews.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">Vous n'avez pas encore laissé d'avis.</p>
        </div>
      )}
    </div>
  );
}
