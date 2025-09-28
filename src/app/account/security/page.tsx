'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, ArrowLeft, Key, Smartphone, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function SecurityPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !auth.currentUser) return;
    
    setChangingPassword(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate passwords
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('Parolele noi nu se potrivesc');
      }
      
      if (passwordForm.newPassword.length < 6) {
        throw new Error('Parola nouă trebuie să aibă cel puțin 6 caractere');
      }
      
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordForm.currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await updatePassword(auth.currentUser, passwordForm.newPassword);
      
      setSuccess('Parola a fost schimbată cu succes!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (error: any) {
      console.error('Error changing password:', error);
      
      if (error.code === 'auth/wrong-password') {
        setError('Parola curentă este incorectă');
      } else if (error.code === 'auth/weak-password') {
        setError('Parola nouă este prea slabă');
      } else {
        setError(error.message || 'Eroare la schimbarea parolei');
      }
    } finally {
      setChangingPassword(false);
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
                  Securitate & 2FA
                </h1>
                <p className="text-sm text-gray-600">
                  Gestionează securitatea contului tău
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Password Change */}
        <div className="card mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Key className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Schimbă Parola
              </h2>
              <p className="text-sm text-gray-600">
                Actualizează parola pentru a-ți menține contul securizat
              </p>
            </div>
          </div>

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

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parola Curentă *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Introdu parola curentă"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parola Nouă *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Introdu parola nouă"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmă Parola Nouă *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Confirmă parola nouă"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={changingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
              className="btn-primary"
            >
              {changingPassword ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Se schimbă...
                </div>
              ) : (
                'Schimbă Parola'
              )}
            </button>
          </form>
        </div>

        {/* Two-Factor Authentication */}
        <div className="card mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Autentificare în Doi Pași (2FA)
              </h2>
              <p className="text-sm text-gray-600">
                Adaugă un nivel suplimentar de securitate
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">
                  Funcționalitate în Dezvoltare
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Autentificarea în doi pași va fi disponibilă în curând. 
                  Momentan, contul tău este protejat de Firebase Authentication.
                </p>
              </div>
            </div>
          </div>

          <button
            disabled
            className="btn-secondary opacity-50 cursor-not-allowed"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Configurează 2FA (În Curând)
          </button>
        </div>

        {/* Security Tips */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Sfaturi de Securitate
              </h2>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p>Folosește o parolă puternică cu cel puțin 8 caractere, cifre și simboluri</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p>Nu împărtăși niciodată parola cu alte persoane</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p>Schimbă parola periodic, cel puțin o dată la 6 luni</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p>Deconectează-te întotdeauna când folosești computere publice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
