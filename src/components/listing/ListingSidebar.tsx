'use client';

import StickyActions from './StickyActions';
import SellerCard from './SellerCard';
import SafetyTips from './SafetyTips';

interface ListingSidebarProps {
  listingId: string;
  sellerId: string;
  price: number;
  title: string;
}

export default function ListingSidebar({ 
  listingId, 
  sellerId, 
  price, 
  title 
}: ListingSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Card Preț + Acțiuni */}
      <StickyActions
        listingId={listingId}
        sellerId={sellerId}
        price={price}
        title={title}
      />
      
      {/* Card Vânzător */}
      <SellerCard sellerId={sellerId} />
      
      {/* Sfaturi de siguranță */}
      <SafetyTips />
    </div>
  );
}
