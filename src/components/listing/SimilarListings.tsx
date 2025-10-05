'use client';

import { useState, useEffect } from 'react';
import { getSimilarListings, getCategoryById, getLocationById } from '@/server/repo/repoFirebase';
import { Listing } from '@/server/repo/repoFirebase';
import AdCardNew from '@/components/AdCardNew';
import SimilarListingCard from '@/components/listing/SimilarListingCard';

// Serialized listing type for AdCard
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

interface EnrichedListing {
  listing: SerializedListing;
  category: any;
  location: any;
}

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
  const [enrichedListings, setEnrichedListings] = useState<EnrichedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSimilarListings();
  }, [categoryId, locationId, excludeId]);

  const fetchSimilarListings = async () => {
    try {
      console.log('Fetching similar listings for:', { categoryId, locationId, excludeId });
      
      const similarListings = await getSimilarListings({
        categoryId,
        locationId,
        excludeId,
        limit
      });
      
      console.log('Got similar listings:', similarListings.length);
      
      if (similarListings.length === 0) {
        console.log('No similar listings found');
        setEnrichedListings([]);
        setIsLoading(false);
        return;
      }
      
      // Enrich listings with category and location data
      const enrichedData = await Promise.all(
        similarListings.map(async (listing) => {
          const [category, location] = await Promise.all([
            getCategoryById(listing.categoryId),
            getLocationById(listing.locationId)
          ]);
          
          // Helper function to safely convert dates
          const safeToISOString = (date: any): string | null => {
            if (!date || date === null || date === undefined) return null;
            
            try {
              // If it's already a Date object
              if (date instanceof Date) {
                return isNaN(date.getTime()) ? null : date.toISOString();
              }
              
              // If it's a Firestore Timestamp
              if (date && typeof date.toDate === 'function') {
                return date.toDate().toISOString();
              }
              
              // If it's a string or number, try to create a Date
              const dateObj = new Date(date);
              if (isNaN(dateObj.getTime())) {
                return null; // Invalid date
              }
              
              return dateObj.toISOString();
            } catch (error) {
              console.warn('Error converting date:', date, error);
              return null;
            }
          };

          const serializedListing = {
            id: listing.id,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            images: listing.images,
            categoryId: listing.categoryId,
            locationId: listing.locationId,
            userId: listing.userId,
            status: listing.status,
            slug: listing.slug,
            createdAt: safeToISOString(listing.createdAt),
            updatedAt: safeToISOString(listing.updatedAt),
            views: listing.views || 0,
            featured: listing.featured || false,
            expiresAt: safeToISOString(listing.expiresAt)
          };
          
          return {
            listing: serializedListing,
            category,
            location
          };
        })
      );
      
      console.log('Enriched listings:', enrichedData.length);
      setEnrichedListings(enrichedData);
    } catch (error) {
      console.error('Error fetching similar listings:', error);
      setEnrichedListings([]);
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

  if (enrichedListings.length === 0) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">Anunțuri similare</h2>
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="text-7xl mb-6 opacity-60">
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Nu am găsit anunțuri similare
          </h3>
          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            Încearcă să cauți în alte categorii sau locații pentru a găsi oferte interesante.
          </p>
          <div className="mt-4 text-sm text-gray-400">
            Debug: categoryId={categoryId}, locationId={locationId}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Anunțuri similare
        </h2>
        <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 sm:px-3 rounded-full font-medium">
          {enrichedListings.length}
        </span>
      </div>
      
      {/* Mobile: Horizontal Scroll with Compact Cards */}
      <div className="block sm:hidden">
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {enrichedListings.map(({ listing, category, location }) => (
            <div key={listing.id} className="flex-shrink-0 w-48">
              <SimilarListingCard 
                listing={listing} 
                category={category}
                location={location}
                compact={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {enrichedListings.map(({ listing, category, location }) => (
          <div key={listing.id} className="transform hover:scale-[1.02] transition-transform duration-200">
            <SimilarListingCard 
              listing={listing} 
              category={category}
              location={location}
              compact={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
