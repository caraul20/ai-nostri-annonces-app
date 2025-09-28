'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Loader2 } from 'lucide-react';
import { createOrGetChat } from '@/server/repo/messages';

interface ContactButtonProps {
  listingId: string;
  sellerId: string;
  sellerName: string;
  listingTitle: string;
  className?: string;
}

export default function ContactButton({ 
  listingId, 
  sellerId, 
  sellerName, 
  listingTitle,
  className = '' 
}: ContactButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const handleContact = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.id === sellerId) {
      alert('Nu poți să îți contactezi propriul anunț!');
      return;
    }

    setIsCreatingChat(true);

    try {
      // Create or get existing chat
      const chatId = await createOrGetChat(user.id, sellerId, listingId);
      
      // Navigate to messages with the chat selected
      router.push(`/messages?chat=${chatId}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      alert('Eroare la crearea conversației. Încearcă din nou.');
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <button
      onClick={handleContact}
      disabled={isCreatingChat}
      className={`btn-primary flex items-center justify-center space-x-2 ${className}`}
    >
      {isCreatingChat ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Se conectează...</span>
        </>
      ) : (
        <>
          <MessageCircle className="h-4 w-4" />
          <span>Contactează</span>
        </>
      )}
    </button>
  );
}
