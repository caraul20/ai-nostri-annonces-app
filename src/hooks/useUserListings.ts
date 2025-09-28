'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  QuerySnapshot,
  DocumentData 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Listing {
  id: string;
  title: string;
  status: 'active' | 'inactive' | 'sold' | 'hidden' | 'deleted';
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
  price: number;
  images: string[];
  userId: string;
}

interface ListingStats {
  activeCount: number;
  viewsTotal: number;
}

interface UseUserListingsReturn {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  stats: ListingStats;
}

export function useUserListings(userId?: string): UseUserListingsReturn {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ListingStats>({ activeCount: 0, viewsTotal: 0 });

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    console.log('Setting up listings listener for user:', userId);

    const listingsRef = collection(db, 'listings');
    // Temporary: Simplified query to avoid index requirement
    // TODO: Add complex ordering after creating composite index
    const q = query(
      listingsRef,
      where('userId', '==', userId),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        try {
          const listingsData: Listing[] = [];
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            // Filter out deleted listings client-side
            if (data.status !== 'deleted') {
              listingsData.push({
                id: doc.id,
                title: data.title || '',
                status: data.status || 'inactive',
                views: data.views || 0,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                price: data.price || 0,
                images: data.images || [],
                userId: data.userId || ''
              });
            }
          });

          // Sort client-side: active first, then by updatedAt desc
          listingsData.sort((a, b) => {
            if (a.status === 'active' && b.status !== 'active') return -1;
            if (b.status === 'active' && a.status !== 'active') return 1;
            return (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0);
          });

          // Calculate stats
          const activeCount = listingsData.filter(l => l.status === 'active').length;
          const viewsTotal = listingsData.reduce((sum, l) => sum + (l.views || 0), 0);

          setListings(listingsData);
          setStats({ activeCount, viewsTotal });
          setError(null);
          
          console.log(`Loaded ${listingsData.length} listings for user ${userId}`);
        } catch (err) {
          console.error('Error processing listings snapshot:', err);
          setError('Eroare la încărcarea anunțurilor');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to listings:', err);
        setError('Eroare la conectarea la baza de date');
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up listings listener');
      unsubscribe();
    };
  }, [userId]);

  return { listings, loading, error, stats };
}
