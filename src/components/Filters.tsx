'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Tag, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCategories, getLocations, Category, Location } from '@/server/repo/repoMock';

interface FiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export default function Filters({ onFiltersChange }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États des filtres
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    min: searchParams.get('min') || '',
    max: searchParams.get('max') || ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, locationsData] = await Promise.all([
          getCategories(),
          getLocations()
        ]);
        setCategories(categoriesData);
        setLocations(locationsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Appeler le callback si fourni
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  };

  const clearFilters = () => {
    const clearedFilters = {
      q: '',
      category: '',
      location: '',
      min: '',
      max: ''
    };
    setFilters(clearedFilters);
    
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
    
    router.push('/');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Search className="h-5 w-5 mr-2 text-green-600" />
        Filtrează anunțurile
      </h3>
      
      <div className="space-y-4">
        {/* Căutare text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caută în titlu
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              placeholder="Ex: iPhone, apartament..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Categorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="inline h-4 w-4 mr-1" />
            Categorie
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Toate categoriile</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Locație */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Locație
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Toate locațiile</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        {/* Preț */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="inline h-4 w-4 mr-1" />
            Preț (€)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={filters.min}
              onChange={(e) => handleFilterChange('min', e.target.value)}
              placeholder="Min"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <input
              type="number"
              value={filters.max}
              onChange={(e) => handleFilterChange('max', e.target.value)}
              placeholder="Max"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Butoane */}
        <div className="flex space-x-2 pt-4">
          <Button
            onClick={applyFilters}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            Aplică filtrele
          </Button>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Resetează
          </Button>
        </div>
      </div>
    </div>
  );
}
