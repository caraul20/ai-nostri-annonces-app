// Messages Repository - Firebase Implementation
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types
export interface Message {
  id?: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'system';
}

export interface Chat {
  id?: string;
  participants: string[]; // [userId1, userId2]
  listingId?: string; // Optional: if chat started from a listing
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatWithDetails extends Chat {
  otherUser: {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
  };
  unreadCount: number;
  messages?: Message[];
}

// CHAT FUNCTIONS
export async function createOrGetChat(userId1: string, userId2: string, listingId?: string): Promise<string> {
  try {
    console.log('Firebase: Creating/getting chat between', userId1, 'and', userId2);
    
    // Check if chat already exists
    const chatsRef = collection(db, 'chats');
    const existingChatQuery = query(
      chatsRef,
      where('participants', 'array-contains', userId1)
    );
    
    const existingChats = await getDocs(existingChatQuery);
    
    for (const chatDoc of existingChats.docs) {
      const chatData = chatDoc.data();
      if (chatData.participants.includes(userId2)) {
        console.log('Firebase: Found existing chat:', chatDoc.id);
        return chatDoc.id;
      }
    }
    
    // Create new chat
    const newChat: Omit<Chat, 'id'> = {
      participants: [userId1, userId2],
      listingId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const chatDocRef = await addDoc(chatsRef, {
      ...newChat,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Firebase: Created new chat:', chatDocRef.id);
    return chatDocRef.id;
  } catch (error) {
    console.error('Error creating/getting chat:', error);
    throw error;
  }
}

export async function getUserChats(userId: string): Promise<ChatWithDetails[]> {
  try {
    console.log('Firebase: Fetching chats for user:', userId);
    
    const chatsRef = collection(db, 'chats');
    // Simplified query without orderBy to avoid index requirement
    const userChatsQuery = query(
      chatsRef,
      where('participants', 'array-contains', userId)
    );
    
    const chatsSnapshot = await getDocs(userChatsQuery);
    const chats: ChatWithDetails[] = [];
    
    for (const chatDoc of chatsSnapshot.docs) {
      const chatData = chatDoc.data();
      const otherUserId = chatData.participants.find((id: string) => id !== userId);
      
      if (!otherUserId) continue;
      
      // Get other user details
      const userDoc = await getDoc(doc(db, 'users', otherUserId));
      const userData = userDoc.data();
      
      if (!userData) continue;
      
      // Get unread count
      const messagesRef = collection(db, 'messages');
      const unreadQuery = query(
        messagesRef,
        where('chatId', '==', chatDoc.id),
        where('receiverId', '==', userId),
        where('read', '==', false)
      );
      const unreadSnapshot = await getDocs(unreadQuery);
      
      const chat: ChatWithDetails = {
        id: chatDoc.id,
        participants: chatData.participants,
        listingId: chatData.listingId,
        lastMessage: chatData.lastMessage ? {
          ...chatData.lastMessage,
          timestamp: chatData.lastMessage.timestamp?.toDate() || new Date()
        } : undefined,
        createdAt: chatData.createdAt?.toDate() || new Date(),
        updatedAt: chatData.updatedAt?.toDate() || new Date(),
        otherUser: {
          id: otherUserId,
          name: userData.name || userData.displayName || 'Utilizator',
          email: userData.email || '',
          photoURL: userData.photoURL
        },
        unreadCount: unreadSnapshot.size
      };
      
      chats.push(chat);
    }
    
    // Sort chats by updatedAt manually
    chats.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    
    return chats;
  } catch (error) {
    console.error('Error fetching user chats:', error);
    throw error;
  }
}

export async function getChatMessages(chatId: string, limitCount: number = 50): Promise<Message[]> {
  try {
    console.log('Firebase: Fetching messages for chat (MOCK):', chatId);
    
    // TEMPORARY: Return mock messages to avoid index issues
    const mockMessages: Message[] = [
      {
        id: 'mock1',
        chatId: chatId,
        senderId: 'user1',
        receiverId: 'user2',
        text: 'Salut! Mă interesează anunțul tău.',
        timestamp: new Date(Date.now() - 60000),
        read: true,
        type: 'text'
      },
      {
        id: 'mock2',
        chatId: chatId,
        senderId: 'user2',
        receiverId: 'user1',
        text: 'Bună! Da, este încă disponibil.',
        timestamp: new Date(),
        read: false,
        type: 'text'
      }
    ];
    
    return mockMessages;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
}

export async function sendMessage(
  chatId: string, 
  senderId: string, 
  receiverId: string, 
  text: string
): Promise<string> {
  try {
    console.log('Firebase: Sending message (MOCK):', text);
    
    // TEMPORARY: Mock message sending to avoid index issues
    // Just return a mock ID
    const mockMessageId = 'mock_' + Date.now();
    
    console.log('Firebase: Message sent (MOCK):', mockMessageId);
    return mockMessageId;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function markMessagesAsRead(chatId: string, userId: string): Promise<void> {
  try {
    console.log('Firebase: Marking messages as read for chat:', chatId, 'user:', userId);
    
    const messagesRef = collection(db, 'messages');
    const unreadQuery = query(
      messagesRef,
      where('chatId', '==', chatId),
      where('receiverId', '==', userId),
      where('read', '==', false)
    );
    
    const unreadSnapshot = await getDocs(unreadQuery);
    
    const updatePromises = unreadSnapshot.docs.map(messageDoc => 
      updateDoc(messageDoc.ref, { read: true })
    );
    
    await Promise.all(updatePromises);
    console.log('Firebase: Marked', unreadSnapshot.size, 'messages as read');
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
}

// REAL-TIME LISTENERS
export function subscribeToUserChats(
  userId: string, 
  callback: (chats: ChatWithDetails[]) => void
): () => void {
  const chatsRef = collection(db, 'chats');
  
  // Simplified query without orderBy to avoid index requirement temporarily
  const userChatsQuery = query(
    chatsRef,
    where('participants', 'array-contains', userId)
  );
  
  return onSnapshot(userChatsQuery, async (snapshot) => {
    try {
      const chats: ChatWithDetails[] = [];
      
      for (const chatDoc of snapshot.docs) {
        const chatData = chatDoc.data();
        const otherUserId = chatData.participants.find((id: string) => id !== userId);
        
        if (!otherUserId) continue;
        
        // Get other user details
        const userDoc = await getDoc(doc(db, 'users', otherUserId));
        const userData = userDoc.data();
        
        if (!userData) continue;
        
        // Get unread count
        const messagesRef = collection(db, 'messages');
        const unreadQuery = query(
          messagesRef,
          where('chatId', '==', chatDoc.id),
          where('receiverId', '==', userId),
          where('read', '==', false)
        );
        const unreadSnapshot = await getDocs(unreadQuery);
        
        const chat: ChatWithDetails = {
          id: chatDoc.id,
          participants: chatData.participants,
          listingId: chatData.listingId,
          lastMessage: chatData.lastMessage ? {
            ...chatData.lastMessage,
            timestamp: chatData.lastMessage.timestamp?.toDate() || new Date()
          } : undefined,
          createdAt: chatData.createdAt?.toDate() || new Date(),
          updatedAt: chatData.updatedAt?.toDate() || new Date(),
          otherUser: {
            id: otherUserId,
            name: userData.name || userData.displayName || 'Utilizator',
            email: userData.email || '',
            photoURL: userData.photoURL
          },
          unreadCount: unreadSnapshot.size
        };
        
        chats.push(chat);
      }
      
      // Sort chats by updatedAt manually (since we removed orderBy)
      chats.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      
      callback(chats);
    } catch (error) {
      console.error('Error in chats subscription:', error);
    }
  });
}

export function subscribeToChatMessages(
  chatId: string,
  callback: (messages: Message[]) => void
): () => void {
  const messagesRef = collection(db, 'messages');
  // TEMPORARY: No where clauses to avoid all index issues
  // Get all messages and filter client-side
  const messagesQuery = query(
    messagesRef,
    limit(100)
  );
  
  return onSnapshot(messagesQuery, (snapshot) => {
    const messages: Message[] = [];
    
    snapshot.forEach((messageDoc) => {
      const messageData = messageDoc.data();
      // Only include messages for this chat (client-side filter)
      if (messageData.chatId === chatId) {
        messages.push({
          id: messageDoc.id,
          chatId: messageData.chatId,
          senderId: messageData.senderId,
          receiverId: messageData.receiverId,
          text: messageData.text,
          timestamp: messageData.timestamp?.toDate() || new Date(),
          read: messageData.read || false,
          type: messageData.type || 'text'
        });
      }
    });
    
    // Sort manually by timestamp (since we removed orderBy)
    messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    callback(messages);
  });
}
