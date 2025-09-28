'use client';

import { useState, useEffect } from 'react';
import { Flag } from 'lucide-react';
import { incrementViews } from '@/server/repo/repoFirebase';
import ListingGallery from '@/components/listing/ListingGallery';
import StickyActions from '@/components/listing/StickyActions';
import SellerCard from '@/components/listing/SellerCard';
import ReportDialog from '@/components/listing/ReportDialog';
import SimilarListings from '@/components/listing/SimilarListings';
import { Listing, Category, Location } from '@/server/repo/repoFirebase';

interface ListingPageClientProps {
  listing: Listing;
  category: Category | null;
  location: Location | null;
}

export default function ListingPageClient({ 
  listing, 
  category, 
  location 
}: ListingPageClientProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  // Increment views on mount
  useEffect(() => {
    if (listing.id) {
      incrementViews(listing.id);
    }
  }, [listing.id]);

  const formatDate = (date: any) => {
    if (!date) return '';
    
    let dateObj: Date;
    if (date.toDate) {
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return '';
    }
    
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Left Side */}
      <div className="lg:col-span-2 space-y-8">
        {/* Gallery */}
        <ListingGallery images={listing.images} title={listing.title} />

        {/* Listing Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 border">
          <div className="space-y-6">
            {/* Title and Meta */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {listing.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    📂
                  </div>
                  <span>{category?.name || 'Categorie necunoscută'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    📍
                  </div>
                  <span>{location?.name || 'Locație necunoscută'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    📅
                  </div>
                  <span>Publicat {formatDate(listing.createdAt)}</span>
                </div>

                {listing.views && listing.views > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      👁️
                    </div>
                    <span>{listing.views} vizualizări</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Descriere
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Report Button */}
            <div className="pt-4 border-t">
              <button
                onClick={() => setIsReportDialogOpen(true)}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
              >
                <Flag className="h-4 w-4" />
                Raportează anunțul
              </button>
            </div>
          </div>
        </div>

        {/* Seller Card */}
        <SellerCard sellerId={listing.userId} />

        {/* Similar Listings */}
        <SimilarListings
          categoryId={listing.categoryId}
          locationId={listing.locationId}
          excludeId={listing.id!}
        />
      </div>

      {/* Sidebar - Right Side */}
      <div className="lg:col-span-1">
        <StickyActions
          listingId={listing.id!}
          sellerId={listing.userId}
          price={listing.price}
          title={listing.title}
        />
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
