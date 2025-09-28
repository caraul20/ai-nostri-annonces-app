'use client';

import { useState } from 'react';
import { Heart, MapPin, X } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

interface Favorite {
  id: string;
  listingId: string;
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

interface FavoritesGridProps {
  favorites: Favorite[];
}

export default function FavoritesGrid({ favorites }: FavoritesGridProps) {
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemoveFavorite = async (favoriteId: string) => {
    setRemoving(favoriteId);
    try {
      await deleteDoc(doc(db, 'favorites', favoriteId));
      // Real-time listener in hook will update the list
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Eroare la eliminarea din favorite. Încearcă din nou.');
    } finally {
      setRemoving(null);
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8 text-gray-400" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Niciun favorit încă
        </h3>
        <p className="text-gray-600 mb-6">
          Anunțurile pe care le marchezi ca favorite vor apărea aici.
        </p>
        <Link href="/">
          <button className="btn-primary">
            Explorează anunțuri
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Favorite ({favorites.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favorites.map((favorite) => {
          const { listing } = favorite;
          
          return (
            <div key={favorite.id} className="group relative border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="aspect-[4/3] relative bg-gray-100">
                {listing.images[0] ? (
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-400">Fără imagine</div>
                  </div>
                )}
                
                {/* Remove button */}
                <button
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  disabled={removing === favorite.id}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  aria-label="Elimină din favorite"
                >
                  {removing === favorite.id ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </button>

                {/* Status overlay */}
                {listing.status !== 'active' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white px-2 py-1 rounded text-sm font-medium">
                      {listing.status === 'sold' ? 'Vândut' : 'Indisponibil'}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <Link href={`/listing/${listing.id}`}>
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 hover:text-green-600 transition-colors">
                    {listing.title}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-green-600">
                    {listing.price.toLocaleString()} €
                  </div>
                  
                  {listing.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                      <span className="truncate max-w-[100px]">
                        {listing.location.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Adăugat: {favorite.createdAt.toLocaleDateString('ro-RO')}
                    </span>
                    
                    <Link href={`/listing/${listing.id}`}>
                      <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                        Vezi detalii
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TODO: Add pagination if more than 20 favorites */}
      {favorites.length >= 20 && (
        <div className="mt-6 text-center">
          <button className="btn-secondary">
            Încarcă mai multe favorite
          </button>
        </div>
      )}
    </div>
  );
}
