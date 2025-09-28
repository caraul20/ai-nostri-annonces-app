'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminSetup() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSetupAdmin = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Trebuie să fii autentificat!' });
      return;
    }

    setLoading(true);
    try {
      // Update user role to admin
      await updateDoc(doc(db, 'users', user.id), {
        role: 'admin',
        promotedAt: new Date(),
        promotedBy: 'self-setup'
      });

      setMessage({ 
        type: 'success', 
        text: 'Cont setat ca admin cu succes! Refresh pagina pentru a accesa dashboard-ul.' 
      });

      // Refresh after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error setting up admin:', error);
      setMessage({ 
        type: 'error', 
        text: 'Eroare la setarea admin. Verifică consola pentru detalii.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Setup
          </h1>
          <p className="text-gray-600 mb-6">
            Setează contul curent ca administrator pentru a accesa dashboard-ul admin.
          </p>

          {user ? (
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Utilizator curent:</strong><br />
                  {user.name || 'N/A'}<br />
                  {user.email}
                </p>
                {user.role === 'admin' && (
                  <div className="mt-2 flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Deja admin!</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm">Nu ești autentificat!</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  <a href="/login" className="underline">Loghează-te</a> mai întâi.
                </p>
              </div>
            </div>
          )}

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <AlertTriangle className="h-4 w-4 mr-2" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            </div>
          )}

          <Button
            onClick={handleSetupAdmin}
            disabled={!user || loading || user.role === 'admin'}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Se procesează...
              </div>
            ) : user?.role === 'admin' ? (
              'Deja Admin - Accesează Dashboard'
            ) : (
              'Setează ca Admin'
            )}
          </Button>

          {user?.role === 'admin' && (
            <div className="mt-4">
              <a 
                href="/admin" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
              >
                <Shield className="h-4 w-4 mr-1" />
                Accesează Admin Dashboard
              </a>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              ⚠️ Această pagină este doar pentru setup inițial.<br />
              În producție, adminii ar trebui setați manual în Firestore.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
