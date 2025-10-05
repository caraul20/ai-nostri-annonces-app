'use client';

import { useState, useEffect } from 'react';
import AdCard from '@/components/AdCard';
import AdCardNew from '@/components/AdCardNew';
import ViewToggle, { ViewType } from '@/components/ui/ViewToggle';
import Link from 'next/link';

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

interface EnrichedListing {
  listing: SerializedListing;
  category: SerializedCategory | null;
  location: SerializedLocation | null;
}

interface ListingsSectionProps {
  enrichedListings: EnrichedListing[];
  total: number;
  searchQuery?: string;
}

export default function ListingsSection({ 
  enrichedListings, 
  total, 
  searchQuery 
}: ListingsSectionProps) {
  const [viewType, setViewType] = useState<ViewType>('grid');

  // Load saved view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('listings-view-type') as ViewType;
    if (savedView && (savedView === 'grid' || savedView === 'list')) {
      setViewType(savedView);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewChange = (newView: ViewType) => {
    setViewType(newView);
    localStorage.setItem('listings-view-type', newView);
  };

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Cele mai noi anunțuri ({total})
          </h2>
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-600 bg-green-50 px-4 py-2 rounded-full inline-block border border-green-200">
              Rezultate pentru: <span className="font-semibold text-green-600">"{searchQuery}"</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-green-600 hidden sm:block">
            Vezi toate anunțurile →
          </Link>
          <ViewToggle 
            currentView={viewType} 
            onViewChange={handleViewChange}
          />
        </div>
      </div>

      {/* Listings Grid/List */}
      {enrichedListings.length > 0 ? (
        <div 
          className={
            viewType === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }
          role="main" 
          aria-label="Lista de anunțuri"
        >
          {enrichedListings.map(({ listing, category, location }) => (
            <AdCardNew
              key={listing.id}
              listing={listing}
              category={category}
              location={location}
              viewType={viewType}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nu au fost găsite anunțuri</p>
        </div>
      )}
    </div>
  );
}
