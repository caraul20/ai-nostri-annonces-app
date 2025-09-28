import { Metadata } from 'next';
import { getListings, getCategories, getLocations, getCategoryById, getLocationById } from '@/server/repo/repoFirebase';
import AdCard from '@/components/AdCard';
import { Button } from '@/components/ui/button';
import SearchFilters from '@/components/SearchFilters';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Package, ArrowRight } from 'lucide-react';
import { AdGridSkeleton } from '@/components/SkeletonLoader';
import EmptyState, { NoSearchResults, NoListingsInCategory, NoListingsInLocation } from '@/components/EmptyState';
import { Suspense } from 'react';

// ISR - revalidare la 60 secunde
export const revalidate = 60;

// SEO Metadata dinamic
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Ai Nostri - Anunțuri pentru românii și moldovenii din Franța',
    description: 'Platforma de anunțuri dedicată comunității românești și moldovenești din Franța. Găsește și publică anunțuri în limba română.',
    keywords: 'anunturi, romani franta, moldoveni franta, clasificate, diaspora, comunitate',
    openGraph: {
      title: 'Ai Nostri - Comunitatea românească din Franța',
      description: 'Platforma de anunțuri pentru diaspora românească și moldovenească',
      type: 'website',
    },
  };
}

interface SearchParams { 
  q?: string;
  category?: string;
  location?: string;
  min?: string;
  max?: string;
  page?: string;
}

type HomePageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  // Await the promise-based searchParams in Next.js 15
  const sp = await searchParams;

  // Construire les filtres à partir des paramètres de recherche
  const filters = {
    q: sp.q,
    categoryId: sp.category,
    locationId: sp.location,
    minPrice: sp.min ? parseInt(sp.min) : undefined,
    maxPrice: sp.max ? parseInt(sp.max) : undefined,
    page: sp.page ? parseInt(sp.page) : 1,
  };

  // Charger les données en parallèle
  const [listingsResult, categories, locations] = await Promise.all([
    getListings(filters),
    getCategories(),
    getLocations(),
  ]);

  // Enrichir les listings avec les données de catégorie et localisation
  const enrichedListings = await Promise.all(
    listingsResult.listings.map(async (listing) => {
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
      
      // Serialize listing data for client component
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
      
      // Serialize category data
      const serializedCategory = category ? {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: category.isActive,
        order: category.order
      } : null;
      
      // Serialize location data
      const serializedLocation = location ? {
        id: location.id,
        name: location.name,
        slug: location.slug,
        isActive: location.isActive,
        order: location.order
      } : null;
      
      return { 
        listing: serializedListing, 
        category: serializedCategory, 
        location: serializedLocation 
      };
    })
  );

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600/70 via-yellow-500/60 to-orange-500/80 py-20 relative overflow-hidden min-h-[600px]">
        {/* Imagine de fundal optimizată pentru LCP */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2089&q=80"
            alt="Oameni care se țin de mână - unire și prietenie în comunitatea românească"
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
            quality={85}
          />
        </div>
        
        {/* Overlay pentru contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black/10 to-orange-900/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Header Text */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Bun venit la <span className="text-yellow-300">Ai Nostri</span>
            </h1>
            <p className="text-xl text-green-100 mb-4 max-w-3xl mx-auto">
              Platforma de anunțuri pentru <span className="text-yellow-200 font-semibold">românii și moldovenii din Franța</span>
            </p>
            <p className="text-lg text-green-200 mb-8 max-w-2xl mx-auto">
              🇷🇴 🇲🇩 Comunitatea noastră în limba română 🇫🇷
            </p>
            
            {/* Link către pagina de publicare */}
            <div className="mb-8">
              <Link href="/new">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  <Plus className="h-5 w-5 mr-2" />
                  Publică un anunț gratuit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Filters - Elegant Integration */}
      <SearchFilters categories={categories} locations={locations} />

      {/* Secțiunea de anunțuri - layout compact */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Cele mai noi anunțuri ({listingsResult.total})
            </h2>
            <Link href="/" className="text-sm text-gray-600 hover:text-green-600">
              Vezi toate anunțurile →
            </Link>
          </div>

          {sp.q && (
            <div className="mb-6 text-sm text-gray-600 bg-green-50 px-4 py-2 rounded-full inline-block border border-green-200">
              Rezultate pentru: <span className="font-semibold text-green-600">"{sp.q}"</span>
            </div>
          )}

          {enrichedListings.length > 0 ? (
            <>
              <div className="grid-responsive" role="main" aria-label="Lista de anunțuri">
                {enrichedListings.map(({ listing, category, location }) => (
                  <AdCard
                    key={listing.id}
                    listing={listing}
                    category={category}
                    location={location}
                  />
                ))}
              </div>

              {/* Paginare */}
              {(filters.page > 1 || listingsResult.hasMore) && (
                <div className="mt-12 flex justify-center items-center space-x-4">
                  {filters.page > 1 && (
                    <Link 
                      href={`/?${new URLSearchParams({...sp, page: (filters.page - 1).toString()}).toString()}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      ← Precedenta
                    </Link>
                  )}
                  
                  <span className="text-gray-600">
                    Pagina {filters.page} • {listingsResult.total} anunțuri
                  </span>
                  
                  {listingsResult.hasMore && (
                    <Link 
                      href={`/?${new URLSearchParams({...sp, page: (filters.page + 1).toString()}).toString()}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Următoarea →
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div role="main">
              {sp.q ? (
                <NoSearchResults query={sp.q} />
              ) : sp.category ? (
                <NoListingsInCategory categoryName="categoria selectată" />
              ) : sp.location ? (
                <NoListingsInLocation locationName="locația selectată" />
              ) : (
                <EmptyState type="no-listings" />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Section categorii populare */}
      <section className="py-16 bg-gray-50" aria-labelledby="categories-heading">
        <div className="container-custom">
          <header className="text-center mb-12">
            <h2 id="categories-heading" className="text-3xl font-bold text-gray-900 mb-4">
              Categorii populare în diaspora
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-balance">
              Cele mai căutate categorii de anunțuri în comunitatea românească și moldovenească din Franța
            </p>
          </header>

          <nav aria-label="Categorii de anunțuri">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.slice(0, 6).map((category, index) => {
                const icons = ['🏠', '🚗', '📱', '🪑', '👕', '⚽'];
                const iconLabels = ['Imobiliare', 'Vehicule', 'Electronice', 'Mobilier', 'Îmbrăcăminte', 'Sport'];
                return (
                  <Link
                    key={category.id}
                    href={`/?category=${category.id}`}
                    className="card p-6 text-center group focus-ring"
                    aria-label={`Explorează categoria ${category.name}`}
                  >
                    <div 
                      className="text-4xl mb-3" 
                      role="img" 
                      aria-label={iconLabels[index]}
                    >
                      {icons[index]}
                    </div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Pentru diaspora
                    </p>
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-4 w-4 mx-auto text-green-600" aria-hidden="true" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}
