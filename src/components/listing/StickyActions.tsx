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
  phone?: string; // Telefonul specific pentru acest anunț
}

export default function StickyActions({ listingId, sellerId, price, title, phone }: StickyActionsProps) {
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
    if (!user?.id) {
      // Redirect to login with return URL
      window.location.href = `/login?next=/listing/${listingId}`;
      return;
    }
    startChat({ sellerId, listingId });
  };

  const handleShowPhone = async () => {
    if (showPhone) return; // Already shown
    setIsLoadingPhone(true);
    
    try {
      // Verifică dacă anunțul are telefon
      if (!phone) {
        console.warn('=== NO PHONE IN LISTING ===');
        console.warn('Listing phone:', phone);
        
        // Încearcă să obții telefonul din profilul vânzătorului ca fallback
        console.log('Trying to get phone from seller profile as fallback...');
        try {
          const sellerData = await getUserById(sellerId);
          console.log('Seller profile data:', sellerData);
          
          if (sellerData?.phone) {
            console.log('Found phone in seller profile:', sellerData.phone);
            setSeller(sellerData);
            setShowPhone(true);
            return;
          }
        } catch (error) {
          console.warn('Error fetching seller profile:', error);
        }
        
        console.warn('No phone found in listing or seller profile');
        
        // Dacă utilizatorul curent este proprietarul anunțului, oferă opțiunea de a adăuga telefonul
        if (user?.id === sellerId) {
          const phoneNumber = prompt('Adaugă numărul tău de telefon pentru acest anunț:');
          if (phoneNumber && phoneNumber.trim()) {
            console.log('User provided phone:', phoneNumber);
            // Simulează că avem telefonul pentru afișare
            setSeller({ ...seller, phone: phoneNumber.trim() } as any);
            setShowPhone(true);
            return;
          }
        }
        
        setShowPhone(false);
        return;
      }

      // Log phone view for analytics (only if user is logged in)
      if (user?.id) {
        try {
          await logEvent({
            listingId,
            userId: user.id,
            type: 'phone_view',
            metadata: { sellerId, phone }
          });
        } catch (error) {
          console.warn('Could not log phone view event:', error);
          // Continue anyway - don't block phone reveal for logging errors
        }
      }
      
      setShowPhone(true);
      console.log('Phone revealed successfully:', phone);
    } catch (error) {
      console.warn('Error revealing phone:', error);
      // Nu afișăm alert, doar logăm eroarea
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
      <div className="lg:sticky lg:top-24 bg-white rounded-xl shadow-lg p-6 border z-10">
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
    <div className="lg:sticky lg:top-24 bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4 z-10">
      {/* Price Display - Compact */}
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 mb-0.5">
          {formatPrice(price)}
        </div>
        <div className="text-xs text-gray-500">Preț fix</div>
      </div>

      {/* Primary Actions - Compact */}
      <div className="space-y-2">
        <button
          onClick={handleContactSeller}
          disabled={isChatLoading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm"
        >
          <MessageCircle className="h-4 w-4" />
          {isChatLoading ? 'Se încarcă...' : user?.id ? 'Contactează' : 'Conectează-te pentru chat'}
        </button>

        <button
          onClick={handleShowPhone}
          disabled={isLoadingPhone || Boolean(showPhone && (phone || seller?.phone))}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm relative overflow-hidden ${
            showPhone && (phone || seller?.phone) 
              ? 'bg-green-50 border border-green-200 text-green-700 cursor-default'
              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border border-blue-200 hover:border-blue-300'
          }`}
        >
          <Phone className="h-4 w-4" />
          {isLoadingPhone ? (
            'Se încarcă...'
          ) : showPhone && (phone || seller?.phone) ? (
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span className="font-medium">Numărul este afișat mai jos</span>
            </div>
          ) : (
            <span>Vezi telefon</span>
          )}
          
        </button>
      </div>

      {/* Secondary Actions - Compact */}
      <div className="flex gap-2">
        <FavoriteButton listingId={listingId} className="flex-1" />
        
        <button
          onClick={handleShare}
          className="flex-1 p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-700 transition-all duration-200 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 hover:border-gray-300"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Distribuie</span>
        </button>
      </div>

      {/* Phone Display - Minimalist */}
      {showPhone && (phone || seller?.phone) && (
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-3">
              📞 Număr de telefon
            </div>
            <div className="font-mono text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-2 rounded border">
              {phone || seller?.phone}
            </div>
            {!phone && seller?.phone && (
              <div className="text-xs text-gray-400 mt-2">
                Din profilul vânzătorului
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trust Badge - Compact */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span>Anunț verificat</span>
        </div>
        
      </div>
    </div>
  );
}
