import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../data/mockData';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Find user in mock data
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        await login(user.email, user.role);
        toast.success(`Bienvenue, ${user.name} !`);
        
        // Redirect to intended page or dashboard based on role
        const from = (location.state as any)?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else {
          // Default redirection based on role
          const defaultPath = user.role === 'ADMIN' ? '/admin' : user.role === 'OWNER' ? '/owner' : '/profile';
          navigate(defaultPath, { replace: true });
        }
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      toast.error('Une erreur est survenue lors de la connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex flex-col">
       
      <div className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-serif font-bold text-[#3d2817]">
            Bon Retour
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous pour accéder à vos réservations
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-[#e5e7eb]">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B5434] focus:border-transparent sm:text-sm transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B5434] focus:border-transparent sm:text-sm transition-shadow"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#6B5434] focus:ring-[#6B5434] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-[#6B5434] hover:text-[#5B4424]">
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-[#6B5434] hover:bg-[#5B4424] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B5434] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Nouveau sur Luxotel ?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full flex justify-center py-2 px-4 border border-[#6B5434] rounded-md shadow-sm text-sm font-medium text-[#6B5434] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B5434] transition-colors"
                >
                  Créer un compte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
  );
}
