import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import toast from 'react-hot-toast';

interface FavoriteItem {
  id: string | number;
  hotelId: number | string;
  hotel: any;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (hotel: any) => void;
  removeFavorite: (hotelId: number | string) => void;
  isFavorite: (hotelId: number | string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (err) {
        console.error('Error parsing favorites from localStorage', err);
      }
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (hotel: any) => {
    if (!hotel || !hotel.id) return;
    if (favorites.some(f => String(f.hotelId) === String(hotel.id))) return;
    
    const newItem: FavoriteItem = {
      id: Date.now(), // Local ID
      hotelId: hotel.id,
      hotel: hotel
    };
    
    setFavorites(prev => [...prev, newItem]);
    toast.success('Ajouté aux favoris');
  };

  const removeFavorite = (hotelId: number | string) => {
    setFavorites(prev => prev.filter(f => String(f.hotelId) !== String(hotelId)));
    toast.success('Retiré des favoris');
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
