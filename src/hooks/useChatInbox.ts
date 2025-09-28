'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  QuerySnapshot,
  DocumentData 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Chat {
  id: string;
  participants: string[];
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: Date;
  };
  unreadCount: number;
  otherUser: {
    id: string;
    name: string;
    photoURL?: string;
  };
  updatedAt: Date;
}

interface UseChatInboxReturn {
  chats: Chat[];
  loading: boolean;
  error: string | null;
  unreadTotal: number;
}

export function useChatInbox(userId?: string): UseChatInboxReturn {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadTotal, setUnreadTotal] = useState(0);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    console.log('Setting up chats listener for user:', userId);

    // TODO: Implement real chat system when chats collection is created
    // For now, return mock data to prevent errors
    
    // Mock data for development
    const mockChats: Chat[] = [
      {
        id: 'mock-chat-1',
        participants: [userId, 'other-user-1'],
        lastMessage: {
          text: 'Salut! Mă interesează anunțul tău cu apartamentul.',
          senderId: 'other-user-1',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        unreadCount: 2,
        otherUser: {
          id: 'other-user-1',
          name: 'Maria Popescu',
          photoURL: undefined
        },
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'mock-chat-2',
        participants: [userId, 'other-user-2'],
        lastMessage: {
          text: 'Mulțumesc pentru informații!',
          senderId: userId,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        },
        unreadCount: 0,
        otherUser: {
          id: 'other-user-2',
          name: 'Ion Ionescu',
          photoURL: undefined
        },
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setChats(mockChats);
      setUnreadTotal(mockChats.reduce((sum, chat) => sum + chat.unreadCount, 0));
      setLoading(false);
      console.log(`Loaded ${mockChats.length} mock chats for user ${userId}`);
    }, 500);

    // Real implementation would be:
    /*
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot: QuerySnapshot<DocumentData>) => {
        try {
          const chatsData: Chat[] = [];
          
          for (const doc of snapshot.docs) {
            const data = doc.data();
            
            // Get other participant info
            const otherUserId = data.participants.find((id: string) => id !== userId);
            // TODO: Fetch user data from users collection
            
            chatsData.push({
              id: doc.id,
              participants: data.participants || [],
              lastMessage: {
                text: data.lastMessage?.text || '',
                senderId: data.lastMessage?.senderId || '',
                timestamp: data.lastMessage?.timestamp?.toDate() || new Date()
              },
              unreadCount: data.unreadCounts?.[userId] || 0,
              otherUser: {
                id: otherUserId,
                name: 'Loading...', // TODO: Get from users collection
                photoURL: undefined
              },
              updatedAt: data.updatedAt?.toDate() || new Date()
            });
          }

          const totalUnread = chatsData.reduce((sum, chat) => sum + chat.unreadCount, 0);
          
          setChats(chatsData);
          setUnreadTotal(totalUnread);
          setError(null);
          
          console.log(`Loaded ${chatsData.length} chats for user ${userId}`);
        } catch (err) {
          console.error('Error processing chats snapshot:', err);
          setError('Eroare la încărcarea conversațiilor');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to chats:', err);
        setError('Eroare la conectarea la baza de date');
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up chats listener');
      unsubscribe();
    };
    */

    // Cleanup function for mock
    return () => {
      console.log('Cleaning up mock chats listener');
    };
  }, [userId]);

  return { chats, loading, error, unreadTotal };
}
