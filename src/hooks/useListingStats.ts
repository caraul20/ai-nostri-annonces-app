'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ListingStats {
  views: number;
  favorites: number;
  isLoading: boolean;
}

export function useListingStats(listingId: string): ListingStats {
  const [stats, setStats] = useState<ListingStats>({
    views: 0,
    favorites: 0,
    isLoading: true
  });

  useEffect(() => {
    if (!listingId) return;

    const fetchStats = async () => {
      try {
        // Get real views from listing document
        const listingRef = doc(db, 'listings', listingId);
        const listingSnap = await getDoc(listingRef);
        const views = listingSnap.exists() ? (listingSnap.data().views || 0) : 0;

        // Get real favorites count
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('listingId', '==', listingId)
        );
        const favoritesSnap = await getDocs(favoritesQuery);
        const favorites = favoritesSnap.size;

        setStats({
          views,
          favorites,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching listing stats:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchStats();
  }, [listingId]);

  return stats;
}
