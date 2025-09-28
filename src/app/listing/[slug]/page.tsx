import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Flag } from 'lucide-react';
import { 
  getListingById, 
  getCategoryById, 
  getLocationById,
  incrementViews
} from '@/server/repo/repoFirebase';
import ListingPageClient from '@/components/listing/ListingPageClient';

// ISR - revalidare la 60 secunde
export const revalidate = 60;

interface ListingPageProps {
  params: Promise<{ slug: string }>; // slug is actually the listing ID
}

// SEO Metadata dinamic
export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  // Use slug as ID directly (slug is actually the listing ID)
  const listing = await getListingById(slug);
  
  if (!listing) {
    return {
      title: 'Anunț negăsit - Ai Nostri',
      description: 'Anunțul căutat nu a fost găsit.',
    };
  }

  const category = await getCategoryById(listing.categoryId);
  const location = await getLocationById(listing.locationId);

  return {
    title: `${listing.title} - ${listing.price}€ | Ai Nostri`,
    description: listing.description.substring(0, 160) + '...',
    keywords: `${listing.title}, ${category?.name}, ${location?.name}, anunturi, diaspora romana`,
    openGraph: {
      title: listing.title,
      description: listing.description.substring(0, 160) + '...',
      images: listing.images.length > 0 ? [listing.images[0]] : [],
      type: 'article',
    },
  };
}

// Skeleton Loading Component
function ListingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params;
  
  // Încarcă anunțul (slug is actually the listing ID)
  const listing = await getListingById(slug);
  
  if (!listing) {
    notFound();
  }

  // Încarcă datele suplimentare
  const [category, location] = await Promise.all([
    getCategoryById(listing.categoryId),
    getLocationById(listing.locationId),
  ]);

  // Helper function to safely convert dates
  const safeToISOString = (date: any): string | null => {
    if (!date || date === null || date === undefined) return null;
    
    try {
      // If it's already a Date object
      if (date instanceof Date) {
        return date.toISOString();
      }
      
      // If it's a Firestore Timestamp
      if (date.toDate && typeof date.toDate === 'function') {
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

  // Serialize data for client component (remove Firestore methods)
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

  const serializedCategory = category ? {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    isActive: category.isActive,
    order: category.order,
    createdAt: safeToISOString(category.createdAt),
    updatedAt: safeToISOString(category.updatedAt)
  } : null;

  const serializedLocation = location ? {
    id: location.id,
    name: location.name,
    slug: location.slug,
    isActive: location.isActive,
    order: location.order,
    createdAt: safeToISOString(location.createdAt),
    updatedAt: safeToISOString(location.updatedAt)
  } : null;

  // JSON-LD pentru SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.title,
    description: listing.description,
    image: listing.images,
    category: category?.name,
    brand: {
      '@type': 'Organization',
      name: 'Ai Nostri',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-nostri.vercel.app',
    },
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: 'EUR',
      availability: listing.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-nostri.vercel.app'}/listing/${slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Ai Nostri - Comunitatea românească din Franța',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '1',
    },
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Acasă',
        item: process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-nostri.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category?.name || 'Anunțuri',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-nostri.vercel.app'}/?category=${listing.categoryId}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: listing.title,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-nostri.vercel.app'}/listing/${slug}`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Scripts pentru SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="breadcrumb">
              <li>
                <Link 
                  href="/" 
                  className="text-green-600 hover:text-green-700 focus-ring"
                >
                  Acasă
                </Link>
              </li>
              <li>
                <span className="breadcrumb-separator mx-2" aria-hidden="true">/</span>
                <Link 
                  href={`/?category=${listing.categoryId}`}
                  className="text-green-600 hover:text-green-700 focus-ring"
                >
                  {category?.name || 'Anunțuri'}
                </Link>
              </li>
              <li>
                <span className="breadcrumb-separator mx-2" aria-hidden="true">/</span>
                <span className="text-gray-600" aria-current="page">
                  {listing.title.length > 50 ? `${listing.title.substring(0, 50)}...` : listing.title}
                </span>
              </li>
            </ol>
            
            {/* Back Button */}
            <div className="mt-2">
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors focus-ring"
              >
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                Înapoi la anunțuri
              </Link>
            </div>
          </nav>

          {/* Client Component */}
          <ListingPageClient 
            listing={serializedListing}
            category={serializedCategory}
            location={serializedLocation}
          />
        </div>
      </div>
    </>
  );
}
