// Firebase Repository - AI NOSTRI PWA
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  DocumentSnapshot,
  serverTimestamp,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { User, Favorite, Report, Chat, AuditLog } from '@/types/models';

// Types
export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Location {
  id?: string;
  name: string;
  slug: string;
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Listing {
  id?: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  locationId: string;
  images: string[];
  userId: string;
  phone?: string; // Numărul de telefon specific pentru acest anunț
  status: 'active' | 'inactive' | 'sold' | 'hidden' | 'deleted';
  slug?: string;
  createdAt: Date;
  updatedAt: Date;
  views?: number;
  featured?: boolean;
  expiresAt?: Date;
  customFields?: { [key: string]: any };
}

export interface ListingFilters {
  q?: string;
  categoryId?: string;
  locationId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

// Utility function to create slug
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Convert Firestore timestamp to Date
function convertTimestamp(timestamp: any): Date {
  if (!timestamp) return new Date();
  return timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
}

// CATEGORIES
export async function getCategories(): Promise<Category[]> {
  try {
    console.log('Firebase: Fetching categories');
    const categoriesRef = collection(db, 'categories');
    // Simplified query without orderBy to avoid index requirement
    const q = query(categoriesRef, where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    
    let categories: Category[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    } as Category));
    
    // Sort manually by order field
    categories.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    console.log(`Firebase: Found ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const categoryDoc = await getDoc(doc(db, 'categories', id));
    if (!categoryDoc.exists()) return null;
    
    return {
      id: categoryDoc.id,
      ...categoryDoc.data(),
      createdAt: convertTimestamp(categoryDoc.data()?.createdAt),
      updatedAt: convertTimestamp(categoryDoc.data()?.updatedAt)
    } as Category;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<string> {
  try {
    const categoryData = {
      ...category,
      slug: createSlug(category.name),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'categories'), categoryData);
    console.log('Firebase: Category created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

// LOCATIONS
export async function getLocations(): Promise<Location[]> {
  try {
    console.log('Firebase: Fetching locations');
    const locationsRef = collection(db, 'locations');
    // Simplified query without orderBy to avoid index requirement
    const q = query(locationsRef, where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    
    let locations: Location[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    } as Location));
    
    // Sort manually by order field
    locations.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    console.log(`Firebase: Found ${locations.length} locations`);
    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
}

export async function getLocationById(id: string): Promise<Location | null> {
  try {
    const locationDoc = await getDoc(doc(db, 'locations', id));
    if (!locationDoc.exists()) return null;
    
    return {
      id: locationDoc.id,
      ...locationDoc.data(),
      createdAt: convertTimestamp(locationDoc.data()?.createdAt),
      updatedAt: convertTimestamp(locationDoc.data()?.updatedAt)
    } as Location;
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
}

export async function createLocation(location: Omit<Location, 'id'>): Promise<string> {
  try {
    const locationData = {
      ...location,
      slug: createSlug(location.name),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'locations'), locationData);
    console.log('Firebase: Location created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
}

// LISTINGS
export async function getListings(filters: ListingFilters = {}): Promise<{
  listings: Listing[];
  total: number;
  hasMore: boolean;
}> {
  try {
    console.log('Firebase: Fetching listings with filters:', filters);
    
    const listingsRef = collection(db, 'listings');
    let q = query(listingsRef);
    
    // TEMPORARY: No where clauses to avoid all index issues
    // Get all documents and filter client-side
    const pageLimit = filters.limit || 20;
    q = query(listingsRef, limit(100)); // Get more docs for client-side filtering
    
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs;
    
    // Check if there are more results
    const hasMore = docs.length > pageLimit;
    const listingDocs = hasMore ? docs.slice(0, pageLimit) : docs;
    
    let listings: Listing[] = listingDocs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    } as Listing));
    
    // Apply ALL filters client-side to avoid index issues
    
    // Status filter (default to active)
    if (filters.status) {
      listings = listings.filter(listing => listing.status === filters.status);
    } else {
      listings = listings.filter(listing => listing.status === 'active');
    }
    
    // Category filter
    if (filters.categoryId) {
      listings = listings.filter(listing => listing.categoryId === filters.categoryId);
    }
    
    // Location filter
    if (filters.locationId) {
      listings = listings.filter(listing => listing.locationId === filters.locationId);
    }
    
    // User filter
    if (filters.userId) {
      listings = listings.filter(listing => listing.userId === filters.userId);
    }
    
    // Price range filters
    if (filters.minPrice !== undefined) {
      listings = listings.filter(listing => listing.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      listings = listings.filter(listing => listing.price <= filters.maxPrice!);
    }
    
    // Sort manually by createdAt (since we removed orderBy)
    listings.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // desc order
    });
    
    // Text search filter (client-side for now)
    if (filters.q) {
      const searchTerm = filters.q.toLowerCase();
      listings = listings.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.description.toLowerCase().includes(searchTerm)
      );
    }
    
    console.log(`Firebase: Found ${listings.length} listings`);
    
    return {
      listings,
      total: listings.length, // TODO: Implement proper total count
      hasMore: hasMore && listings.length === pageLimit
    };
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
}

export async function getListingById(id: string): Promise<Listing | null> {
  try {
    const listingDoc = await getDoc(doc(db, 'listings', id));
    if (!listingDoc.exists()) return null;
    
    // Increment view count
    await updateDoc(doc(db, 'listings', id), {
      views: (listingDoc.data().views || 0) + 1,
      lastViewedAt: serverTimestamp()
    });
    
    return {
      id: listingDoc.id,
      ...listingDoc.data(),
      createdAt: convertTimestamp(listingDoc.data()?.createdAt),
      updatedAt: convertTimestamp(listingDoc.data()?.updatedAt)
    } as Listing;
  } catch (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  try {
    console.log('Firebase: Fetching listing by slug:', slug);
    const listingsRef = collection(db, 'listings');
    const q = query(listingsRef, where('slug', '==', slug), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    const listingDoc = querySnapshot.docs[0];
    
    // Increment view count
    await updateDoc(listingDoc.ref, {
      views: (listingDoc.data().views || 0) + 1,
      lastViewedAt: serverTimestamp()
    });
    
    return {
      id: listingDoc.id,
      ...listingDoc.data(),
      createdAt: convertTimestamp(listingDoc.data().createdAt),
      updatedAt: convertTimestamp(listingDoc.data().updatedAt)
    } as Listing;
  } catch (error) {
    console.error('Error fetching listing by slug:', error);
    throw error;
  }
}

export async function createListing(listing: Omit<Listing, 'id'>): Promise<string> {
  try {
    console.log('Firebase: Creating listing:', listing.title);
    
    const slug = createSlug(listing.title);
    
    const listingData = {
      ...listing,
      slug,
      status: 'active',
      views: 0,
      featured: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
    };
    
    const docRef = await addDoc(collection(db, 'listings'), listingData);
    console.log('Firebase: Listing created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
}

export async function updateListing(id: string, updates: Partial<Listing>): Promise<void> {
  try {
    console.log('Firebase: Updating listing:', id);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    // Update slug if title changed
    if (updates.title) {
      updateData.slug = createSlug(updates.title);
    }
    
    await updateDoc(doc(db, 'listings', id), updateData);
    console.log('Firebase: Listing updated successfully');
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
}

export async function deleteListing(id: string): Promise<void> {
  try {
    console.log('Firebase: Deleting listing:', id);
    await deleteDoc(doc(db, 'listings', id));
    console.log('Firebase: Listing deleted successfully');
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
}

// ADMIN FUNCTIONS
export async function toggleListingStatus(id: string, status: 'active' | 'hidden'): Promise<void> {
  try {
    console.log(`Firebase: Toggling listing ${id} to ${status}`);
    await updateDoc(doc(db, 'listings', id), {
      status,
      updatedAt: serverTimestamp(),
      moderatedAt: serverTimestamp()
    });
    console.log('Firebase: Listing status updated successfully');
  } catch (error) {
    console.error('Error toggling listing status:', error);
    throw error;
  }
}

export async function deleteListingAdmin(id: string): Promise<void> {
  try {
    console.log('Firebase: Admin deleting listing:', id);
    await updateDoc(doc(db, 'listings', id), {
      status: 'deleted',
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Firebase: Listing marked as deleted');
  } catch (error) {
    console.error('Error admin deleting listing:', error);
    throw error;
  }
}

export async function setUserAsAdmin(userId: string): Promise<void> {
  try {
    console.log('Firebase: Setting user as admin:', userId);
    await updateDoc(doc(db, 'users', userId), {
      role: 'admin',
      updatedAt: serverTimestamp(),
      promotedAt: serverTimestamp()
    });
    console.log('Firebase: User promoted to admin successfully');
  } catch (error) {
    console.error('Error setting user as admin:', error);
    throw error;
  }
}

// SEARCH FUNCTIONS
export async function searchListings(searchTerm: string, filters: ListingFilters = {}): Promise<Listing[]> {
  try {
    console.log('Firebase: Searching listings for:', searchTerm);
    
    // For now, we'll do a simple client-side search
    // In production, consider using Algolia or Elasticsearch
    const { listings } = await getListings(filters);
    
    const searchTermLower = searchTerm.toLowerCase();
    const filteredListings = listings.filter(listing => 
      listing.title.toLowerCase().includes(searchTermLower) ||
      listing.description.toLowerCase().includes(searchTermLower)
    );
    
    console.log(`Firebase: Found ${filteredListings.length} matching listings`);
    return filteredListings;
  } catch (error) {
    console.error('Error searching listings:', error);
    throw error;
  }
}

// STATISTICS
export async function getListingStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  sold: number;
}> {
  try {
    console.log('Firebase: Fetching listing statistics');
    
    const listingsRef = collection(db, 'listings');
    const [totalSnap, activeSnap, inactiveSnap, soldSnap] = await Promise.all([
      getDocs(query(listingsRef)),
      getDocs(query(listingsRef, where('status', '==', 'active'))),
      getDocs(query(listingsRef, where('status', '==', 'inactive'))),
      getDocs(query(listingsRef, where('status', '==', 'sold')))
    ]);
    
    return {
      total: totalSnap.size,
      active: activeSnap.size,
      inactive: inactiveSnap.size,
      sold: soldSnap.size
    };
  } catch (error) {
    console.error('Error fetching listing stats:', error);
    throw error;
  }
}

// ===== NEW FUNCTIONS FOR LISTING PAGE =====

// Get user by ID
export async function getUserById(uid: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) return null;
    
    const userData = userDoc.data();
    return {
      id: userDoc.id,
      ...userData,
      createdAt: convertTimestamp(userData.createdAt),
      updatedAt: convertTimestamp(userData.updatedAt)
    } as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Get similar listings
export async function getSimilarListings({
  categoryId,
  locationId,
  excludeId,
  limit: limitCount = 4
}: {
  categoryId?: string;
  locationId?: string;
  excludeId: string;
  limit?: number;
}): Promise<Listing[]> {
  try {
    const listingsRef = collection(db, 'listings');
    
    // Simple query to avoid index issues - filter client-side
    const q = query(listingsRef, limit(50));
    const querySnapshot = await getDocs(q);
    
    let listings: Listing[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'active' && doc.id !== excludeId) {
        listings.push({
          id: doc.id,
          ...data,
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt)
        } as Listing);
      }
    });
    
    console.log('Total active listings found:', listings.length);
    console.log('Looking for categoryId:', categoryId, 'locationId:', locationId);
    
    // Try different filtering strategies
    let filteredListings: Listing[] = [];
    
    // Strategy 1: Same category and location
    if (categoryId && locationId) {
      filteredListings = listings.filter(listing => 
        listing.categoryId === categoryId && listing.locationId === locationId
      );
      console.log('Same category + location:', filteredListings.length);
    }
    
    // Strategy 2: If not enough, try same category only
    if (filteredListings.length < limitCount && categoryId) {
      const categoryOnly = listings.filter(listing => listing.categoryId === categoryId);
      filteredListings = [...filteredListings, ...categoryOnly.filter(l => 
        !filteredListings.some(fl => fl.id === l.id)
      )];
      console.log('Same category only:', filteredListings.length);
    }
    
    // Strategy 3: If still not enough, try same location only
    if (filteredListings.length < limitCount && locationId) {
      const locationOnly = listings.filter(listing => listing.locationId === locationId);
      filteredListings = [...filteredListings, ...locationOnly.filter(l => 
        !filteredListings.some(fl => fl.id === l.id)
      )];
      console.log('Same location only:', filteredListings.length);
    }
    
    // Strategy 4: If still not enough, get any recent listings
    if (filteredListings.length < limitCount) {
      const remaining = listings.filter(l => 
        !filteredListings.some(fl => fl.id === l.id)
      );
      filteredListings = [...filteredListings, ...remaining];
      console.log('Any listings:', filteredListings.length);
    }
    
    // Sort by creation date and limit
    filteredListings.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    
    const result = filteredListings.slice(0, limitCount);
    console.log('Final similar listings:', result.length);
    
    return result;
  } catch (error) {
    console.error('Error fetching similar listings:', error);
    return [];
  }
}

// Toggle favorite
export async function toggleFavorite({
  userId,
  listingId
}: {
  userId: string;
  listingId: string;
}): Promise<boolean> {
  try {
    const favoritesRef = collection(db, 'favorites');
    const q = query(
      favoritesRef,
      where('userId', '==', userId),
      where('listingId', '==', listingId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Add favorite
      await addDoc(favoritesRef, {
        userId,
        listingId,
        createdAt: serverTimestamp()
      });
      return true; // favorited
    } else {
      // Remove favorite
      const favoriteDoc = querySnapshot.docs[0];
      await deleteDoc(favoriteDoc.ref);
      return false; // unfavorited
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

// Check if listing is favorited by user
export async function isFavorited(userId: string, listingId: string): Promise<boolean> {
  try {
    const favoritesRef = collection(db, 'favorites');
    const q = query(
      favoritesRef,
      where('userId', '==', userId),
      where('listingId', '==', listingId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
}

// Get or create chat
export async function getOrCreateChat({
  buyerId,
  sellerId,
  listingId
}: {
  buyerId: string;
  sellerId: string;
  listingId: string;
}): Promise<string> {
  try {
    const chatsRef = collection(db, 'chats');
    
    // Check if chat already exists
    const q = query(
      chatsRef,
      where('participants', 'array-contains', buyerId)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Find existing chat with both participants and same listing
    for (const chatDoc of querySnapshot.docs) {
      const chatData = chatDoc.data();
      if (
        chatData.participants.includes(sellerId) &&
        chatData.listingId === listingId
      ) {
        return chatDoc.id;
      }
    }
    
    // Create new chat
    const newChatRef = await addDoc(chatsRef, {
      participants: [buyerId, sellerId],
      listingId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return newChatRef.id;
  } catch (error) {
    console.error('Error getting or creating chat:', error);
    throw error;
  }
}

// Increment views - Smart tracking
export async function incrementViews(listingId: string, userId?: string): Promise<void> {
  try {
    const listingRef = doc(db, 'listings', listingId);
    
    // Always increment view count
    await updateDoc(listingRef, {
      views: increment(1),
      lastViewedAt: serverTimestamp()
    });
    
    // Log view event for analytics (optional)
    if (userId) {
      await logEvent({
        listingId,
        userId,
        type: 'view',
        metadata: { timestamp: new Date().toISOString() }
      });
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

// Log event for audit
export async function logEvent({
  listingId,
  userId,
  type,
  metadata
}: {
  listingId: string;
  userId: string;
  type: 'phone_view' | 'report' | 'contact' | 'view';
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    const auditRef = collection(db, 'audit_logs');
    await addDoc(auditRef, {
      listingId,
      userId,
      type,
      metadata: metadata || {},
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error logging event:', error);
    // Don't throw - audit logging shouldn't break functionality
  }
}

// Create report
export async function createReport({
  listingId,
  reporterId,
  reason,
  details
}: {
  listingId: string;
  reporterId: string;
  reason: 'spam' | 'inappropriate' | 'fake' | 'duplicate' | 'other';
  details?: string;
}): Promise<string> {
  try {
    const reportsRef = collection(db, 'reports');
    const reportRef = await addDoc(reportsRef, {
      listingId,
      reporterId,
      reason,
      details: details || '',
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Log the report event
    await logEvent({
      listingId,
      userId: reporterId,
      type: 'report',
      metadata: { reason, details }
    });
    
    return reportRef.id;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
}

// Get user's active listings count
export async function getUserListingsCount(userId: string): Promise<number> {
  try {
    const listingsRef = collection(db, 'listings');
    const q = query(
      listingsRef,
      where('userId', '==', userId),
      where('status', '==', 'active')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting user listings count:', error);
    return 0;
  }
}
