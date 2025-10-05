'use client';

import { useState, useEffect } from 'react';
import { Flag, Heart, Share2, MapPin, Calendar, Eye, Tag } from 'lucide-react';
import { incrementViews, getUserById, logEvent } from '@/server/repo/repoFirebase';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { useFavorite } from '@/hooks/useFavorite';
import ListingGallery from '@/components/listing/ListingGallery';
import ListingSidebar from '@/components/listing/ListingSidebar';
import ReportDialog from '@/components/listing/ReportDialog';
import SimilarListings from '@/components/listing/SimilarListings';
import CustomFieldsDisplay from '@/components/listing/CustomFieldsDisplay';
import { User } from '@/types/models';
// Serialized types for client component
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
  customFields?: { [key: string]: any };
}

interface SerializedCategory {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: string | null;
  updatedAt: string | null;
}

interface SerializedLocation {
  id?: string;
  name: string;
  slug: string;
  isActive: boolean;
  order: number;
  createdAt: string | null;
  updatedAt: string | null;
}

interface ListingPageClientProps {
  listing: SerializedListing;
  category: SerializedCategory | null;
  location: SerializedLocation | null;
}

export default function ListingPageClient({ 
  listing, 
  category, 
  location 
}: ListingPageClientProps) {
  const { user } = useAuth();
  const { startChat, isLoading: isChatLoading } = useChat();
  const { isFavorite, isLoading: isFavoriteLoading, toggleFavorite } = useFavorite(listing.id!);
  
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [seller, setSeller] = useState<User | null>(null);
  const [showPhone, setShowPhone] = useState(false);
  const [isLoadingPhone, setIsLoadingPhone] = useState(false);

  // Increment views on mount
  useEffect(() => {
    if (listing.id) {
      incrementViews(listing.id);
    }
  }, [listing.id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    try {
      const dateObj = new Date(dateString);
      return new Intl.DateTimeFormat('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj);
    } catch (error) {
      return '';
    }
  };

  const handleShowPhone = async () => {
    if (showPhone) return; // Already shown

    setIsLoadingPhone(true);
    try {
      // Fetch seller data to get phone
      const sellerData = await getUserById(listing.userId);
      setSeller(sellerData);
      setShowPhone(true);

      // Log phone view event (only if user is logged in)
      if (user?.id) {
        await logEvent({
          listingId: listing.id!,
          userId: user.id,
          type: 'phone_view',
          metadata: { sellerId: listing.userId }
        });
      }
    } catch (error) {
      console.error('Error showing phone:', error);
    } finally {
      setIsLoadingPhone(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Verifică acest anunț: ${listing.title}`,
          url: url,
        });
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // TODO: Show toast notification
      console.log('Link copiat în clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      {/* Main Content - Left Side */}
      <div className="lg:col-span-2 space-y-8">
        {/* Gallery */}
        <ListingGallery images={listing.images} title={listing.title} />

        {/* Title & Price - Clean Minimalist */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {listing.title}
          </h1>
          
          <div className="text-4xl font-bold text-gray-900">
            {new Intl.NumberFormat('ro-RO', {
              style: 'currency',
              currency: 'EUR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(listing.price)}
          </div>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>{category?.name || 'Categorie necunoscută'}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location?.name || 'Locație necunoscută'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Publicat {formatDate(listing.createdAt)}</span>
            </div>
            {listing.views && listing.views > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{listing.views} vizualizări</span>
              </div>
            )}
          </div>
        </div>

        {/* Description - Clean Minimalist */}
        <div className="py-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Descriere
          </h2>
          <div className="relative">
            <p className={`text-gray-700 leading-relaxed whitespace-pre-wrap ${
              !isDescriptionExpanded && listing.description.length > 300
                ? 'line-clamp-4'
                : ''
            }`}>
              {listing.description}
            </p>
            
            {/* Show More/Less Button */}
            {listing.description.length > 300 && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-gray-600 hover:text-gray-900 text-sm mt-2 underline"
              >
                {isDescriptionExpanded ? 'Vezi mai puțin' : 'Vezi mai mult'}
              </button>
            )}
          </div>
          
          {/* Report Button - Very Discrete */}
          <button
            onClick={() => setIsReportDialogOpen(true)}
            className="text-xs text-gray-400 hover:text-red-500 mt-6 underline"
          >
            Raportează anunțul
          </button>
        </div>

        {/* Custom Fields Display */}
        {listing.customFields && Object.keys(listing.customFields).length > 0 && (
          <div className="py-8 border-t border-gray-200">
            <CustomFieldsDisplay 
              customFields={listing.customFields}
              categoryId={listing.categoryId}
            />
          </div>
        )}

        {/* Similar Listings */}
        <div className="mt-12">
          <SimilarListings
            categoryId={listing.categoryId}
            locationId={listing.locationId}
            excludeId={listing.id!}
          />
        </div>
      </div>

      {/* Sidebar - Desktop Only */}
      <div className="lg:col-span-1 hidden lg:block">
        <div className="lg:sticky lg:top-24">
          <ListingSidebar
            listingId={listing.id!}
            sellerId={listing.userId}
            price={listing.price}
            title={listing.title}
          />
        </div>
      </div>

      {/* Mobile Actions - Below content, no price repetition */}
      <div className="lg:hidden mt-8">
        <div className="bg-white border-t border-gray-200 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => startChat({ sellerId: listing.userId, listingId: listing.id! })}
              disabled={isChatLoading}
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 font-medium transition-colors disabled:opacity-50"
            >
              {isChatLoading ? 'Se încarcă...' : 'Contactează'}
            </button>
            <button 
              onClick={handleShowPhone}
              disabled={isLoadingPhone}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 font-medium transition-colors disabled:opacity-50"
            >
              {isLoadingPhone ? (
                'Se încarcă...'
              ) : showPhone && seller?.phone ? (
                seller.phone
              ) : (
                'Afișează telefon'
              )}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={toggleFavorite}
              disabled={isFavoriteLoading}
              className={`border py-2 px-4 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                isFavorite
                  ? 'border-red-300 text-red-600 bg-red-50'
                  : 'border-gray-200 text-gray-600 hover:text-red-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Favorit' : 'Favorite'}
            </button>
            <button 
              onClick={handleShare}
              className="border border-gray-200 text-gray-600 py-2 px-4 transition-colors flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Share2 className="w-4 h-4" />
              Distribuie
            </button>
          </div>
          
          {/* Phone Display - Mobile */}
          {showPhone && seller?.phone && (
            <div className="bg-blue-50 border border-blue-200 p-3 text-center">
              <div className="text-sm text-blue-700 mb-1">Telefon:</div>
              <div className="font-mono text-lg font-bold text-blue-900">
                {seller.phone}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Dialog */}
      <ReportDialog
        listingId={listing.id!}
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
      />
    </div>
  );
}
