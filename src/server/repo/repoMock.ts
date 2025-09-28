// TODO: Migrare către Firebase când va fi activat
// Firebase temporar dezactivat - folosim date mock
console.log('Repo Mock - Firebase dezactivat, folosim date mock');

// Types pour les collections
export interface Category {
  id?: string;
  name: string;
  slug: string;
  createdAt?: Date;
}

export interface Location {
  id?: string;
  name: string;
  slug: string;
  createdAt?: Date;
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
  createdAt?: Date;
  updatedAt?: Date;
  slug?: string; // Nouveau champ pour SEO
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

// Fonction pour générer un slug SEO avec ID
export function generateListingSlug(title: string, id: string): string {
  const titleSlug = createSlug(title);
  return `${titleSlug}-${id}`;
}

// Fonction pour extraire l'ID d'un slug
export function extractIdFromSlug(slug: string): string {
  const parts = slug.split('-');
  return parts[parts.length - 1];
}

// ========== DONNÉES MOCK ==========

// Données mock pour les catégories
const mockCategories: Category[] = [
  { id: '1', name: 'Imobiliare', slug: 'imobiliare', createdAt: new Date() },
  { id: '2', name: 'Vehicule', slug: 'vehicule', createdAt: new Date() },
  { id: '3', name: 'Electronice', slug: 'electronice', createdAt: new Date() },
  { id: '4', name: 'Casa & Grădina', slug: 'casa-gradina', createdAt: new Date() },
  { id: '5', name: 'Modă & Îmbrăcăminte', slug: 'moda-imbracaminte', createdAt: new Date() },
  { id: '6', name: 'Sport & Timp liber', slug: 'sport-timp-liber', createdAt: new Date() }
];

// Données mock pentru orașele din Franța cu comunități românești și moldovenești
const mockLocations: Location[] = [
  { id: '1', name: 'Paris', slug: 'paris', createdAt: new Date() },
  { id: '2', name: 'Lyon', slug: 'lyon', createdAt: new Date() },
  { id: '3', name: 'Marseille', slug: 'marseille', createdAt: new Date() },
  { id: '4', name: 'Toulouse', slug: 'toulouse', createdAt: new Date() },
  { id: '5', name: 'Nice', slug: 'nice', createdAt: new Date() },
  { id: '6', name: 'Strasbourg', slug: 'strasbourg', createdAt: new Date() },
  { id: '7', name: 'Bordeaux', slug: 'bordeaux', createdAt: new Date() },
  { id: '8', name: 'Lille', slug: 'lille', createdAt: new Date() }
];

// Anunțuri mock pentru comunitatea românească și moldovenească din Franța
const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Apartament 2 camere Paris 13ème',
    description: 'Apartament frumos în Paris, zona românească. Mobilat complet, metrou la 5 min. Perfect pentru români/moldoveni.',
    price: 1200,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'],
    categoryId: '1',
    locationId: '1',
    userId: 'user1',
    status: 'active',
    createdAt: new Date(),
    slug: generateListingSlug('Apartament 2 camere Paris 13ème', '1')
  },
  {
    id: '2',
    title: 'Renault Clio 2020 - Proprietar român',
    description: 'Mașină în stare perfectă, service-uri la zi. Vând pentru că mă întorc în țară. Acte în regulă.',
    price: 12500,
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'],
    categoryId: '2',
    locationId: '2',
    userId: 'user2',
    status: 'active',
    createdAt: new Date(),
    slug: generateListingSlug('Renault Clio 2020 - Proprietar român', '2')
  },
  {
    id: '3',
    title: 'iPhone 13 - Vând urgent',
    description: 'Telefon în stare perfectă, cu toate accesoriile. Vând pentru că plec în România.',
    price: 650,
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop'],
    categoryId: '3',
    locationId: '3',
    userId: 'user3',
    status: 'active',
    createdAt: new Date(),
    slug: generateListingSlug('iPhone 13 - Vând urgent', '3')
  },
  {
    id: '4',
    title: 'Mobilier românesc - Canapea + masă',
    description: 'Set mobilier adus din România, lemn masiv. Vând din cauza mutării. Calitate superioară.',
    price: 800,
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'],
    categoryId: '4',
    locationId: '4',
    userId: 'user4',
    status: 'active',
    createdAt: new Date(),
    slug: generateListingSlug('Mobilier românesc - Canapea + masă', '4')
  },
  {
    id: '5',
    title: 'Haine tradiționale românești',
    description: 'Ie românească autentică și costum popular moldovenesc. Pentru evenimente culturale în diaspora.',
    price: 150,
    images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop'],
    categoryId: '5',
    locationId: '5',
    userId: 'user5',
    status: 'active',
    createdAt: new Date(),
    slug: generateListingSlug('Haine tradiționale românești', '5')
  },
  {
    id: '6',
    title: 'Echipament fotbal - Tricouri România',
    description: 'Colecție tricouri echipa națională România, diverse ediții. Pentru pasionații de fotbal din diaspora.',
    price: 45,
    images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'],
    categoryId: '6',
    locationId: '6',
    userId: 'user6',
    status: 'active',
    createdAt: new Date(),
    slug: generateListingSlug('Echipament fotbal - Tricouri România', '6')
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

export async function addListing(data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'slug'>): Promise<string> {
  console.log('Mock: Ajout annonce', data.title);
  const newId = (mockListings.length + 1).toString();
  const slug = generateListingSlug(data.title, newId);
  
  mockListings.push({
    ...data,
    id: newId,
    slug,
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
  page?: number;
  limit?: number;
}

export async function getListings(filters?: ListingFilters & { q?: string }): Promise<{
  listings: Listing[];
  total: number;
  page: number;
  totalPages: number;
}> {
  console.log('Mock: Récupération annonces avec filtres', filters);
  let filteredListings = [...mockListings];
  
  // Filtrage
  if (filters?.categoryId) {
    filteredListings = filteredListings.filter(listing => listing.categoryId === filters.categoryId);
  }
  if (filters?.locationId) {
    filteredListings = filteredListings.filter(listing => listing.locationId === filters.locationId);
  }
  if (filters?.status) {
    filteredListings = filteredListings.filter(listing => listing.status === filters.status);
  } else {
    // Par défaut, ne montrer que les actifs
    filteredListings = filteredListings.filter(listing => listing.status === 'active');
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

  // Pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 12;
  const total = filteredListings.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedListings = filteredListings.slice(startIndex, endIndex);
  
  return {
    listings: paginatedListings,
    total,
    page,
    totalPages
  };
}

export async function getListingById(id: string): Promise<Listing | null> {
  console.log('Mock: Récupération annonce par ID', id);
  const listing = mockListings.find(listing => listing.id === id);
  return listing || null;
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  console.log('Mock: Récupération annonce par slug', slug);
  const listing = mockListings.find(listing => listing.slug === slug);
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

// Rate limiting en mémoire
const rateLimitStore = new Map<string, number[]>();

export function checkRateLimit(userId: string, maxRequests: number = 3, windowMs: number = 5 * 60 * 1000): boolean {
  const now = Date.now();
  const userRequests = rateLimitStore.get(userId) || [];
  
  // Nettoyer les anciennes requêtes
  const validRequests = userRequests.filter(timestamp => now - timestamp < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false; // Rate limit dépassé
  }
  
  // Ajouter la nouvelle requête
  validRequests.push(now);
  rateLimitStore.set(userId, validRequests);
  
  return true; // OK
}
