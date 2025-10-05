'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Calendar, CheckCircle } from 'lucide-react';
import { getUserById, getUserListingsCount } from '@/server/repo/repoFirebase';
import { User as UserType } from '@/types/models';

interface SellerCardProps {
  sellerId: string;
}

export default function SellerCard({ sellerId }: SellerCardProps) {
  const [seller, setSeller] = useState<UserType | null>(null);
  const [listingsCount, setListingsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSellerData();
  }, [sellerId]);

  const fetchSellerData = async () => {
    try {
      const [sellerData, count] = await Promise.all([
        getUserById(sellerId),
        getUserListingsCount(sellerId)
      ]);
      
      console.log('Seller data:', sellerData); // Debug pentru a vedea ce date primim
      setSeller(sellerData);
      setListingsCount(count);
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMemberSince = (date: Date) => {
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  };

  // Funcție pentru a genera inițialele din nume și prenume
  const getInitials = (seller: UserType) => {
    // Încearcă să obții numele complet din displayName
    const fullName = seller.displayName?.trim();
    
    if (!fullName) {
      // Fallback la email dacă nu avem nume
      return seller.email?.charAt(0)?.toUpperCase() || 'U';
    }

    const nameParts = fullName.split(' ').filter((part: string) => part.length > 0);
    
    if (nameParts.length >= 2) {
      // Prima literă din prenume + prima literă din nume
      return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
    } else if (nameParts.length === 1) {
      // Doar prima literă dacă avem un singur cuvânt
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return 'U'; // Fallback
  };

  // Funcție pentru a obține numele complet
  const getDisplayName = (seller: UserType) => {
    const fullName = seller.displayName?.trim();
    
    if (!fullName) {
      // Încearcă să extragi numele din email
      const emailName = seller.email?.split('@')[0];
      if (emailName) {
        // Capitalizează prima literă și înlocuiește punctele/liniuțele cu spații
        return emailName
          .replace(/[._-]/g, ' ')
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      return 'Utilizator';
    }
    
    return fullName;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border">
        <div className="text-center text-gray-500">
          <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Informații vânzător indisponibile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-100">
      {/* Header with Avatar and Name - Compact */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar - Smaller */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-200 flex-shrink-0">
          {seller.photoURL ? (
            <Image
              src={seller.photoURL}
              alt={`Avatar ${getDisplayName(seller)}`}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-700 font-semibold text-lg">
              {getInitials(seller)}
            </div>
          )}
          
          {/* Verification Badge - Smaller */}
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border border-white">
            <CheckCircle className="h-2.5 w-2.5 text-white" />
          </div>
        </div>

        {/* Name and Member Info - Compact */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-medium text-gray-900 text-base truncate">
              {getDisplayName(seller)}
            </h3>
            <div className="flex items-center gap-0.5 bg-green-50 text-green-600 px-1.5 py-0.5 rounded-md text-xs font-medium">
              <CheckCircle className="h-2.5 w-2.5" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Din {formatMemberSince(seller.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Stats - More Compact */}
      <div className="flex items-center justify-between mb-4 py-2.5 px-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{listingsCount}</div>
          <div className="text-xs text-gray-500">Anunțuri</div>
        </div>
        <div className="w-px h-6 bg-gray-200"></div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">✓</div>
          <div className="text-xs text-gray-500">Verificat</div>
        </div>
      </div>

      {/* Bio - More Compact */}
      {seller.bio && (
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-4">
          {seller.bio}
        </p>
      )}

      {/* Action Button - Smaller */}
      <Link
        href={`/profile/${sellerId}`}
        className="flex items-center justify-center w-full bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 font-medium py-2 px-3 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300 group text-sm"
      >
        <span>Vezi profil</span>
        <svg className="w-3 h-3 ml-1.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
