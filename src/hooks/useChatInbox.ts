// Custom hook to fetch user's chat inbox from Firestore
import { useState, useEffect } from 'react';
import { getUserChats, ChatWithDetails } from '@/server/repo/messages';

export function useChatInbox(userId?: string) {
  const [chats, setChats] = useState<ChatWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setChats([]);
      setLoading(false);
      return;
    }

    const fetchChats = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use simple fetch instead of real-time subscription to avoid index issues
        const userChats = await getUserChats(userId);
        setChats(userChats);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setError('Eroare la încărcarea conversațiilor');
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
    
    // Refresh chats every 30 seconds as a simple polling mechanism
    const interval = setInterval(fetchChats, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [userId]);

  const unreadTotal = chats.reduce((total, chat) => total + chat.unreadCount, 0);

  return {
    chats,
    loading,
    error,
    unreadTotal
  };
}
