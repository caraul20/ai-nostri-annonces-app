'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  EyeOff, 
  Trash2, 
  User, 
  MapPin, 
  Calendar, 
  Tag,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getListings, toggleListingStatus, deleteListingAdmin } from '@/app/actions/admin';
import { Listing, getCategoryById, getLocationById } from '@/server/repo/repoFirebase';

interface EnrichedListing extends Listing {
  categoryName?: string;
  locationName?: string;
}

export default function ModerationPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<EnrichedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'hidden' | 'reported'>('all');

  useEffect(() => {
    loadListings();
  }, [filter]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const result = await getListings(filter);
      
      // Enrichir avec les noms de catégories et localisations
      const enrichedListings = await Promise.all(
        result.listings.map(async (listing) => {
          const [category, location] = await Promise.all([
            getCategoryById(listing.categoryId),
            getLocationById(listing.locationId)
          ]);
          
          return {
            ...listing,
            categoryName: category?.name,
            locationName: location?.name
          };
        })
      );
      
      setListings(enrichedListings);
    } catch (error) {
      console.error('Erreur lors du chargement des anunțuri:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (listingId: string, currentStatus: string) => {
    try {
      setActionLoading(listingId);
      const newStatus = currentStatus === 'active' ? 'hidden' : 'active';
      
      const result = await toggleListingStatus(listingId, newStatus);
      
      if (result.success) {
        // Actualiser la liste
        await loadListings();
      } else {
        alert(result.error || 'Eroare la modificarea statusului');
      }
    } catch (error) {
      console.error('Eroare:', error);
      alert('A apărut o eroare');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (listingId: string, title: string) => {
    if (!confirm(`Ești sigur că vrei să ștergi anunțul "${title}"? Această acțiune nu poate fi anulată.`)) {
      return;
    }

    try {
      setActionLoading(listingId);
      const result = await deleteListingAdmin(listingId);
      
      if (result.success) {
        await loadListings();
      } else {
        alert(result.error || 'Eroare la ștergerea anunțului');
      }
    } catch (error) {
      console.error('Eroare:', error);
      alert('A apărut o eroare');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    
    let dateObj: Date;
    if (date.toDate) {
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return '';
    }
    
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Activ
          </span>
        );
      case 'hidden':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Ascuns
          </span>
        );
      case 'sold':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Vândut
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {status}
          </span>
        );
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Moderare Anunțuri
            </h1>
            <p className="text-gray-600">
              Gestionează și moderează anunțurile publicate pe platformă
            </p>
          </div>

          {/* Filtre */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setFilter('all')}
                variant={filter === 'all' ? 'default' : 'outline'}
                className={filter === 'all' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Toate ({listings.length})
              </Button>
              <Button
                onClick={() => setFilter('active')}
                variant={filter === 'active' ? 'default' : 'outline'}
                className={filter === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Active
              </Button>
              <Button
                onClick={() => setFilter('hidden')}
                variant={filter === 'hidden' ? 'default' : 'outline'}
                className={filter === 'hidden' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Ascunse
              </Button>
              <Button
                onClick={() => setFilter('reported')}
                variant={filter === 'reported' ? 'default' : 'outline'}
                className={filter === 'reported' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Raportate
              </Button>
            </div>
          </div>

          {/* Lista anunțuri */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : listings.length === 0 ? (
              <div className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Niciun anunț găsit
                </h3>
                <p className="text-gray-500">
                  Nu există anunțuri pentru filtrul selectat.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {listings.map((listing) => (
                  <div key={listing.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {listing.title}
                          </h3>
                          {getStatusBadge(listing.status)}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>ID: {listing.userId.substring(0, 8)}...</span>
                          </div>
                          
                          {listing.categoryName && (
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 mr-1" />
                              <span>{listing.categoryName}</span>
                            </div>
                          )}
                          
                          {listing.locationName && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{listing.locationName}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(listing.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-green-600">
                            {formatPrice(listing.price)}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleToggleStatus(listing.id!, listing.status)}
                              disabled={actionLoading === listing.id}
                              variant="outline"
                              size="sm"
                              className={
                                listing.status === 'active' 
                                  ? 'border-red-300 text-red-600 hover:bg-red-50'
                                  : 'border-green-300 text-green-600 hover:bg-green-50'
                              }
                            >
                              {actionLoading === listing.id ? (
                                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                              ) : listing.status === 'active' ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-1" />
                                  Ascunde
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Afișează
                                </>
                              )}
                            </Button>
                            
                            <Button
                              onClick={() => handleDelete(listing.id!, listing.title)}
                              disabled={actionLoading === listing.id}
                              variant="outline"
                              size="sm"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
