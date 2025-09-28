'use server';

// Firebase Admin Actions - AI NOSTRI PWA
import { 
  getListings as getFirebaseListings,
  toggleListingStatus as toggleFirebaseListingStatus,
  deleteListingAdmin as deleteFirebaseListingAdmin,
  setUserAsAdmin as setFirebaseUserAsAdmin,
  Listing,
  ListingFilters
} from '@/server/repo/repoFirebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Verify if user is admin
async function verifyAdmin(userId: string): Promise<boolean> {
  try {
    if (!userId) return false;
    
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return false;
    
    const userData = userDoc.data();
    return userData.role === 'admin';
  } catch (error) {
    console.error('Error verifying admin:', error);
    return false;
  }
}

export async function getListings(filter: 'all' | 'active' | 'hidden' | 'reported' = 'all') {
  try {
    console.log('Firebase Admin: Loading listings with filter', filter);
    
    const filters: ListingFilters = {};
    
    switch (filter) {
      case 'active':
        filters.status = 'active';
        break;
      case 'hidden':
        filters.status = 'hidden';
        break;
      case 'reported':
        // TODO: Implement reporting system with proper field
        filters.status = 'active'; // For now, show active listings
        break;
      default:
        // Show all except deleted
        break;
    }
    
    const result = await getFirebaseListings(filters);
    
    // For 'reported' filter, simulate some reported listings
    if (filter === 'reported') {
      const reportedListings = result.listings.slice(0, 2).map(listing => ({
        ...listing,
        reportCount: Math.floor(Math.random() * 5) + 1,
        reports: ['Spam', 'Conținut inadecvat']
      }));
      
      return { success: true, listings: reportedListings };
    }
    
    return { success: true, listings: result.listings };
  } catch (error) {
    console.error('Error loading admin listings:', error);
    return { success: false, error: 'Nu s-au putut încărca anunțurile', listings: [] };
  }
}

export async function toggleListingStatus(
  listingId: string,
  newStatus: 'active' | 'hidden',
  adminId?: string
) {
  try {
    console.log(`Firebase Admin: Toggle listing ${listingId} to ${newStatus}`);
    
    // Verify admin permissions if adminId provided
    if (adminId && !await verifyAdmin(adminId)) {
      return { success: false, error: 'Acces neautorizat' };
    }
    
    await toggleFirebaseListingStatus(listingId, newStatus);
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling listing status:', error);
    return { success: false, error: 'Nu s-a putut schimba statusul anunțului' };
  }
}

export async function deleteListingAdmin(listingId: string, adminId?: string) {
  try {
    console.log(`Firebase Admin: Delete listing ${listingId}`);
    
    // Verify admin permissions if adminId provided
    if (adminId && !await verifyAdmin(adminId)) {
      return { success: false, error: 'Acces neautorizat' };
    }
    
    await deleteFirebaseListingAdmin(listingId);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting listing:', error);
    return { success: false, error: 'Nu s-a putut șterge anunțul' };
  }
}

export async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  try {
    console.log('Firebase Admin: Check rate limit for', userId);
    
    // TODO: Implement proper rate limiting with Firestore
    // For now, allow 3 listings per hour
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    // This would need a proper implementation with Firestore queries
    // For now, return a mock response
    return { allowed: true, remaining: 3 };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return { allowed: false, remaining: 0 };
  }
}

export async function setUserAsAdmin(userId: string, currentAdminId: string) {
  try {
    console.log(`Firebase Admin: Set user ${userId} as admin by ${currentAdminId}`);
    
    // Verify current user is admin
    if (!await verifyAdmin(currentAdminId)) {
      return { success: false, error: 'Acces neautorizat' };
    }
    
    await setFirebaseUserAsAdmin(userId);
    
    // Log the admin promotion
    await updateDoc(doc(db, 'users', userId), {
      promotedBy: currentAdminId,
      promotedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error setting user as admin:', error);
    return { success: false, error: 'Nu s-a putut seta utilizatorul ca admin' };
  }
}

// Additional admin functions
export async function getUserStats() {
  try {
    console.log('Firebase Admin: Getting user statistics');
    
    // TODO: Implement proper user statistics from Firestore
    // This would involve aggregation queries
    
    return {
      success: true,
      stats: {
        totalUsers: 0, // TODO: Count from users collection
        activeUsers: 0, // TODO: Count active users
        newUsersToday: 0, // TODO: Count users created today
        adminUsers: 0 // TODO: Count admin users
      }
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return { success: false, error: 'Nu s-au putut încărca statisticile' };
  }
}

export async function getListingStats() {
  try {
    console.log('Firebase Admin: Getting listing statistics');
    
    // TODO: Implement proper listing statistics from Firestore
    // This would involve aggregation queries
    
    return {
      success: true,
      stats: {
        totalListings: 0, // TODO: Count from listings collection
        activeListings: 0, // TODO: Count active listings
        hiddenListings: 0, // TODO: Count hidden listings
        reportedListings: 0 // TODO: Count reported listings
      }
    };
  } catch (error) {
    console.error('Error getting listing stats:', error);
    return { success: false, error: 'Nu s-au putut încărca statisticile' };
  }
};
