import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <h1 className="text-9xl font-serif font-bold text-[#3d2817] opacity-10">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl font-serif font-semibold text-[#3d2817]">Page Perdue</h2>
          </div>
        </div>
        
        <p className="text-gray-600 text-lg">
          La chambre que vous recherchez semble être déjà réservée ou n'existe plus dans notre établissement.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-[#6B5434] text-[#6B5434] rounded-full hover:bg-[#6B5434] hover:text-white transition-all duration-300 font-medium"
          >
            <ArrowLeft size={20} />
            Retourner
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#6B5434] text-white rounded-full hover:bg-[#5B4424] shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          >
            <Home size={20} />
            Accueil
          </button>
        </div>

        <div className="pt-12">
          <div className="w-16 h-1 bg-[#6B5434] mx-auto rounded-full opacity-20" />
        </div>
      </div>
    </div>
  );
}
