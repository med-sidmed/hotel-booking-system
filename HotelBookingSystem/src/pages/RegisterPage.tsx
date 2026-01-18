import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInvitations } from '../context/InvitationContext';
import toast from 'react-hot-toast';
import type { Invitation } from '../types';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [isTokenValidating, setIsTokenValidating] = useState(!!token);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { validateToken, markInvitationAsUsed } = useInvitations();

  useEffect(() => {
    if (token) {
      const invite = validateToken(token);
      if (invite) {
        setInvitation(invite);
        if (invite.email) {
          setFormData(prev => ({ ...prev, email: invite.email! }));
        }
      } else {
        toast.error('Invitation invalide ou expirée');
      }
      setIsTokenValidating(false);
    }
  }, [token, validateToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (invitation && invitation.email && formData.email !== invitation.email) {
      toast.error(`Cette invitation est réservée à ${invitation.email}`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const role = invitation ? invitation.role : 'USER';
      
      // Auto login after registration
      await login(formData.email, role);
      
      if (token) {
        markInvitationAsUsed(token);
      }

      toast.success('Compte créé avec succès !');
      
      // Redirect based on role
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'OWNER') navigate('/owner');
      else navigate('/profile');
      
    } catch (error) {
      toast.error("Erreur lors de l'inscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex flex-col">
      

      <div className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-serif font-bold text-[#3d2817]">
              {invitation ? `Invitation ${invitation.role === 'ADMIN' ? 'Administrateur' : 'Propriétaire'}` : 'Rejoignez Luxotel'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {invitation 
                ? `Vous avez été invité à rejoindre la plateforme en tant que ${invitation.role === 'ADMIN' ? 'administrateur' : 'propriétaire d\'hôtel'}.`
                : 'Créez un compte pour débloquer des avantages exclusifs'}
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            {isTokenValidating ? (
              <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-[#e5e7eb] flex justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B5434]"></div>
              </div>
            ) : (
              <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-[#e5e7eb]">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B5434] focus:border-transparent sm:text-sm"
                    />
                  </div>
                </div>
                {/* phone number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Numéro de téléphone
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B5434] focus:border-transparent sm:text-sm"
                    />
                  </div>
                </div>

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
                      disabled={!!(invitation && invitation.email)}
                      value={formData.email}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B5434] focus:border-transparent sm:text-sm ${invitation && invitation.email ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
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
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B5434] focus:border-transparent sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmez le mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B5434] focus:border-transparent sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-[#6B5434] hover:bg-[#5B4424] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B5434] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
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
                      Vous avez déjà un compte ?
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full flex justify-center py-2 px-4 border border-[#6B5434] rounded-md shadow-sm text-sm font-medium text-[#6B5434] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B5434] transition-colors"
                  >
                    Se connecter
                  </button>
                </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
