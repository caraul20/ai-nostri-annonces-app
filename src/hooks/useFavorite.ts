'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toggleFavorite, isFavorited } from '@/server/repo/repoFirebase';

export function useFavorite(listingId: string) {
  const { user } = useAuth();
  const [isFavoriteState, setIsFavoriteState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if listing is favorited on mount
  useEffect(() => {
    if (user?.id) {
      checkFavoriteStatus();
    }
  }, [user?.id, listingId]);

  const checkFavoriteStatus = async () => {
    if (!user?.id) return;
    
    try {
      const favorited = await isFavorited(user.id, listingId);
      setIsFavoriteState(favorited);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user?.id) {
      // Redirect to login
      window.location.href = `/login?next=/listing/${listingId}`;
      return;
    }

    setIsLoading(true);
    try {
      const newFavoriteState = await toggleFavorite({
        userId: user.id,
        listingId
      });
      setIsFavoriteState(newFavoriteState);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFavorite: isFavoriteState,
    isLoading,
    toggleFavorite: handleToggleFavorite,
    isAuthenticated: !!user
  };
}
