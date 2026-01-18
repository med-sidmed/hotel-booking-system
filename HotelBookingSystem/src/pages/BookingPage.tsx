import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { 
  CheckCircle, 
  CreditCard, 
  User, 
  Calendar, 
  Info,
  Gift,
  ArrowLeft,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePromoCodes } from '../context/PromoCodeContext';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { validatePromoCode } = usePromoCodes();

  // Get room info from location state (passed from RoomDetailsPage)
  const bookingInfo = location.state || {
    hotelId: 1,
    roomId: 'R-101',
    hotelName: 'Hôtel Élégance Royal',
    roomName: 'Suite Deluxe Royale',
    price: 250,
    checkIn: '',
    checkOut: ''
  };

  const [step, setStep] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    specialRequests: '',
    paymentMethod: 'card'
  });

  const [dates, setDates] = useState({
    checkIn: bookingInfo.checkIn || '',
    checkOut: bookingInfo.checkOut || ''
  });

  const basePrice = bookingInfo.price;
  const taxes = basePrice * 0.15; // 15% taxes
  const total = basePrice + taxes - discount;

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    setIsValidating(true);
    
    // Simulate API delay
    setTimeout(() => {
      const result = validatePromoCode(promoCode, basePrice);
      if (result.valid) {
        setAppliedPromo(result.promo);
        setDiscount(result.discount || 0);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setIsValidating(false);
    }, 800);
  };

  const handleConfirmBooking = () => {
    toast.loading('Traitement de votre réservation...', { id: 'booking' });
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Réservation confirmée ! Un email de confirmation vous a été envoyé.', { id: 'booking' });
      navigate('/profile/bookings');
    }, 2000);
  };

  const steps = [
    { id: 1, name: 'Dates', icon: Calendar },
    { id: 2, name: 'Détails', icon: User },
    { id: 3, name: 'Paiement', icon: CreditCard },
    { id: 4, name: 'Confirmation', icon: CheckCircle },
  ];

  const nextStep = () => {
    if (step === 1 && (!dates.checkIn || !dates.checkOut)) {
      toast.error('Veuillez sélectionner vos dates de séjour.');
      return;
    }
    setStep(prev => Math.min(prev + 1, 4));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <Header />
   
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto overflow-x-auto pb-4">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    step >= s.id 
                      ? "bg-[#C6A87C] text-white shadow-lg shadow-[#C6A87C]/20" 
                      : "bg-gray-200 dark:bg-gray-800 text-gray-500"
                  )}>
                    {step > s.id ? <CheckCircle size={20} /> : <s.icon size={20} />}
                  </div>
                  <span className={cn(
                    "text-xs font-semibold",
                    step >= s.id ? "text-gray-900 dark:text-white" : "text-gray-400"
                  )}>
                    {s.name}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "h-[2px] w-full mx-4 min-w-[30px]",
                    step > s.id ? "bg-[#C6A87C]" : "bg-gray-200 dark:bg-gray-800"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="bg-[#C6A87C] dark:bg-[#B5966A] p-6 text-white">
                <h2 className="text-xl font-bold">{steps[step-1].name}</h2>
                <p className="opacity-90 text-sm">Étape {step} sur 4</p>
              </div>

              <div className="p-8">
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Arrivée</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C6A87C]" size={18} />
                          <input
                            type="date"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#C6A87C] dark:text-white"
                            value={dates.checkIn}
                            onChange={(e) => setDates({...dates, checkIn: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Départ</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C6A87C]" size={18} />
                          <input
                            type="date"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#C6A87C] dark:text-white"
                            value={dates.checkOut}
                            onChange={(e) => setDates({...dates, checkOut: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex items-start gap-3">
                      <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        L'heure d'enregistrement habituelle est à partir de 14h00 et le départ avant 12h00.
                      </p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prénom</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#C6A87C] dark:text-white"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#C6A87C] dark:text-white"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#C6A87C] dark:text-white"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Téléphone</label>
                        <input
                          type="tel"
                          placeholder="+222 4x xx xx xx"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#C6A87C] dark:text-white"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Demandes Spéciales</label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#C6A87C] dark:text-white"
                        placeholder="Ex: Lit d'appoint, arrivée tardive..."
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4">Mode de paiement</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setFormData({...formData, paymentMethod: 'card'})}
                          className={cn(
                            "p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all",
                            formData.paymentMethod === 'card' 
                              ? "border-[#C6A87C] bg-[#C6A87C]/5 text-[#C6A87C]" 
                              : "border-gray-100 dark:border-gray-800 text-gray-500"
                          )}
                        >
                          <CreditCard size={24} />
                          <span className="text-sm font-semibold">Carte Bancaire</span>
                        </button>
                        <button 
                          onClick={() => setFormData({...formData, paymentMethod: 'onsite'})}
                          className={cn(
                            "p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all",
                            formData.paymentMethod === 'onsite' 
                              ? "border-[#C6A87C] bg-[#C6A87C]/5 text-[#C6A87C]" 
                              : "border-gray-100 dark:border-gray-800 text-gray-500"
                          )}
                        >
                          <User size={24} />
                          <span className="text-sm font-semibold">Payer à l'hôtel</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4">Code Promo</h4>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Gift className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="Entrez votre code..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#C6A87C] dark:text-white uppercase font-mono tracking-wider"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          />
                        </div>
                        <button 
                          onClick={handleApplyPromo}
                          disabled={isValidating || !promoCode.trim()}
                          className="px-6 py-3 bg-gray-900 dark:bg-[#C6A87C] hover:bg-black dark:hover:bg-[#B5966A] text-white rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          {isValidating ? <Loader2 className="animate-spin" size={18} /> : 'Appliquer'}
                        </button>
                      </div>
                      {appliedPromo && (
                        <p className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle size={14} /> Code {appliedPromo.code} appliqué (-{discount} MRU)
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                        <CheckCircle size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Presqu'arrivé !</h3>
                      <p className="text-gray-500">Veuillez vérifier les détails de votre réservation avant de confirmer.</p>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl space-y-4">
                      <div className="flex justify-between items-start pb-4 border-b dark:border-gray-700">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Chambre</p>
                          <p className="font-bold dark:text-white">{bookingInfo.roomName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Dates</p>
                          <p className="font-bold dark:text-white">{dates.checkIn} → {dates.checkOut}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Client</p>
                          <p className="font-bold dark:text-white">{formData.firstName} {formData.lastName}</p>
                          <p className="text-sm dark:text-gray-400">{formData.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Paiement</p>
                          <p className="font-bold dark:text-white">
                            {formData.paymentMethod === 'card' ? 'Carte Bancaire' : 'À l\'hôtel'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="flex justify-between mt-12 pt-8 border-t dark:border-gray-800">
                  <button
                    onClick={prevStep}
                    disabled={step === 1}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold transition-colors disabled:opacity-0"
                  >
                    <ArrowLeft size={20} />
                    Retour
                  </button>
                  {step < 4 ? (
                    <button
                      onClick={nextStep}
                      className="px-8 py-3 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#C6A87C]/20 active:scale-95"
                    >
                      Continuer
                      <ArrowRight size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={handleConfirmBooking}
                      className="px-10 py-4 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-[#C6A87C]/30 active:scale-95"
                    >
                      Confirmer & Réserver
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar (Always visible) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24 overflow-hidden">
              <div className="p-1">
                <img 
                  src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop" 
                  alt="Room" 
                  className="w-full h-40 object-cover rounded-xl"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-bold text-[#C6A87C] uppercase tracking-[0.2em] mb-1">{bookingInfo.hotelName}</p>
                <h3 className="text-xl font-bold mb-4 dark:text-white">{bookingInfo.roomName}</h3>
                
                <div className="space-y-3 py-6 border-y dark:border-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Chambre (x1)</span>
                    <span className="font-semibold dark:text-white">{basePrice} MRU</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Taxes & Frais (15%)</span>
                    <span className="font-semibold dark:text-white">{taxes.toFixed(2)} MRU</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-bold">
                      <span>Réduction Promo</span>
                      <span>-{discount} MRU</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 flex justify-between items-center mb-6">
                  <span className="font-bold text-gray-900 dark:text-white">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#C6A87C]">{total.toFixed(2)} MRU</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">TVA incluse</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <CheckCircle className="text-[#C6A87C]" size={14} />
                    <span>Annulation gratuite (flexible)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <CheckCircle className="text-[#C6A87C]" size={14} />
                    <span>Meilleur prix garanti</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
