'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  DollarSign,
  Calendar,
  MapPin,
  Tag,
  Settings,
  BarChart3,
  UserCheck,
  Shield
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  reportedListings: number;
  todayViews: number;
  monthlyRevenue: number;
  newUsersToday: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalListings: 0,
    activeListings: 0,
    pendingListings: 0,
    reportedListings: 0,
    todayViews: 0,
    monthlyRevenue: 0,
    newUsersToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // TODO(firebase): Înlocuiește cu date reale din Firebase
      // Mock data pentru dezvoltare
      setTimeout(() => {
        setStats({
          totalUsers: 1247,
          totalListings: 3891,
          activeListings: 3456,
          pendingListings: 23,
          reportedListings: 12,
          todayViews: 15678,
          monthlyRevenue: 2340,
          newUsersToday: 18
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Eroare la încărcarea statisticilor:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'blue',
    change,
    href 
  }: {
    title: string;
    value: string | number;
    icon: any;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
    change?: string;
    href?: string;
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500 text-blue-100',
      green: 'bg-green-500 text-green-100',
      yellow: 'bg-yellow-500 text-yellow-100',
      red: 'bg-red-500 text-red-100',
      purple: 'bg-purple-500 text-purple-100'
    };

    const CardContent = (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change && (
              <p className="text-sm text-green-600 mt-1">
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    );

    return href ? (
      <Link href={href} className="block">
        {CardContent}
      </Link>
    ) : (
      CardContent
    );
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Se încarcă dashboard-ul...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Admin
                </h1>
                <p className="text-gray-600">
                  Bun venit, {user?.email}! Gestionează platforma Ai Nostri.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => router.push('/')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Vezi Site-ul
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/admin/settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Setări
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Utilizatori"
              value={stats.totalUsers.toLocaleString()}
              icon={Users}
              color="blue"
              change="+12% față de luna trecută"
              href="/admin/users"
            />
            <StatCard
              title="Anunțuri Active"
              value={stats.activeListings.toLocaleString()}
              icon={FileText}
              color="green"
              change="+8% față de săptămâna trecută"
              href="/admin/moderation"
            />
            <StatCard
              title="În Așteptare"
              value={stats.pendingListings}
              icon={AlertTriangle}
              color="yellow"
              href="/admin/moderation?filter=pending"
            />
            <StatCard
              title="Raportate"
              value={stats.reportedListings}
              icon={Shield}
              color="red"
              href="/admin/moderation?filter=reported"
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Vizualizări Azi"
              value={stats.todayViews.toLocaleString()}
              icon={TrendingUp}
              color="purple"
              change="+15% față de ieri"
            />
            <StatCard
              title="Venituri Luna"
              value={`€${stats.monthlyRevenue}`}
              icon={DollarSign}
              color="green"
              change="+23% față de luna trecută"
            />
            <StatCard
              title="Utilizatori Noi Azi"
              value={stats.newUsersToday}
              icon={UserCheck}
              color="blue"
              change="+5 față de ieri"
            />
            <StatCard
              title="Total Anunțuri"
              value={stats.totalListings.toLocaleString()}
              icon={BarChart3}
              color="purple"
              change="+156 această săptămână"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Acțiuni Rapide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Gestionează Utilizatori
                </Button>
              </Link>
              <Link href="/admin/moderation">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Moderare Anunțuri
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full justify-start">
                  <Tag className="h-4 w-4 mr-2" />
                  Categorii & Locații
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics & Rapoarte
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Utilizatori Recenți
                </h3>
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm">
                    Vezi Toți
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {/* TODO: Replace with real data */}
                {[
                  { name: 'Maria Popescu', email: 'maria@example.com', time: '2 min' },
                  { name: 'Ion Ionescu', email: 'ion@example.com', time: '15 min' },
                  { name: 'Ana Georgescu', email: 'ana@example.com', time: '1h' },
                  { name: 'Mihai Dumitrescu', email: 'mihai@example.com', time: '2h' }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{user.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Listings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Anunțuri Recente
                </h3>
                <Link href="/admin/moderation">
                  <Button variant="ghost" size="sm">
                    Vezi Toate
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {/* TODO: Replace with real data */}
                {[
                  { title: 'iPhone 13 Pro Max', price: '€800', status: 'active', time: '5 min' },
                  { title: 'Apartament 3 camere', price: '€120,000', status: 'pending', time: '20 min' },
                  { title: 'BMW Seria 3', price: '€25,000', status: 'active', time: '1h' },
                  { title: 'Laptop Gaming', price: '€1,200', status: 'reported', time: '3h' }
                ].map((listing, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{listing.title}</p>
                      <p className="text-xs text-gray-500">{listing.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        listing.status === 'active' ? 'bg-green-100 text-green-800' :
                        listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {listing.status}
                      </span>
                      <span className="text-xs text-gray-400">{listing.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
