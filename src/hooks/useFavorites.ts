'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  doc,
  getDoc,
  QuerySnapshot,
  DocumentData 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Favorite {
  id: string;
  listingId: string;
  userId: string;
  listing: {
    id: string;
    title: string;
    price: number;
    images: string[];
    locationId: string;
    location?: {
      name: string;
    };
    status: string;
  };
  createdAt: Date;
}

interface UseFavoritesReturn {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  count: number;
}

export function useFavorites(userId?: string): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    console.log('Setting up favorites listener for user:', userId);

    const favoritesRef = collection(db, 'favorites');
    // Temporary: Use simple query without orderBy to avoid index requirement
    // TODO: Add orderBy('createdAt', 'desc') after creating composite index
    const q = query(
      favoritesRef,
      where('userId', '==', userId),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot: QuerySnapshot<DocumentData>) => {
        try {
          const favoritesData: Favorite[] = [];
          
          // Process each favorite and fetch listing data
          for (const favoriteDoc of snapshot.docs) {
            const favoriteData = favoriteDoc.data();
            
            try {
              // Fetch listing data
              // TODO: Optimize with batched get for better performance
              const listingDoc = await getDoc(doc(db, 'listings', favoriteData.listingId));
              
              if (listingDoc.exists()) {
                const listingData = listingDoc.data();
                
                // TODO: Fetch location data if needed
                let locationData = undefined;
                if (listingData.locationId) {
                  try {
                    const locationDoc = await getDoc(doc(db, 'locations', listingData.locationId));
                    if (locationDoc.exists()) {
                      locationData = { name: locationDoc.data().name };
                    }
                  } catch (locationError) {
                    console.warn('Could not fetch location data:', locationError);
                  }
                }
                
                favoritesData.push({
                  id: favoriteDoc.id,
                  listingId: favoriteData.listingId,
                  userId: favoriteData.userId,
                  listing: {
                    id: listingDoc.id,
                    title: listingData.title || '',
                    price: listingData.price || 0,
                    images: listingData.images || [],
                    locationId: listingData.locationId || '',
                    location: locationData,
                    status: listingData.status || 'inactive'
                  },
                  createdAt: favoriteData.createdAt?.toDate() || new Date()
                });
              } else {
                // Listing was deleted, but favorite still exists
                // TODO: Clean up orphaned favorites
                console.warn(`Favorite ${favoriteDoc.id} references deleted listing ${favoriteData.listingId}`);
              }
            } catch (listingError) {
              console.error(`Error fetching listing ${favoriteData.listingId}:`, listingError);
            }
          }

          setFavorites(favoritesData);
          setCount(favoritesData.length);
          setError(null);
          
          console.log(`Loaded ${favoritesData.length} favorites for user ${userId}`);
        } catch (err) {
          console.error('Error processing favorites snapshot:', err);
          setError('Eroare la încărcarea favoritelor');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to favorites:', err);
        setError('Eroare la conectarea la baza de date');
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up favorites listener');
      unsubscribe();
    };
  }, [userId]);

  return { favorites, loading, error, count };
}
