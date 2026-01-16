import type { Review } from "../../context/ReviewsContext";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Aucun avis pour le moment. Soyez le premier à partager votre expérience !</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#6B5434]/10 rounded-full flex items-center justify-center text-[#6B5434] font-bold mr-3">
                {review.userName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{review.userName}</h4>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
