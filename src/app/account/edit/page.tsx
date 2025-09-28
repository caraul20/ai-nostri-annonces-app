'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Camera, ArrowLeft, Save, X } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await updateDoc(doc(db, 'users', user.id), {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        updatedAt: serverTimestamp()
      });
      
      setSuccess('Profilul a fost actualizat cu succes!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/account');
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Eroare la actualizarea profilului. Încearcă din nou.');
    } finally {
      setSaving(false);
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

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/account">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Editează Profilul
                </h1>
                <p className="text-sm text-gray-600">
                  Actualizează informațiile tale personale
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Photo Section */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Fotografia de Profil
            </h2>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profil" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-green-600" />
                )}
              </div>
              <div>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Schimbă Fotografia
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  TODO: Implementare upload imagine
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informații Personale
            </h2>
            
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Nume Complet *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Introdu numele tău complet"
                  required
                />
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email-ul nu poate fi modificat
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Telefon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Introdu numărul de telefon"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Despre tine
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Scrie câteva cuvinte despre tine..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.bio.length}/500 caractere
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Link href="/account">
              <button type="button" className="btn-secondary">
                <X className="h-4 w-4 mr-2" />
                Anulează
              </button>
            </Link>
            
            <button
              type="submit"
              disabled={saving || !formData.name.trim()}
              className="btn-primary"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Se salvează...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvează Modificările
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
