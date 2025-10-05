'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Tag, Calendar, Heart, Eye, Camera, Bed, Bath, ChefHat, Square } from 'lucide-react';
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
import ContactButton from '@/components/ContactButton';
import { useFavorite } from '@/hooks/useFavorite';
import { useListingStats } from '@/hooks/useListingStats';

interface AdCardProps {
  listing: SerializedListing;
  category?: SerializedCategory | null;
  location?: SerializedLocation | null;
}

export default function AdCard({ listing, category, location }: AdCardProps) {
  const { isFavorite, isLoading, toggleFavorite } = useFavorite(listing.id || '');
  const { views, favorites, isLoading: statsLoading } = useListingStats(listing.id || '');
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

  return (
    <Link href={`/listing/${listing.id}`} className="h-full">
      {/* Desktop Design - păstrează designul actual */}
      <div className="hidden md:flex md:flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 group h-full">
        {/* Image */}
        <div className="relative h-48 bg-gray-100">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <Camera className="w-8 h-8 text-gray-400 mb-2 mx-auto" />
                <div className="text-sm text-gray-500">Fără imagine</div>
              </div>
            </div>
          )}
          
          {/* Favorite Button - Top Right */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite();
            }}
            disabled={isLoading}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-600'
            } shadow-sm hover:shadow-md disabled:opacity-50`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content - Ce vrea clientul să vadă */}
        <div className="p-4 flex flex-col flex-1">
          {/* Titlu - Ce vinde */}
          <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight line-clamp-2 group-hover:text-green-600 transition-colors">
            {listing.title}
          </h3>
          
          {/* Preț - Cât costă */}
          <div className="text-xl font-bold text-green-600 mb-3">
            {formatPrice(listing.price)}
          </div>

          {/* Scurt preview din descriere - Ce este */}
          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {listing.description}
          </p>

          {/* Info esențială - Unde și când */}
          <div className="mt-auto space-y-1 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{location?.name || 'Locație'}</span>
              </div>
              <span>{formatDate(listing.createdAt)}</span>
            </div>
            
            {/* Statistici reale - Vizualizări și Favorite */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                <span>{category?.name || 'Categorie'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                {views > 0 && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{views}</span>
                  </div>
                )}
                {favorites > 0 && (
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{favorites}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Design - EXACT ca în imagine */}
      <div className="md:hidden bg-white border border-gray-200 overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <Camera className="w-8 h-8 text-gray-400 mb-2 mx-auto" />
                <div className="text-sm text-gray-500">Fără imagine</div>
              </div>
            </div>
          )}
          
          {/* Heart icon - top right */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite();
            }}
            disabled={isLoading}
            className="absolute top-3 right-3"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-50 text-red-600' 
                : 'bg-white/90 text-gray-600 hover:text-red-600'
            }`}>
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </div>
          </button>
        </div>

        {/* Content - EXACT layout din imagine */}
        <div className="p-3">
          {/* Address line - mic, gri */}
          <div className="text-xs text-gray-500 mb-1">
            {location?.name || 'Locație necunoscută'}
          </div>
          
          {/* Bedrooms/Bathrooms info */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              <Bed className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600">3 Camere</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600">2 Băi</span>
            </div>
          </div>
          
          {/* Title - bold, 2 lines max */}
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-2">
            {listing.title}
          </h3>
          
          {/* Property details - small text */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Square className="w-3 h-3 text-gray-400" />
              <span>89 m²</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="w-3 h-3 text-gray-400" />
              <span>1 Bucătărie</span>
            </div>
          </div>
          
          {/* Price - mare, bold */}
          <div className="text-xl font-bold text-gray-900 mb-3">
            {formatPrice(listing.price)}
          </div>
          
          {/* Contact button - verde, full width */}
          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 text-sm font-medium transition-colors">
            Contactează Vânzătorul
          </button>
        </div>
      </div>
    </Link>
  );
}
