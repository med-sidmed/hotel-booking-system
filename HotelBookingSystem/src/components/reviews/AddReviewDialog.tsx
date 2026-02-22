import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { AddReviewForm } from './AddReviewForm';
import toast from 'react-hot-toast';

interface AddReviewDialogProps {
  hotelId: number;
}

export function AddReviewDialog({ hotelId }: AddReviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error('Veuillez vous connecter pour laisser un avis');
      navigate('/login', { state: { from: location } });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          onClick={handleTriggerClick}
          className="bg-white border border-[#6B5434] text-[#6B5434] hover:bg-[#6B5434] hover:text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Écrire un avis
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white text-[#3d2817]">
        <DialogHeader>
          <DialogTitle>Partagez votre expérience</DialogTitle>
          <DialogDescription>
            Votre avis aidera les autres voyageurs.
          </DialogDescription>
        </DialogHeader>
        <AddReviewForm hotelId={hotelId} onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
