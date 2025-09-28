'use client';

import { useState, useEffect } from 'react';
import { getSimilarListings } from '@/server/repo/repoFirebase';
import { Listing } from '@/server/repo/repoFirebase';
import AdCard from '@/components/AdCard';

interface SimilarListingsProps {
  categoryId: string;
  locationId: string;
  excludeId: string;
  limit?: number;
}

export default function SimilarListings({ 
  categoryId, 
  locationId, 
  excludeId, 
  limit = 4 
}: SimilarListingsProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSimilarListings();
  }, [categoryId, locationId, excludeId]);

  const fetchSimilarListings = async () => {
    try {
      const similarListings = await getSimilarListings({
        categoryId,
        locationId,
        excludeId,
        limit
      });
      setListings(similarListings);
    } catch (error) {
      console.error('Error fetching similar listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">Anunțuri similare</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300"></div>
              <div className="p-6 space-y-4">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
                <div className="h-7 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">Anunțuri similare</h2>
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="text-7xl mb-6 opacity-60">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Nu am găsit anunțuri similare
          </h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            Încearcă să cauți în alte categorii sau locații pentru a găsi oferte interesante.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Anunțuri similare</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
          {listings.length} anunț{listings.length !== 1 ? 'uri' : ''} găsit{listings.length !== 1 ? 'e' : ''}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="transform hover:scale-[1.02] transition-transform duration-200">
            <AdCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  );
}
