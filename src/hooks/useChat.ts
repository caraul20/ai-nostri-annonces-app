'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getOrCreateChat, logEvent } from '@/server/repo/repoFirebase';

export function useChat() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const startChat = async ({
    sellerId,
    listingId
  }: {
    sellerId: string;
    listingId: string;
  }) => {
    if (!user?.id) {
      // Redirect to login
      router.push(`/login?next=/listing/${listingId}`);
      return;
    }

    if (user.id === sellerId) {
      // Can't chat with yourself
      return;
    }

    setIsLoading(true);
    try {
      const chatId = await getOrCreateChat({
        buyerId: user.id,
        sellerId,
        listingId
      });

      // Log contact event
      await logEvent({
        listingId,
        userId: user.id,
        type: 'contact',
        metadata: { sellerId, chatId }
      });

      // Navigate to chat
      router.push(`/messages/${chatId}`);
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startChat,
    isLoading,
    isAuthenticated: !!user
  };
}
