'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { getCategories, getLocations, Category, Location } from '@/server/repo/repoFirebase';

interface SearchFiltersProps {
  categories?: Category[];
  locations?: Location[];
}

export default function SearchFilters({ categories: propCategories, locations: propLocations }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>(propCategories || []);
  const [locations, setLocations] = useState<Location[]>(propLocations || []);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Filter states - initialize from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '');

  // Load categories and locations if not provided as props
  useEffect(() => {
    if (!propCategories || !propLocations) {
      const loadData = async () => {
        try {
          const [categoriesData, locationsData] = await Promise.all([
            getCategories(),
            getLocations()
          ]);
          if (!propCategories) setCategories(categoriesData);
          if (!propLocations) setLocations(locationsData);
        } catch (error) {
          console.error('Error loading filter data:', error);
        }
      };

      loadData();
    }
  }, [propCategories, propLocations]);

  // Apply filters by updating URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedLocation) params.set('location', selectedLocation);
    if (minPrice) params.set('min', minPrice);
    if (maxPrice) params.set('max', maxPrice);
    
    const newUrl = params.toString() ? `/?${params.toString()}` : '/';
    router.push(newUrl);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLocation('');
    setMinPrice('');
    setMaxPrice('');
    router.push('/');
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedCategory || selectedLocation || minPrice || maxPrice;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        {/* Categories - Minimalist Pills */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => {
                setSelectedCategory('');
                applyFilters();
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toate
            </button>
            {categories.slice(0, 8).map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  // Dacă categoria este deja selectată, o deselectez
                  const newCategory = selectedCategory === category.id ? '' : category.id!;
                  setSelectedCategory(newCategory);
                  
                  // Aplică filtrele imediat cu noua categorie
                  const params = new URLSearchParams();
                  if (searchQuery.trim()) params.set('q', searchQuery.trim());
                  if (newCategory) params.set('category', newCategory);
                  if (selectedLocation) params.set('location', selectedLocation);
                  if (minPrice) params.set('min', minPrice);
                  if (maxPrice) params.set('max', maxPrice);
                  
                  const newUrl = params.toString() ? `/?${params.toString()}` : '/';
                  router.push(newUrl);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
            {categories.length > 8 && (
              <button className="px-4 py-2 rounded-full text-sm text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors">
                +{categories.length - 8} mai multe
              </button>
            )}
          </div>
        </div>

        {/* Main Search Bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Caută anunțuri..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-4 py-3 border rounded-full transition-colors ${
              hasActiveFilters 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5" />
            <span className="hidden sm:inline">Filtre</span>
            {hasActiveFilters && (
              <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {[selectedCategory, selectedLocation, minPrice, maxPrice].filter(Boolean).length}
              </span>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          <button
            onClick={applyFilters}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Caută
          </button>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="border-t border-gray-100 pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Toate categoriile</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locație
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Toate locațiile</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preț minim (€)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preț maxim (€)
                </label>
                <input
                  type="number"
                  placeholder="999999"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4" />
                Șterge filtrele
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Anulează
                </button>
                <button
                  onClick={() => {
                    applyFilters();
                    setIsExpanded(false);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Aplică filtrele
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
