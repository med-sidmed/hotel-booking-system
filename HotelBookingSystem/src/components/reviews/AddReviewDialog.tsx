import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { AddReviewForm } from './AddReviewForm';

interface AddReviewDialogProps {
  hotelId: number;
}

export function AddReviewDialog({ hotelId }: AddReviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-white border border-[#6B5434] text-[#6B5434] hover:bg-[#6B5434] hover:text-white px-4 py-2 rounded-md font-medium transition-colors">
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
