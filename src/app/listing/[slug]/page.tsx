import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, User, Phone, Mail, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  getListingBySlug, 
  getCategoryById, 
  getLocationById, 
  extractIdFromSlug,
  getListings 
} from '@/server/repo/repoMock';

// ISR - revalidare la 60 secunde
export const revalidate = 60;

interface ListingPageProps {
  params: Promise<{ slug: string }>;
}

// SEO Metadata dinamic
export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  
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
  
  // Încarcă anunțul
  const listing = await getListingBySlug(slug);
  
  if (!listing) {
    notFound();
  }

  // Încarcă datele suplimentare
  const [category, location] = await Promise.all([
    getCategoryById(listing.categoryId),
    getLocationById(listing.locationId),
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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

  // JSON-LD pentru Rich Snippets - Optimizat pentru SEO
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Galerie imagini */}
            <div className="space-y-4">
              {listing.images.length > 0 ? (
                <>
                  <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
                    <Image
                      src={listing.images[0]}
                      alt={`Imagine principală pentru ${listing.title}`}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={90}
                    />
                  </div>
                  
                  {listing.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {listing.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="relative h-20 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`${listing.title} - imagine ${index + 2}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 25vw, 20vw"
                            quality={75}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center" role="img" aria-label="Fără imagini disponibile">
                  <div className="text-center">
                    <div className="text-6xl mb-4" aria-hidden="true">📷</div>
                    <div className="text-gray-500">Fără imagini disponibile</div>
                  </div>
                </div>
              )}
            </div>

            {/* Informații anunț */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {listing.title}
                </h1>
                <div className="text-4xl font-bold text-green-600 mb-4">
                  {formatPrice(listing.price)}
                </div>
                
                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {category && (
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-3 py-1 rounded-full">
                        {category.name}
                      </span>
                    </div>
                  )}
                  
                  {location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{location.name}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(listing.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Descriere */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Descriere</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informații contact
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <User className="h-5 w-5 mr-3" />
                    <span>Utilizator verificat din diaspora</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-3" />
                    <span>Telefon disponibil după contact</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-5 w-5 mr-3" />
                    <span>Email disponibil după contact</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button 
                    className="btn-primary w-full min-h-[44px]"
                    aria-label="Afișează numărul de telefon pentru contact"
                  >
                    <Phone className="h-4 w-4 mr-2" aria-hidden="true" />
                    Afișează numărul de telefon
                  </Button>
                  
                  <Button 
                    className="btn-secondary w-full min-h-[44px]"
                    aria-label="Trimite un mesaj vanzătorului"
                  >
                    <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                    Trimite mesaj
                  </Button>
                  
                  <Button 
                    className="btn-secondary w-full min-h-[44px]"
                    aria-label="Distribuie acest anunț"
                  >
                    <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    Distribuie anunțul
                  </Button>
                </div>
              </div>

              {/* Avertisment siguranță */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ Sfaturi pentru siguranță
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Întâlnește-te în locuri publice</li>
                  <li>• Verifică produsul înainte de plată</li>
                  <li>• Nu trimite bani în avans</li>
                  <li>• Folosește metode de plată sigure</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Anunțuri similare */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Anunțuri similare din {category?.name}
            </h2>
            
            <div className="text-center py-8 text-gray-500">
              <p>Anunțurile similare vor fi afișate aici în versiunea finală.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
