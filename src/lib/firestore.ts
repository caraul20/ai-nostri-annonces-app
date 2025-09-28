// Firebase temporar dezactivat - folosim date mock
console.log('Firestore dezactivat - folosim date mock');

// Types pour les collections
export interface Category {
  id?: string;
  name: string;
  slug: string;
  createdAt?: any;
}

export interface Location {
  id?: string;
  name: string;
  slug: string;
  createdAt?: any;
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
  createdAt?: any;
  updatedAt?: any;
}

// Fonction utilitaire pour créer un slug
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Supprime les tirets multiples
    .trim();
}

// ========== DONNÉES MOCK ==========

const mockCategories: Category[] = [
  { id: '1', name: 'Imobiliare', slug: 'imobiliare', createdAt: new Date() },
  { id: '2', name: 'Vehicule', slug: 'vehicule', createdAt: new Date() },
  { id: '3', name: 'Electronice', slug: 'electronice', createdAt: new Date() },
  { id: '4', name: 'Casa & Grădina', slug: 'casa-gradina', createdAt: new Date() },
  { id: '5', name: 'Modă & Îmbrăcăminte', slug: 'moda-imbracaminte', createdAt: new Date() },
  { id: '6', name: 'Sport & Timp liber', slug: 'sport-timp-liber', createdAt: new Date() },
];

const mockLocations: Location[] = [
  { id: '1', name: 'București', slug: 'bucuresti', createdAt: new Date() },
  { id: '2', name: 'Cluj-Napoca', slug: 'cluj-napoca', createdAt: new Date() },
  { id: '3', name: 'Timișoara', slug: 'timisoara', createdAt: new Date() },
  { id: '4', name: 'Iași', slug: 'iasi', createdAt: new Date() },
  { id: '5', name: 'Constanța', slug: 'constanta', createdAt: new Date() },
  { id: '6', name: 'Brașov', slug: 'brasov', createdAt: new Date() },
];

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Apartament 3 camere în centru',
    description: 'Apartament frumos în centrul orașului, complet mobilat și utilat. Vedere la parc.',
    price: 120000,
    images: ['https://via.placeholder.com/400x300/4CAF50/ffffff?text=Apartament'],
    categoryId: '1',
    locationId: '1',
    userId: 'user1',
    status: 'active',
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'BMW Seria 3 - 2019',
    description: 'Mașină în stare excelentă, service-uri la zi, un singur proprietar.',
    price: 25000,
    images: ['https://via.placeholder.com/400x300/2196F3/ffffff?text=BMW'],
    categoryId: '2',
    locationId: '2',
    userId: 'user2',
    status: 'active',
    createdAt: new Date()
  },
  {
    id: '3',
    title: 'iPhone 14 Pro Max',
    description: 'Telefon nou, sigilat, cu garanție 2 ani. Toate accesoriile incluse.',
    price: 4500,
    images: ['https://via.placeholder.com/400x300/FF9800/ffffff?text=iPhone'],
    categoryId: '3',
    locationId: '3',
    userId: 'user3',
    status: 'active',
    createdAt: new Date()
  },
  {
    id: '4',
    title: 'Canapea extensibilă',
    description: 'Canapea modernă, extensibilă, în stare foarte bună. Perfectă pentru living.',
    price: 1200,
    images: ['https://via.placeholder.com/400x300/9C27B0/ffffff?text=Canapea'],
    categoryId: '4',
    locationId: '4',
    userId: 'user4',
    status: 'active',
    createdAt: new Date()
  },
  {
    id: '5',
    title: 'Jachetă de piele',
    description: 'Jachetă de piele naturală, mărimea M, purtată foarte puțin.',
    price: 350,
    images: ['https://via.placeholder.com/400x300/795548/ffffff?text=Jacheta'],
    categoryId: '5',
    locationId: '5',
    userId: 'user5',
    status: 'active',
    createdAt: new Date()
  },
  {
    id: '6',
    title: 'Bicicletă electrică',
    description: 'Bicicletă electrică nouă, autonomie 50km, perfectă pentru oraș.',
    price: 2800,
    images: ['https://via.placeholder.com/400x300/4CAF50/ffffff?text=Bicicleta'],
    categoryId: '6',
    locationId: '6',
    userId: 'user6',
    status: 'active',
    createdAt: new Date()
  }
];

