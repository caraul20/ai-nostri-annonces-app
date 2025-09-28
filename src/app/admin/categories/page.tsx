'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { 
  Tag, 
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Search,
  ArrowUpDown
} from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  listingsCount: number;
  order: number;
  createdAt: Date;
}

interface Location {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  listingsCount: number;
  order: number;
  createdAt: Date;
}

export default function CategoriesManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'categories' | 'locations'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // TODO(firebase): Înlocuiește cu date reale din Firebase
      // Mock data pentru dezvoltare
      setTimeout(() => {
        const mockCategories: Category[] = [
          {
            id: '1',
            name: 'Electronice & IT',
            slug: 'electronice-it',
            description: 'Telefoane, laptopuri, componente IT',
            isActive: true,
            listingsCount: 1247,
            order: 1,
            createdAt: new Date('2023-01-01')
          },
          {
            id: '2',
            name: 'Auto & Moto',
            slug: 'auto-moto',
            description: 'Mașini, motociclete, piese auto',
            isActive: true,
            listingsCount: 892,
            order: 2,
            createdAt: new Date('2023-01-01')
          },
          {
            id: '3',
            name: 'Imobiliare',
            slug: 'imobiliare',
            description: 'Apartamente, case, terenuri',
            isActive: true,
            listingsCount: 634,
            order: 3,
            createdAt: new Date('2023-01-01')
          },
          {
            id: '4',
            name: 'Modă & Beauty',
            slug: 'moda-beauty',
            description: 'Haine, încălțăminte, cosmetice',
            isActive: false,
            listingsCount: 23,
            order: 4,
            createdAt: new Date('2023-06-01')
          }
        ];

        const mockLocations: Location[] = [
          {
            id: '1',
            name: 'București',
            slug: 'bucuresti',
            isActive: true,
            listingsCount: 1456,
            order: 1,
            createdAt: new Date('2023-01-01')
          },
          {
            id: '2',
            name: 'Cluj-Napoca',
            slug: 'cluj-napoca',
            isActive: true,
            listingsCount: 892,
            order: 2,
            createdAt: new Date('2023-01-01')
          },
          {
            id: '3',
            name: 'Timișoara',
            slug: 'timisoara',
            isActive: true,
            listingsCount: 567,
            order: 3,
            createdAt: new Date('2023-01-01')
          },
          {
            id: '4',
            name: 'Iași',
            slug: 'iasi',
            isActive: true,
            listingsCount: 423,
            order: 4,
            createdAt: new Date('2023-01-01')
          },
          {
            id: '5',
            name: 'Constanța',
            slug: 'constanta',
            isActive: false,
            listingsCount: 12,
            order: 5,
            createdAt: new Date('2023-08-01')
          }
        ];

        setCategories(mockCategories);
        setLocations(mockLocations);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Eroare la încărcarea datelor:', error);
      setLoading(false);
    }
  };

  const handleToggleActive = async (type: 'category' | 'location', id: string) => {
    try {
      if (type === 'category') {
        setCategories(categories.map(cat => 
          cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
        ));
      } else {
        setLocations(locations.map(loc => 
          loc.id === id ? { ...loc, isActive: !loc.isActive } : loc
        ));
      }
      console.log(`Toggle ${type} ${id}`);
    } catch (error) {
      console.error('Eroare la schimbarea statusului:', error);
    }
  };

  const handleDelete = async (type: 'category' | 'location', id: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest element? Această acțiune nu poate fi anulată.')) {
      return;
    }

    try {
      if (type === 'category') {
        setCategories(categories.filter(cat => cat.id !== id));
      } else {
        setLocations(locations.filter(loc => loc.id !== id));
      }
      console.log(`Delete ${type} ${id}`);
    } catch (error) {
      console.error('Eroare la ștergere:', error);
    }
  };

  const handleAdd = async () => {
    if (!newItem.name.trim()) return;

    try {
      const slug = newItem.name.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      if (activeTab === 'categories') {
        const newCategory: Category = {
          id: Date.now().toString(),
          name: newItem.name,
          slug,
          description: newItem.description,
          isActive: true,
          listingsCount: 0,
          order: categories.length + 1,
          createdAt: new Date()
        };
        setCategories([...categories, newCategory]);
      } else {
        const newLocation: Location = {
          id: Date.now().toString(),
          name: newItem.name,
          slug,
          isActive: true,
          listingsCount: 0,
          order: locations.length + 1,
          createdAt: new Date()
        };
        setLocations([...locations, newLocation]);
      }

      setNewItem({ name: '', description: '' });
      setShowAddForm(false);
      console.log(`Add ${activeTab}:`, newItem);
    } catch (error) {
      console.error('Eroare la adăugare:', error);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Se încarcă datele...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Tag className="h-6 w-6 mr-2" />
                  Categorii & Locații
                </h1>
                <p className="text-gray-600">
                  Gestionează categoriile și locațiile platformei
                </p>
              </div>
              <div className="flex space-x-3">
                <Link href="/admin">
                  <Button variant="outline">
                    ← Înapoi la Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'categories'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Tag className="h-4 w-4 mr-2 inline" />
                  Categorii ({categories.length})
                </button>
                <button
                  onClick={() => setActiveTab('locations')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === 'locations'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <MapPin className="h-4 w-4 mr-2 inline" />
                  Locații ({locations.length})
                </button>
              </nav>
            </div>

            {/* Controls */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder={`Caută ${activeTab === 'categories' ? 'categorii' : 'locații'}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adaugă {activeTab === 'categories' ? 'Categorie' : 'Locație'}
                </Button>
              </div>

              {/* Add Form */}
              {showAddForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nume"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {activeTab === 'categories' && (
                      <input
                        type="text"
                        placeholder="Descriere (opțional)"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewItem({ name: '', description: '' });
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Anulează
                    </Button>
                    <Button
                      onClick={handleAdd}
                      disabled={!newItem.name.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvează
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeTab === 'categories' ? 'Categorie' : 'Locație'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Anunțuri
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creat
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(activeTab === 'categories' ? filteredCategories : filteredLocations).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            /{item.slug}
                          </div>
                          {activeTab === 'categories' && (item as Category).description && (
                            <div className="text-xs text-gray-400 mt-1">
                              {(item as Category).description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isActive ? 'Activ' : 'Inactiv'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">{item.listingsCount}</span> anunțuri
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.createdAt.toLocaleDateString('ro-RO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleActive(
                              activeTab === 'categories' ? 'category' : 'location', 
                              item.id
                            )}
                            className={item.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                          >
                            {item.isActive ? (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Dezactivează
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Activează
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(
                              activeTab === 'categories' ? 'category' : 'location', 
                              item.id
                            )}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Șterge
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {(activeTab === 'categories' ? filteredCategories : filteredLocations).length === 0 && (
              <div className="text-center py-12">
                {activeTab === 'categories' ? (
                  <Tag className="mx-auto h-12 w-12 text-gray-400" />
                ) : (
                  <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Nu s-au găsit {activeTab === 'categories' ? 'categorii' : 'locații'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Încearcă să modifici termenul de căutare.' : `Începe prin a adăuga prima ${activeTab === 'categories' ? 'categorie' : 'locație'}.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
