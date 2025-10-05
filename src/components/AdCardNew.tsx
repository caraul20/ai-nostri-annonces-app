'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Eye, Heart, Camera, Clock } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { useFavorite } from '@/hooks/useFavorite';
import { useListingStats } from '@/hooks/useListingStats';

// Serialized interfaces for client component
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

interface AdCardNewProps {
  listing: SerializedListing;
  category?: SerializedCategory | null;
  location?: SerializedLocation | null;
  viewType?: 'grid' | 'list';
}

export default function AdCardNew({ 
  listing, 
  category, 
  location, 
  viewType = 'grid' 
}: AdCardNewProps) {
  const { isFavorite, isLoading, toggleFavorite } = useFavorite(listing.id || '');
  const { views, favorites } = useListingStats(listing.id || '');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    try {
      const dateObj = new Date(dateString);
      const now = new Date();
      const daysDiff = Math.ceil((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) {
        return 'Azi';
      } else if (daysDiff <= 7) {
        return `Acum ${daysDiff} zile`;
      } else if (daysDiff <= 30) {
        return `Acum ${Math.ceil(daysDiff / 7)} săptămâni`;
      } else {
        return dateObj.toLocaleDateString('ro-RO', {
          day: 'numeric',
          month: 'short'
        });
      }
    } catch (error) {
      return '';
    }
  };

  const mainImage = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : null;

  if (viewType === 'list') {
    return (
      <Link href={`/listing/${listing.id}`} className="block">
        <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-3 sm:p-4">
          <div className="flex gap-3 sm:gap-4">
            {/* Image */}
            <div className="relative w-20 h-16 sm:w-32 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 80px, 128px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title and Price */}
              <div className="flex items-start justify-between mb-1 sm:mb-2">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-lg line-clamp-2 pr-2 leading-tight">
                  {listing.title}
                </h3>
                <div className="text-lg sm:text-xl font-bold text-gray-900 flex-shrink-0 ml-2">
                  {formatPrice(listing.price)}
                </div>
              </div>

              {/* Description - Hidden on mobile */}
              <p className="text-gray-600 text-sm line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-3 hidden sm:block">
                {listing.description}
              </p>

              {/* Info Row */}
              <div className="flex items-center justify-between">
                {/* Left side - Category and Location */}
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 min-w-0 flex-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <CategoryIcon iconKey={category?.id || listing.categoryId} size={14} className="flex-shrink-0" />
                    <span className="truncate">{category?.name || 'Categorie'}</span>
                  </div>
                  <div className="flex items-center gap-1 min-w-0 hidden sm:flex">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{location?.name || 'Locație'}</span>
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  {/* Date - Hidden on mobile */}
                  <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(listing.createdAt)}</span>
                  </div>
                  
                  {/* Views */}
                  {views > 0 && (
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">{views}</span>
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite();
                    }}
                    disabled={isLoading}
                    className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                      isFavorite 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Mobile-only location row */}
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 sm:hidden">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{location?.name || 'Locație'}</span>
                <span className="mx-1">•</span>
                <span>{formatDate(listing.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View (Default)
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

          {/* Featured Badge */}
          {listing.featured && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                Recomandat
              </div>
            </div>
          )}
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

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {listing.description}
          </p>

          {/* Footer Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{location?.name || 'Locație necunoscută'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(listing.createdAt)}</span>
              </div>
              
              {views > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>{views}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
