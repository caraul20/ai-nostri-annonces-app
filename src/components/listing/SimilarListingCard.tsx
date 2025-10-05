'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Camera, Heart } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { useFavorite } from '@/hooks/useFavorite';

// Serialized interfaces
interface SerializedListing {
  id?: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  locationId: string;
  userId: string;
  status: 'active' | 'inactive' | 'sold' | 'hidden' | 'deleted';
  slug?: string;
  createdAt: string | null;
  updatedAt: string | null;
  views?: number;
  featured?: boolean;
  expiresAt: string | null;
}

interface SerializedCategory {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  order: number;
}

interface SerializedLocation {
  id?: string;
  name: string;
  slug: string;
  isActive: boolean;
  order: number;
}

interface SimilarListingCardProps {
  listing: SerializedListing;
  category?: SerializedCategory | null;
  location?: SerializedLocation | null;
  compact?: boolean;
}

export default function SimilarListingCard({ 
  listing, 
  category, 
  location,
  compact = false
}: SimilarListingCardProps) {
  const { isFavorite, isLoading, toggleFavorite } = useFavorite(listing.id || '');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const mainImage = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : null;

  if (compact) {
    return (
      <Link href={`/listing/${listing.id}`} className="block group">
        <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden">
          {/* Compact Image */}
          <div className="relative aspect-[4/3] bg-gray-100">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={listing.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="256px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-300" />
              </div>
            )}
            
            {/* Category Badge - Compact */}
            <div className="absolute top-2 left-2">
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                <CategoryIcon iconKey={category?.id || listing.categoryId} size={12} />
              </div>
            </div>

            {/* Favorite Button - Compact */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite();
              }}
              disabled={isLoading}
              className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Compact Content */}
          <div className="p-3">
            {/* Price - Prominent */}
            <div className="text-lg font-bold text-gray-900 mb-1">
              {formatPrice(listing.price)}
            </div>

            {/* Title - Compact */}
            <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 leading-tight group-hover:text-gray-700 transition-colors">
              {listing.title}
            </h3>

            {/* Location - Small */}
            <div className="text-xs text-gray-500 truncate">
              {location?.name || 'Locație'}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Regular card (same as AdCardNew grid view)
  return (
    <Link href={`/listing/${listing.id}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-300" />
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
              <CategoryIcon iconKey={category?.id || listing.categoryId} size={14} />
              <span>{category?.name || 'Categorie'}</span>
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite();
            }}
            disabled={isLoading}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Price */}
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatPrice(listing.price)}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="text-sm text-gray-500">
            {location?.name || 'Locație necunoscută'}
          </div>
        </div>
      </div>
    </Link>
  );
}
