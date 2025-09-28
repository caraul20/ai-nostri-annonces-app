'use client';

import { Heart } from 'lucide-react';
import { useFavorite } from '@/hooks/useFavorite';

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
}

export default function FavoriteButton({ listingId, className = '' }: FavoriteButtonProps) {
  const { isFavorite, isLoading, toggleFavorite, isAuthenticated } = useFavorite(listingId);

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Elimină din favorite' : 'Adaugă la favorite'}
      className={`p-3 border transition-colors disabled:opacity-50 ${
        isFavorite
          ? 'bg-red-50 border-red-300 text-red-600'
          : 'bg-white border-gray-200 text-gray-600 hover:text-red-600'
      } ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        <Heart 
          className={`h-4 w-4 ${
            isFavorite ? 'fill-current' : ''
          } ${isLoading ? 'animate-pulse' : ''}`} 
        />
        <span className="text-sm">
          {isFavorite ? 'Favorit' : 'Favorite'}
        </span>
      </div>
    </button>
  );
}
