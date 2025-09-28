'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, ArrowLeft, Save, Mail, MessageCircle, Eye, Heart } from 'lucide-react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface NotificationSettings {
  email: {
    newMessages: boolean;
    listingViews: boolean;
    favorites: boolean;
    marketing: boolean;
  };
  push: {
    newMessages: boolean;
    listingViews: boolean;
    favorites: boolean;
  };
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      newMessages: true,
      listingViews: false,
      favorites: true,
      marketing: false
    },
    push: {
      newMessages: true,
      listingViews: false,
      favorites: true
    }
  });

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.id), {
        notificationSettings: settings,
        updatedAt: serverTimestamp()
      });
      
      setSuccess('Setările de notificare au fost salvate!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateEmailSetting = (key: keyof NotificationSettings['email'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      email: { ...prev.email, [key]: value }
    }));
  };

  const updatePushSetting = (key: keyof NotificationSettings['push'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      push: { ...prev.push, [key]: value }
    }));
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
                  Setări Notificări
                </h1>
                <p className="text-sm text-gray-600">
                  Gestionează cum vrei să fii notificat
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Email Notifications */}
        <div className="card mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Notificări Email
              </h2>
              <p className="text-sm text-gray-600">
                Primește notificări pe {user.email}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Mesaje noi</div>
                  <div className="text-sm text-gray-600">Când cineva îți trimite un mesaj</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email.newMessages}
                  onChange={(e) => updateEmailSetting('newMessages', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Vizualizări anunțuri</div>
                  <div className="text-sm text-gray-600">Când cineva vizualizează anunțurile tale</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email.listingViews}
                  onChange={(e) => updateEmailSetting('listingViews', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Favorite</div>
                  <div className="text-sm text-gray-600">Când cineva adaugă anunțurile tale la favorite</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email.favorites}
                  onChange={(e) => updateEmailSetting('favorites', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Marketing</div>
                  <div className="text-sm text-gray-600">Sfaturi, noutăți și oferte speciale</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email.marketing}
                  onChange={(e) => updateEmailSetting('marketing', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="card mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Bell className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Notificări Push
              </h2>
              <p className="text-sm text-gray-600">
                Notificări instant în browser
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Mesaje noi</div>
                  <div className="text-sm text-gray-600">Notificare instant pentru mesaje</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.push.newMessages}
                  onChange={(e) => updatePushSetting('newMessages', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Vizualizări anunțuri</div>
                  <div className="text-sm text-gray-600">Când anunțurile tale sunt vizualizate</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.push.listingViews}
                  onChange={(e) => updatePushSetting('listingViews', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Favorite</div>
                  <div className="text-sm text-gray-600">Când anunțurile tale sunt adăugate la favorite</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.push.favorites}
                  onChange={(e) => updatePushSetting('favorites', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
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
                Salvează Setările
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
