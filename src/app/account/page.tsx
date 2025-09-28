'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { User, Shield, Edit2, LogOut } from 'lucide-react';
import Link from 'next/link';
import KpiCards from '@/components/account/KpiCards';
import Tabs from '@/components/account/Tabs';
import MyListingsTable from '@/components/account/MyListingsTable';
import ChatInbox from '@/components/account/ChatInbox';
import FavoritesGrid from '@/components/account/FavoritesGrid';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useUserListings } from '@/hooks/useUserListings';
import { useChatInbox } from '@/hooks/useChatInbox';
import { useFavorites } from '@/hooks/useFavorites';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, logout } = useAuth();
  const activeTab = searchParams.get('tab') || 'anunturi';
  
  const { listings, loading: listingsLoading, stats } = useUserListings(user?.id);
  const { chats, unreadTotal } = useChatInbox(user?.id);
  const { favorites, count: favoritesCount } = useFavorites(user?.id);

  // Redirect admin users
  if (!loading && user?.role === 'admin') {
    router.push('/admin');
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mesaje':
        return <ChatInbox chats={chats} />;
      case 'favorite':
        return <FavoritesGrid favorites={favorites} />;
      case 'setari':
        return (
          <div className="card space-y-4">
            <h3 className="text-lg font-semibold">Setări Cont</h3>
            <div className="space-y-3">
              <Link href="/account/edit" className="block p-3 border rounded-xl hover:bg-gray-50">
                <div className="font-medium">Editează Profilul</div>
                <div className="text-sm text-gray-600">Actualizează informațiile personale</div>
              </Link>
              <Link href="/account/notifications" className="block p-3 border rounded-xl hover:bg-gray-50">
                <div className="font-medium">Notificări</div>
                <div className="text-sm text-gray-600">Gestionează preferințele de notificare</div>
              </Link>
              <Link href="/account/security" className="block p-3 border rounded-xl hover:bg-gray-50">
                <div className="font-medium">Securitate & 2FA</div>
                <div className="text-sm text-gray-600">Parole și autentificare în doi pași</div>
              </Link>
            </div>
          </div>
        );
      default:
        return <MyListingsTable listings={listings} loading={listingsLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Înapoi
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700"
            aria-label="Deconectare"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Header Card */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.name || 'Avatar'} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-green-600" aria-hidden="true" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {user.name || 'Utilizator'}
                </h1>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex items-center mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrator' : 'Utilizator'}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-3">
              <Link href="/account/edit">
                <button className="btn-secondary">
                  <Edit2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Editează profil
                </button>
              </Link>
              <Link href="/">
                <button className="btn-secondary">
                  Înapoi la Site
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary text-red-600 hover:text-red-700"
                aria-label="Deconectare"
              >
                <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                Deconectare
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <KpiCards 
          activeCount={stats.activeCount}
          viewsTotal={stats.viewsTotal}
          messagesTotal={unreadTotal}
          favoritesCount={favoritesCount}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
          {/* Left Column - Tabs & Content */}
          <div className="space-y-6">
            <Tabs activeTab={activeTab} unreadCount={unreadTotal} />
            {renderTabContent()}
          </div>

          {/* Right Column - Sidebar */}
          <AccountSidebar user={user} />
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
