export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  role?: 'user' | 'admin';
}

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  listingId: string;
  reporterId: string;
  reason: 'spam' | 'inappropriate' | 'fake' | 'duplicate' | 'other';
  details?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  id: string;
  participants: string[];
  listingId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Date;
  };
}

export interface AuditLog {
  id: string;
  listingId: string;
  userId: string;
  type: 'phone_view' | 'report' | 'contact' | 'view';
  metadata?: Record<string, any>;
  createdAt: Date;
}
