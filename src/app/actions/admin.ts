'use server';

// TODO: Migrare către Firebase când va fi activat
import { getListings as getListingsFromRepo, Listing } from '@/server/repo/repoMock';

// Mock pentru verificarea admin
async function verifyAdmin(userId: string): Promise<boolean> {
  // TODO: Implementează verificarea reală când Firebase va fi activat
  console.log('Mock: Verificare admin pentru', userId);
  return true; // Mock - toți utilizatorii sunt admin în dezvoltare
}

export async function getListings(filter: 'all' | 'active' | 'hidden' | 'reported' = 'all') {
  try {
    console.log('Mock Admin: Încărcare anunțuri cu filtru', filter);
    
    // Folosim repo-ul mock cu filtrele corespunzătoare
    let statusFilter: string | undefined;
    
    switch (filter) {
      case 'active':
        statusFilter = 'active';
        break;
      case 'hidden':
        statusFilter = 'hidden';
        break;
      case 'reported':
        // TODO: Implementează sistemul de raportare
        statusFilter = 'active'; // Fallback pentru mock
        break;
      default: // 'all'
        statusFilter = undefined; // Toate statusurile
    }

    const result = await getListingsFromRepo({ 
      status: statusFilter,
      limit: 100 
    });

    return { success: true, listings: result.listings };
  } catch (error) {
    console.error('Eroare la încărcarea anunțurilor admin:', error);
    
    // Fallback la date mock în caz de eroare
    const mockListings: Listing[] = [
      {
        id: '1',
        title: 'Apartament 2 camere Paris 13ème',
        description: 'Apartament frumos în Paris, zona românească.',
        price: 1200,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'],
        categoryId: '1',
        locationId: '1',
        userId: 'user1',
        status: 'active',
        createdAt: new Date(),
        slug: 'apartament-2-camere-paris-13eme-1'
      },
      {
        id: '2',
        title: 'Renault Clio 2020 - Proprietar român',
        description: 'Mașină în stare perfectă, service-uri la zi.',
        price: 12500,
        images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'],
        categoryId: '2',
        locationId: '2',
        userId: 'user2',
        status: 'hidden',
        createdAt: new Date(),
        slug: 'renault-clio-2020-proprietar-roman-2'
      }
    ];

    return { success: true, listings: mockListings };
  }
}

export async function toggleListingStatus(listingId: string, newStatus: 'active' | 'hidden') {
  try {
    console.log('Mock Admin: Schimbare status anunț', listingId, 'la', newStatus);
    
    // TODO: Implementează logica reală când Firebase va fi activat
    // Simulăm o operațiune de actualizare
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true };
  } catch (error) {
    console.error('Eroare la modificarea statusului:', error);
    return { 
      success: false, 
      error: 'A apărut o eroare la modificarea statusului anunțului' 
    };
  }
}

export async function deleteListingAdmin(listingId: string) {
  try {
    console.log('Mock Admin: Ștergere anunț', listingId);
    
    // TODO: Implementează logica reală când Firebase va fi activat
    // Simulăm o operațiune de ștergere (soft delete)
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true };
  } catch (error) {
    console.error('Eroare la ștergerea anunțului:', error);
    return { 
      success: false, 
      error: 'A apărut o eroare la ștergerea anunțului' 
    };
  }
}

// Rate limiting pentru publicarea anunțurilor (folosește implementarea din repo)
export async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  try {
    console.log('Mock Admin: Verificare rate limit pentru', userId);
    
    // TODO: Implementează logica reală când Firebase va fi activat
    // Pentru mock, simulăm că utilizatorul poate publica
    return {
      allowed: true,
      remaining: 3
    };
  } catch (error) {
    console.error('Eroare la verificarea rate limit:', error);
    // În caz de eroare, permitem publicarea
    return { allowed: true, remaining: 3 };
  }
}

// Funcție pentru a seta un utilizator ca admin (pentru seed/setup)
export async function setUserAsAdmin(userId: string, currentAdminId: string) {
  try {
    console.log('Mock Admin: Setare utilizator ca admin', userId, 'de către', currentAdminId);
    
    // TODO: Implementează logica reală când Firebase va fi activat
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true };
  } catch (error) {
    console.error('Eroare la setarea admin:', error);
    return { 
      success: false, 
      error: 'A apărut o eroare la setarea utilizatorului ca admin' 
    };
  }
}
