'use client';

import { useState } from 'react';
import { Edit2, Eye, EyeOff, Trash2, MoreHorizontal } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  status: 'active' | 'inactive' | 'sold' | 'hidden' | 'deleted';
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
  price: number;
  images: string[];
}

interface MyListingsTableProps {
  listings: Listing[];
  loading: boolean;
}

export default function MyListingsTable({ listings, loading }: MyListingsTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleToggleStatus = async (listingId: string, currentStatus: string) => {
    setActionLoading(listingId);
    try {
      const newStatus = currentStatus === 'active' ? 'hidden' : 'active';
      await updateDoc(doc(db, 'listings', listingId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      // Refresh will happen via real-time listener in hook
    } catch (error) {
      console.error('Error toggling listing status:', error);
      alert('Eroare la actualizarea statusului. Încearcă din nou.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest anunț? Această acțiune nu poate fi anulată.')) {
      return;
    }

    setActionLoading(listingId);
    try {
      await updateDoc(doc(db, 'listings', listingId), {
        status: 'deleted',
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Refresh will happen via real-time listener in hook
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Eroare la ștergerea anunțului. Încearcă din nou.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Activ', class: 'bg-green-100 text-green-800' },
      hidden: { label: 'Ascuns', class: 'bg-yellow-100 text-yellow-800' },
      inactive: { label: 'Inactiv', class: 'bg-gray-100 text-gray-800' },
      sold: { label: 'Vândut', class: 'bg-blue-100 text-blue-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Edit2 className="h-8 w-8 text-gray-400" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Niciun anunț încă
        </h3>
        <p className="text-gray-600 mb-6">
          Publică primul tău anunț pentru a începe să vinzi.
        </p>
        <Link href="/new">
          <button className="btn-primary">
            Publică primul anunț
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Anunțurile Mele ({listings.length})
        </h2>
        <Link href="/new">
          <button className="btn-primary">
            + Anunț Nou
          </button>
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Anunț</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Vizualizări</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    {listing.images[0] && (
                      <img 
                        src={listing.images[0]} 
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900 line-clamp-1">
                        {listing.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {listing.price.toLocaleString()} €
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(listing.status)}
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {listing.views || 0}
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {listing.updatedAt?.toLocaleDateString('ro-RO') || 'N/A'}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end space-x-2">
                    {/* TODO: Add edit link when /listing/edit/[id] exists */}
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      aria-label="Editează anunțul"
                      title="Editează (TODO)"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleToggleStatus(listing.id, listing.status)}
                      disabled={actionLoading === listing.id}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                      aria-label={listing.status === 'active' ? 'Ascunde anunțul' : 'Afișează anunțul'}
                    >
                      {actionLoading === listing.id ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      ) : listing.status === 'active' ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(listing.id)}
                      disabled={actionLoading === listing.id}
                      className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                      aria-label="Șterge anunțul"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {listings.map((listing) => (
          <div key={listing.id} className="border rounded-xl p-4 hover:bg-gray-50">
            <div className="flex items-start space-x-3">
              {listing.images[0] && (
                <img 
                  src={listing.images[0]} 
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {listing.price.toLocaleString()} €
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{listing.views || 0} vizualizări</span>
                      <span>{listing.updatedAt?.toLocaleDateString('ro-RO') || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    {getStatusBadge(listing.status)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStatus(listing.id, listing.status)}
                      disabled={actionLoading === listing.id}
                      className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      {actionLoading === listing.id ? (
                        <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      ) : listing.status === 'active' ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                      <span>{listing.status === 'active' ? 'Ascunde' : 'Afișează'}</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(listing.id)}
                    disabled={actionLoading === listing.id}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Șterge</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
