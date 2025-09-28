'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Save,
  Globe,
  Mail,
  Shield,
  Bell,
  Palette,
  Database,
  Users,
  FileText,
  DollarSign,
  Smartphone,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface SiteSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    contactEmail: string;
    supportEmail: string;
    phone: string;
    address: string;
  };
  features: {
    userRegistration: boolean;
    emailVerification: boolean;
    moderationRequired: boolean;
    paidListings: boolean;
    messaging: boolean;
    reviews: boolean;
    favorites: boolean;
    notifications: boolean;
  };
  limits: {
    maxImagesPerListing: number;
    maxListingsPerUser: number;
    listingExpirationDays: number;
    maxDescriptionLength: number;
    minPriceAmount: number;
    maxPriceAmount: number;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    adminAlerts: boolean;
    userWelcomeEmail: boolean;
    listingApprovalEmail: boolean;
    reportNotifications: boolean;
  };
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    faviconUrl: string;
    customCss: string;
    darkMode: boolean;
  };
}

export default function SiteSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>({
    general: {
      siteName: 'Ai Nostri',
      siteDescription: 'Platforma de anunțuri pentru comunitatea română din Franța',
      siteUrl: 'https://ainostri.fr',
      contactEmail: 'contact@ainostri.fr',
      supportEmail: 'support@ainostri.fr',
      phone: '+33 1 23 45 67 89',
      address: 'Paris, Franța'
    },
    features: {
      userRegistration: true,
      emailVerification: true,
      moderationRequired: true,
      paidListings: false,
      messaging: true,
      reviews: true,
      favorites: true,
      notifications: true
    },
    limits: {
      maxImagesPerListing: 10,
      maxListingsPerUser: 50,
      listingExpirationDays: 90,
      maxDescriptionLength: 5000,
      minPriceAmount: 1,
      maxPriceAmount: 1000000
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminAlerts: true,
      userWelcomeEmail: true,
      listingApprovalEmail: true,
      reportNotifications: true
    },
    appearance: {
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      logoUrl: '/logo.png',
      faviconUrl: '/favicon.ico',
      customCss: '',
      darkMode: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO(firebase): Salvează setările în Firebase
      console.log('Salvare setări:', settings);
      
      // Simulare salvare
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage({ type: 'success', message: 'Setările au fost salvate cu succes!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Eroare la salvarea setărilor:', error);
      setSaveMessage({ type: 'error', message: 'Eroare la salvarea setărilor. Încearcă din nou.' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (section: keyof SiteSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'features', name: 'Funcționalități', icon: Settings },
    { id: 'limits', name: 'Limite', icon: Shield },
    { id: 'notifications', name: 'Notificări', icon: Bell },
    { id: 'appearance', name: 'Aspect', icon: Palette }
  ];

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Settings className="h-6 w-6 mr-2" />
                  Setări Site
                </h1>
                <p className="text-gray-600">
                  Configurează setările generale ale platformei
                </p>
              </div>
              <div className="flex space-x-3">
                <Link href="/admin">
                  <Button variant="outline">
                    ← Înapoi la Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvează Toate
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4`}>
            <div className={`rounded-md p-4 ${
              saveMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {saveMessage.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {saveMessage.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Setări Generale</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numele Site-ului
                        </label>
                        <input
                          type="text"
                          value={settings.general.siteName}
                          onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL Site
                        </label>
                        <input
                          type="url"
                          value={settings.general.siteUrl}
                          onChange={(e) => updateSettings('general', 'siteUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descrierea Site-ului
                        </label>
                        <textarea
                          value={settings.general.siteDescription}
                          onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Contact
                        </label>
                        <input
                          type="email"
                          value={settings.general.contactEmail}
                          onChange={(e) => updateSettings('general', 'contactEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Support
                        </label>
                        <input
                          type="email"
                          value={settings.general.supportEmail}
                          onChange={(e) => updateSettings('general', 'supportEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          value={settings.general.phone}
                          onChange={(e) => updateSettings('general', 'phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresă
                        </label>
                        <input
                          type="text"
                          value={settings.general.address}
                          onChange={(e) => updateSettings('general', 'address', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Settings */}
                {activeTab === 'features' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Funcționalități</h3>
                    
                    <div className="space-y-4">
                      {Object.entries(settings.features).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {key === 'userRegistration' && 'Înregistrare Utilizatori'}
                              {key === 'emailVerification' && 'Verificare Email'}
                              {key === 'moderationRequired' && 'Moderare Obligatorie'}
                              {key === 'paidListings' && 'Anunțuri Plătite'}
                              {key === 'messaging' && 'Sistem Mesagerie'}
                              {key === 'reviews' && 'Sistem Review-uri'}
                              {key === 'favorites' && 'Lista Favorite'}
                              {key === 'notifications' && 'Notificări'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {key === 'userRegistration' && 'Permite utilizatorilor să se înregistreze'}
                              {key === 'emailVerification' && 'Cere verificarea email-ului la înregistrare'}
                              {key === 'moderationRequired' && 'Anunțurile trebuie aprobate de admin'}
                              {key === 'paidListings' && 'Activează funcționalitatea de anunțuri plătite'}
                              {key === 'messaging' && 'Permite mesageria între utilizatori'}
                              {key === 'reviews' && 'Permite review-uri și rating-uri'}
                              {key === 'favorites' && 'Permite salvarea anunțurilor favorite'}
                              {key === 'notifications' && 'Activează sistemul de notificări'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => updateSettings('features', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Limits Settings */}
                {activeTab === 'limits' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Limite și Restricții</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max. Imagini per Anunț
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={settings.limits.maxImagesPerListing}
                          onChange={(e) => updateSettings('limits', 'maxImagesPerListing', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max. Anunțuri per Utilizator
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={settings.limits.maxListingsPerUser}
                          onChange={(e) => updateSettings('limits', 'maxListingsPerUser', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expirare Anunțuri (zile)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={settings.limits.listingExpirationDays}
                          onChange={(e) => updateSettings('limits', 'listingExpirationDays', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max. Lungime Descriere
                        </label>
                        <input
                          type="number"
                          min="100"
                          max="10000"
                          value={settings.limits.maxDescriptionLength}
                          onChange={(e) => updateSettings('limits', 'maxDescriptionLength', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preț Minim (€)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={settings.limits.minPriceAmount}
                          onChange={(e) => updateSettings('limits', 'minPriceAmount', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preț Maxim (€)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={settings.limits.maxPriceAmount}
                          onChange={(e) => updateSettings('limits', 'maxPriceAmount', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Setări Notificări</h3>
                    
                    <div className="space-y-4">
                      {Object.entries(settings.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {key === 'emailNotifications' && 'Notificări Email'}
                              {key === 'smsNotifications' && 'Notificări SMS'}
                              {key === 'pushNotifications' && 'Notificări Push'}
                              {key === 'adminAlerts' && 'Alerte Admin'}
                              {key === 'userWelcomeEmail' && 'Email Bun Venit'}
                              {key === 'listingApprovalEmail' && 'Email Aprobare Anunț'}
                              {key === 'reportNotifications' && 'Notificări Rapoarte'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {key === 'emailNotifications' && 'Trimite notificări prin email'}
                              {key === 'smsNotifications' && 'Trimite notificări prin SMS'}
                              {key === 'pushNotifications' && 'Trimite notificări push în browser'}
                              {key === 'adminAlerts' && 'Trimite alerte către administratori'}
                              {key === 'userWelcomeEmail' && 'Trimite email de bun venit la înregistrare'}
                              {key === 'listingApprovalEmail' && 'Trimite email când anunțul este aprobat'}
                              {key === 'reportNotifications' && 'Notifică când sunt raportate probleme'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => updateSettings('notifications', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Setări Aspect</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Culoare Primară
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={settings.appearance.primaryColor}
                            onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.appearance.primaryColor}
                            onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Culoare Secundară
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={settings.appearance.secondaryColor}
                            onChange={(e) => updateSettings('appearance', 'secondaryColor', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.appearance.secondaryColor}
                            onChange={(e) => updateSettings('appearance', 'secondaryColor', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL Logo
                        </label>
                        <input
                          type="url"
                          value={settings.appearance.logoUrl}
                          onChange={(e) => updateSettings('appearance', 'logoUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL Favicon
                        </label>
                        <input
                          type="url"
                          value={settings.appearance.faviconUrl}
                          onChange={(e) => updateSettings('appearance', 'faviconUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CSS Personalizat
                        </label>
                        <textarea
                          value={settings.appearance.customCss}
                          onChange={(e) => updateSettings('appearance', 'customCss', e.target.value)}
                          rows={6}
                          placeholder="/* Adaugă CSS personalizat aici */"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Mod Întunecat</h4>
                            <p className="text-sm text-gray-500">Activează tema întunecată pentru site</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.appearance.darkMode}
                              onChange={(e) => updateSettings('appearance', 'darkMode', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
