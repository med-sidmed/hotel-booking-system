import { useState } from 'react';
import { useReviews } from "../../context/ReviewsContext";

interface AddReviewFormProps {
  hotelId: number;
  onSuccess: () => void;
}

export function AddReviewForm({ hotelId, onSuccess }: AddReviewFormProps) {
  const { addReview } = useReviews();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview({
      hotelId,
      userId: Math.floor(Math.random() * 1000), // Mock User ID
      userName: userName || "Voyageur Anonyme",
      rating,
      comment
    });
    setComment("");
    setUserName("");
    setRating(5);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold mb-4">Écrire un avis</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Votre Nom</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-[#6B5434]"
          placeholder="Jean Dupont"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl focus:outline-none transition-colors ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-[#6B5434]"
          placeholder="Partagez votre expérience..."
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#6B5434] hover:bg-[#5B4424] text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Publier l'avis
      </button>
    </form>
  );
}
