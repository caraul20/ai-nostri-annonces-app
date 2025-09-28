import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Tag, Calendar } from 'lucide-react';
import { Listing, Category, Location } from '@/server/repo/repoMock';

interface AdCardProps {
  listing: Listing;
  category?: Category | null;
  location?: Location | null;
}

export default function AdCard({ listing, category, location }: AdCardProps) {
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
      // Firestore Timestamp
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return '';
    }
    
    // Folosim o dată fixă pentru a evita diferențele server/client
    const now = new Date('2024-01-01'); // Dată fixă pentru consistență
    const daysDiff = Math.ceil((dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= -3 && daysDiff <= 0) {
      return 'Recent';
    } else if (daysDiff > 0) {
      return `În ${daysDiff} zile`;
    } else {
      return `Acum ${Math.abs(daysDiff)} zile`;
    }
  };

  const mainImage = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : null;

  return (
    <Link href={`/listing/${listing.slug || listing.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 group">
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
                <div className="text-4xl mb-2">📷</div>
                <div className="text-sm text-gray-500">Fără imagine</div>
              </div>
            </div>
          )}
          
          {/* Badge pentru anunțuri noi - static pentru a evita hydration issues */}
          {listing.id && ['1', '2', '3'].includes(listing.id) && (
            <div className="absolute top-2 left-2">
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                NOU
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-800 mb-2 text-sm leading-tight line-clamp-2 group-hover:text-green-600 transition-colors">
            {listing.title}
          </h3>

          {/* Price */}
          <div className="mb-3">
            <span className="text-lg font-bold text-green-600">
              {formatPrice(listing.price)}
            </span>
          </div>

          {/* Meta info */}
          <div className="space-y-1 text-xs text-gray-500">
            {category && (
              <div className="flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                <span>{category.name}</span>
              </div>
            )}
            
            {location && (
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{location.name}</span>
              </div>
            )}
            
            {listing.createdAt && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDate(listing.createdAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
