'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Calendar } from 'lucide-react';
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
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
      <div className="text-center space-y-4">
        {/* Avatar - Centered */}
        <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-100 ring-4 ring-gray-50">
          {seller.photoURL ? (
            <Image
              src={seller.photoURL}
              alt={`Avatar ${seller.displayName || 'Utilizator'}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 text-green-600">
              <User className="h-10 w-10" />
            </div>
          )}
        </div>

        {/* Seller Info - Centered */}
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">
              {seller.displayName || 'Utilizator'}
            </h3>
            
            {/* Member Since Badge */}
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              <Calendar className="h-4 w-4" />
              <span>Membru din {formatMemberSince(seller.createdAt)}</span>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{listingsCount}</div>
              <div className="text-sm text-gray-500">Anunțuri active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">-</div>
              <div className="text-sm text-gray-500">Vizualizări</div>
            </div>
          </div>

          {/* Bio */}
          {seller.bio && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 px-2">
              {seller.bio}
            </p>
          )}

          {/* View Profile Button */}
          <div className="pt-4">
            <Link
              href={`/profile/${sellerId}`}
              className="inline-flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Vezi profil →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