// ========== FONCTIONS MOCK ==========

export async function addCategory(name: string): Promise<string> {
  console.log('Mock: Ajout catégorie', name);
  const slug = createSlug(name);
  const newId = (mockCategories.length + 1).toString();
  mockCategories.push({
    id: newId,
    name,
    slug,
    createdAt: new Date()
  });
  return newId;
}

export async function getCategories(): Promise<Category[]> {
  console.log('Mock: Récupération catégories');
  return [...mockCategories];
}

export async function addLocation(name: string): Promise<string> {
  console.log('Mock: Ajout localisation', name);
  const slug = createSlug(name);
  const newId = (mockLocations.length + 1).toString();
  mockLocations.push({
    id: newId,
    name,
    slug,
    createdAt: new Date()
  });
  return newId;
}

export async function getLocations(): Promise<Location[]> {
  console.log('Mock: Récupération localisations');
  return [...mockLocations];
}

export async function addListing(data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  console.log('Mock: Ajout annonce', data.title);
  const newId = (mockListings.length + 1).toString();
  mockListings.push({
    ...data,
    id: newId,
    status: data.status || 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return newId;
}

export interface ListingFilters {
  categoryId?: string;
  locationId?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  userId?: string;
}

export async function getListings(filters?: ListingFilters & { q?: string }): Promise<Listing[]> {
  console.log('Mock: Récupération annonces avec filtres', filters);
  let filteredListings = [...mockListings];
  
  if (filters?.categoryId) {
    filteredListings = filteredListings.filter(listing => listing.categoryId === filters.categoryId);
  }
  if (filters?.locationId) {
    filteredListings = filteredListings.filter(listing => listing.locationId === filters.locationId);
  }
  if (filters?.status) {
    filteredListings = filteredListings.filter(listing => listing.status === filters.status);
  }
  if (filters?.userId) {
    filteredListings = filteredListings.filter(listing => listing.userId === filters.userId);
  }
  if (filters?.minPrice !== undefined) {
    filteredListings = filteredListings.filter(listing => listing.price >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    filteredListings = filteredListings.filter(listing => listing.price <= filters.maxPrice!);
  }
  
  // Filtre de recherche textuelle
  if (filters?.q) {
    const searchTerm = filters.q.toLowerCase();
    filteredListings = filteredListings.filter(listing => 
      listing.title.toLowerCase().includes(searchTerm) ||
      listing.description.toLowerCase().includes(searchTerm)
    );
  }
  
  return filteredListings;
}

export async function getListingById(id: string): Promise<Listing | null> {
  console.log('Mock: Récupération annonce par ID', id);
  const listing = mockListings.find(listing => listing.id === id);
  return listing || null;
}

// ========== FONCTIONS UTILITAIRES ==========

export async function getCategoryById(id: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find(cat => cat.id === id) || null;
}

export async function getLocationById(id: string): Promise<Location | null> {
  const locations = await getLocations();
  return locations.find(loc => loc.id === id) || null;
}

export async function getListingsByCategory(categorySlug: string): Promise<Listing[]> {
  const categories = await getCategories();
  const category = categories.find(cat => cat.slug === categorySlug);
  
  if (!category?.id) {
    return [];
  }
  
  return await getListings({ categoryId: category.id });
}

export async function getListingsByLocation(locationSlug: string): Promise<Listing[]> {
  const locations = await getLocations();
  const location = locations.find(loc => loc.slug === locationSlug);
  
  if (!location?.id) {
    return [];
  }
  
  return await getListings({ locationId: location.id });
}
