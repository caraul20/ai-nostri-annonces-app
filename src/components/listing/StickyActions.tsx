'use client';

import { useState } from 'react';
import { Phone, MessageCircle, Share2, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { getUserById, logEvent } from '@/server/repo/repoFirebase';
import FavoriteButton from './FavoriteButton';
import { User } from '@/types/models';

interface StickyActionsProps {
  listingId: string;
  sellerId: string;
  price: number;
  title: string;
}

export default function StickyActions({ listingId, sellerId, price, title }: StickyActionsProps) {
  const { user } = useAuth();
  const { startChat, isLoading: isChatLoading } = useChat();
  const [seller, setSeller] = useState<User | null>(null);
  const [showPhone, setShowPhone] = useState(false);
  const [isLoadingPhone, setIsLoadingPhone] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleContactSeller = () => {
    startChat({ sellerId, listingId });
  };

  const handleShowPhone = async () => {
    if (!user?.id) {
      window.location.href = `/login?next=/listing/${listingId}`;
      return;
    }

    if (showPhone) return; // Already shown

    setIsLoadingPhone(true);
    try {
      // Fetch seller data to get phone
      const sellerData = await getUserById(sellerId);
      setSeller(sellerData);
      setShowPhone(true);

      // Log phone view event
      await logEvent({
        listingId,
        userId: user.id,
        type: 'phone_view',
        metadata: { sellerId }
      });
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
          title: title,
          text: `Verifică acest anunț: ${title}`,
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

  // Don't show actions for own listing
  if (user?.id === sellerId) {
    return (
      <div className="lg:sticky lg:top-24 bg-white rounded-xl shadow-lg p-6 border">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {formatPrice(price)}
          </div>
          <p className="text-gray-600 text-sm">Acesta este anunțul tău</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:sticky lg:top-24 bg-white border border-gray-200 p-6 space-y-4">
      {/* Simple Price Display */}
      <div className="text-center pb-4 border-b border-gray-200">
        <div className="text-3xl font-bold text-green-600">
          {formatPrice(price)}
        </div>
      </div>

      {/* Simple Actions */}
      <div className="space-y-3">
        <button
          onClick={handleContactSeller}
          disabled={isChatLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 font-medium transition-colors disabled:opacity-50"
        >
          {isChatLoading ? 'Se încarcă...' : 'Contactează vânzătorul'}
        </button>

        <button
          onClick={handleShowPhone}
          disabled={isLoadingPhone}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 font-medium transition-colors disabled:opacity-50"
        >
          {isLoadingPhone ? (
            'Se încarcă...'
          ) : showPhone && seller?.phone ? (
            seller.phone
          ) : (
            'Afișează telefonul'
          )}
        </button>
      </div>

      {/* Simple Secondary Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <FavoriteButton listingId={listingId} className="flex-1" />
        
        <button
          onClick={handleShare}
          className="flex-1 p-3 border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          <span className="text-sm">Distribuie</span>
        </button>
      </div>

      {/* Simple Phone Display */}
      {showPhone && seller?.phone && (
        <div className="bg-blue-50 border border-blue-200 p-3 text-center">
          <div className="text-sm text-blue-700 mb-1">Telefon:</div>
          <div className="font-mono text-lg font-bold text-blue-900">
            {seller.phone}
          </div>
        </div>
      )}
    </div>
  );
}
