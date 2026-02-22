import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { hotelService } from '../api/hotel.service';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface FavoriteItem {
  id: string | number;
  hotelId: number | string;
  hotel: any;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (hotel: any) => Promise<void>;
  removeFavorite: (hotelId: number | string) => Promise<void>;
  isFavorite: (hotelId: number | string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const { isAuthenticated } = useAuth();

  const fetchFavorites = async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }
    try {
      const data = await hotelService.getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated]);

  const addFavorite = async (hotel: any) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour ajouter des favoris');
      return;
    }
    if (!hotel || !hotel.id) return;
    if (favorites.some(f => String(f.hotelId) === String(hotel.id))) return;
    
    try {
      await hotelService.addFavorite(hotel.id);
      await fetchFavorites();
      toast.success('Ajouté aux favoris');
    } catch (err) {
      toast.error('Erreur lors de l\'ajout aux favoris');
    }
  };

  const removeFavorite = async (hotelId: number | string) => {
    const favorite = favorites.find(f => String(f.hotelId) === String(hotelId));
    if (!favorite) return;

    try {
      await hotelService.removeFavorite(favorite.id);
      setFavorites(prev => prev.filter(f => String(f.hotelId) !== String(hotelId)));
      toast.success('Retiré des favoris');
    } catch (err) {
      toast.error('Erreur lors de la suppression du favori');
    }
  };

  const isFavorite = (hotelId: number | string) => {
    return favorites.some((f) => String(f.hotelId) === String(hotelId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
