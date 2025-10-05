'use client';

import { Heart } from 'lucide-react';
import { useFavorite } from '@/hooks/useFavorite';

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
}

export default function FavoriteButton({ listingId, className = '' }: FavoriteButtonProps) {
  const { isFavorite, isLoading, toggleFavorite, isAuthenticated } = useFavorite(listingId);

  const handleClick = () => {
    if (!isAuthenticated) {
      // Redirect to login for unauthenticated users
      window.location.href = `/login?next=/listing/${listingId}`;
      return;
    }
    toggleFavorite();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Elimină din favorite' : 'Adaugă la favorite'}
      className={`p-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-1.5 font-medium text-xs ${
        isFavorite
          ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'
          : 'bg-gray-50 border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200'
      } ${className}`}
    >
      <Heart 
        className={`h-3.5 w-3.5 ${
          isFavorite ? 'fill-current' : ''
        } ${isLoading ? 'animate-pulse' : ''}`} 
      />
      <span>
        {isLoading ? 'Se încarcă...' : isAuthenticated ? (isFavorite ? 'Favorit' : 'Favorite') : 'Conectează-te'}
      </span>
    </button>
  );
}
