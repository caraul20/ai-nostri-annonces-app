'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Calendar, Shield, Edit2, Save, X } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, userData, loading, updateUserProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || ''
      });
    }
  }, [userData]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile({
        name: formData.name,
        phone: formData.phone
      });
      setSuccess('Profilul a fost actualizat cu succes!');
      setEditing(false);
    } catch (error: any) {
      console.error('Eroare la actualizarea profilului:', error);
      setError('A apărut o eroare la actualizarea profilului');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || ''
      });
    }
    setEditing(false);
    setError('');
    setSuccess('');
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Eroare la deconectare:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

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
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contul meu</h1>
          <p className="text-gray-600">Gestionează informațiile tale personale</p>
        </div>

        {/* Mesaje de succes/eroare */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Card profil */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header card */}
          <div className="bg-gradient-to-r from-green-600 to-yellow-500 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-green-600 text-2xl font-bold">
                {userData.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{userData.name || 'Utilizator'}</h2>
                <p className="text-green-100">{user.email}</p>
                {userData.role === 'admin' && (
                  <span className="inline-block mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                    <Shield className="inline h-4 w-4 mr-1" />
                    Administrator
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Conținut card */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Informații personale</h3>
              {!editing ? (
                <Button
                  onClick={() => setEditing(true)}
                  variant="outline"
                  size="sm"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editează
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Se salvează...' : 'Salvează'}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Anulează
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Nume */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Nume complet
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Numele tău complet"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{userData.name || 'Nu este specificat'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Adresa de email
                </label>
                <p className="text-gray-900 py-2">{user.email}</p>
                <p className="text-xs text-gray-500">Email-ul nu poate fi modificat</p>
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Număr de telefon
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ex: 0712345678"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{userData.phone || 'Nu este specificat'}</p>
                )}
              </div>

              {/* Data înregistrării */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Membru din
                </label>
                <p className="text-gray-900 py-2">{formatDate(userData.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Footer card */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Contul tău este securizat și protejat
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Deconectează-te
              </Button>
            </div>
          </div>
        </div>

        {/* Statistici rapide */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Anunțuri publicate</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">0</div>
            <div className="text-sm text-gray-600">Anunțuri active</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">0</div>
            <div className="text-sm text-gray-600">Vizualizări totale</div>
          </div>
        </div>
      </div>
    </div>
  );
}
