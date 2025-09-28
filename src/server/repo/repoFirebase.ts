// Firebase Repository - AI NOSTRI PWA
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
  images: string[];
  categoryId: string;
  locationId: string;
  userId: string;
  status: 'active' | 'inactive' | 'sold' | 'hidden' | 'deleted';
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
  views?: number;
  featured?: boolean;
  expiresAt?: Date;
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
    const q = query(categoriesRef, where('isActive', '==', true), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const categories: Category[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    } as Category));
    
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
    const q = query(locationsRef, where('isActive', '==', true), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const locations: Location[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: convertTimestamp(doc.data().createdAt),
      updatedAt: convertTimestamp(doc.data().updatedAt)
    } as Location));
    
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
    
    // Apply filters
    const constraints = [];
    
    // Status filter (default to active)
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    } else {
      constraints.push(where('status', '==', 'active'));
    }
    
    // Category filter
    if (filters.categoryId) {
      constraints.push(where('categoryId', '==', filters.categoryId));
    }
    
    // Location filter
    if (filters.locationId) {
      constraints.push(where('locationId', '==', filters.locationId));
    }
    
    // User filter
    if (filters.userId) {
      constraints.push(where('userId', '==', filters.userId));
    }
    
    // Price range filters
    if (filters.minPrice !== undefined) {
      constraints.push(where('price', '>=', filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      constraints.push(where('price', '<=', filters.maxPrice));
    }
    
    // Add ordering and limit
    constraints.push(orderBy('createdAt', 'desc'));
    
    const pageLimit = filters.limit || 20;
    constraints.push(limit(pageLimit + 1)); // Get one extra to check if there are more
    
    q = query(listingsRef, ...constraints);
    
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
