import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../api/booking.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { PromoCodeForm } from './PromoCodeForm';
import toast from 'react-hot-toast';

interface BookingModalProps {
  room: any;
  hotelName: string;
}

export function BookingModal({ room, hotelName }: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Details, 2: Promo, 3: Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: '1'
  });

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(bookingDetails.checkOut) <= new Date(bookingDetails.checkIn)) {
      toast.error('La date de départ doit être après la date d\'arrivée');
      return;
    }
    setStep(2);
  };

  const handleBookingSubmit = async (promoCode?: string) => {
    setIsSubmitting(true);
    try {
      await bookingService.createBooking({
        room: room.id,
        check_in: bookingDetails.checkIn,
        check_out: bookingDetails.checkOut,
        guests: parseInt(bookingDetails.guests),
        promotion: promoCode
      });
      setStep(3);
    } catch (err: any) {
      console.error('Booking failed:', err);
      toast.error(err.response?.data?.detail || 'Erreur lors de la réservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(1);
      setBookingDetails({ checkIn: '', checkOut: '', guests: '1' });
    }, 300);
  };

  const calculateTotal = () => {
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) return room.price;
    const start = new Date(bookingDetails.checkIn);
    const end = new Date(bookingDetails.checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * room.price : room.price;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && step === 3) resetModal();
      else setIsOpen(open);
    }}>
      <DialogTrigger asChild>
        <button 
          className="bg-[#6B5434] hover:bg-[#5B4424] text-white px-8 py-3 rounded-md font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!room.available}
          onClick={(e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              navigate('/login', { state: { from: location } });
            }
          }}
        >
          Réserver cette chambre
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-[#3d2817]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && `Réserver ${room.type}`}
            {step === 2 && "Vérification & Code Promo"}
            {step === 3 && "Réservation Confirmée !"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && `${hotelName} - ${room.price}€ / nuit`}
            {step === 2 && "Entrez un code promo si vous en possédez un"}
            {step === 3 && "Votre séjour a été réservé avec succès."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <form onSubmit={handleDetailsSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="checkIn" className="text-right font-medium text-sm">
                Arrivée
              </label>
              <input
                id="checkIn"
                type="date"
                className="col-span-3 border border-gray-300 rounded px-3 py-2 text-sm"
                value={bookingDetails.checkIn}
                onChange={(e) => setBookingDetails({...bookingDetails, checkIn: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="checkOut" className="text-right font-medium text-sm">
                Départ
              </label>
              <input
                id="checkOut"
                type="date"
                className="col-span-3 border border-gray-300 rounded px-3 py-2 text-sm"
                value={bookingDetails.checkOut}
                onChange={(e) => setBookingDetails({...bookingDetails, checkOut: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="guests" className="text-right font-medium text-sm">
                Invités
              </label>
              <select
                id="guests"
                className="col-span-3 border border-gray-300 rounded px-3 py-2 text-sm"
                value={bookingDetails.guests}
                onChange={(e) => setBookingDetails({...bookingDetails, guests: e.target.value})}
              >
                {[...Array(room.capacity || 4)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Personne(s)</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50 h-10">
                Annuler
              </Button>
              <Button type="submit" className="bg-[#6B5434] hover:bg-[#5B4424] text-white h-10">
                Continuer
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <PromoCodeForm 
            onSubmit={handleBookingSubmit}
            onBack={() => setStep(1)}
            totalPrice={calculateTotal()}
            isLoading={isSubmitting}
          />
        )}

        {step === 3 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Merci pour votre réservation !</p>
            <p className="text-gray-600 mb-6">Un email de confirmation vous a été envoyé.</p>
            <Button onClick={resetModal} className="bg-[#6B5434] hover:bg-[#5B4424] text-white w-full h-12 text-lg font-bold">
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
