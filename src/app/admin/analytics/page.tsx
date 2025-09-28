'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Eye,
  DollarSign,
  MapPin,
  Tag,
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalUsers: number;
    totalListings: number;
    totalRevenue: number;
    viewsChange: number;
    usersChange: number;
    listingsChange: number;
    revenueChange: number;
  };
  chartData: {
    daily: Array<{ date: string; views: number; users: number; listings: number }>;
    categories: Array<{ name: string; count: number; percentage: number }>;
    locations: Array<{ name: string; count: number; percentage: number }>;
  };
  topPerformers: {
    listings: Array<{ id: string; title: string; views: number; category: string }>;
    users: Array<{ id: string; name: string; listings: number; views: number }>;
  };
}

export default function Analytics() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');
  const [activeChart, setActiveChart] = useState<'views' | 'users' | 'listings'>('views');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // TODO(firebase): Înlocuiește cu date reale din Firebase Analytics
      // Mock data pentru dezvoltare
      setTimeout(() => {
        const mockData: AnalyticsData = {
          overview: {
            totalViews: 156780,
            totalUsers: 12470,
            totalListings: 3891,
            totalRevenue: 23400,
            viewsChange: 12.5,
            usersChange: 8.3,
            listingsChange: 15.7,
            revenueChange: 23.1
          },
          chartData: {
            daily: [
              { date: '2024-01-15', views: 2340, users: 180, listings: 45 },
              { date: '2024-01-16', views: 2890, users: 220, listings: 52 },
              { date: '2024-01-17', views: 3120, users: 195, listings: 38 },
              { date: '2024-01-18', views: 2750, users: 210, listings: 41 },
              { date: '2024-01-19', views: 3450, users: 245, listings: 67 },
              { date: '2024-01-20', views: 3890, users: 280, listings: 73 },
              { date: '2024-01-21', views: 4120, users: 310, listings: 89 }
            ],
            categories: [
              { name: 'Electronice & IT', count: 1247, percentage: 32.1 },
              { name: 'Auto & Moto', count: 892, percentage: 22.9 },
              { name: 'Imobiliare', count: 634, percentage: 16.3 },
              { name: 'Modă & Beauty', count: 456, percentage: 11.7 },
              { name: 'Casa & Grădina', count: 389, percentage: 10.0 },
              { name: 'Altele', count: 273, percentage: 7.0 }
            ],
            locations: [
              { name: 'București', count: 1456, percentage: 37.4 },
              { name: 'Cluj-Napoca', count: 892, percentage: 22.9 },
              { name: 'Timișoara', count: 567, percentage: 14.6 },
              { name: 'Iași', count: 423, percentage: 10.9 },
              { name: 'Constanța', count: 312, percentage: 8.0 },
              { name: 'Altele', count: 241, percentage: 6.2 }
            ]
          },
          topPerformers: {
            listings: [
              { id: '1', title: 'iPhone 13 Pro Max 256GB', views: 2340, category: 'Electronice' },
              { id: '2', title: 'BMW Seria 3 - 2019', views: 1890, category: 'Auto' },
              { id: '3', title: 'Apartament 3 camere Herastrau', views: 1567, category: 'Imobiliare' },
              { id: '4', title: 'MacBook Pro M1', views: 1234, category: 'Electronice' },
              { id: '5', title: 'Audi A4 - 2020', views: 1123, category: 'Auto' }
            ],
            users: [
              { id: '1', name: 'Maria Popescu', listings: 23, views: 12340 },
              { id: '2', name: 'Ion Ionescu', listings: 18, views: 9870 },
              { id: '3', name: 'Ana Georgescu', listings: 15, views: 8450 },
              { id: '4', name: 'Mihai Dumitrescu', listings: 12, views: 6780 },
              { id: '5', name: 'Elena Vasilescu', listings: 10, views: 5430 }
            ]
          }
        };
        setData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Eroare la încărcarea analytics:', error);
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      console.log(`Export ${format} pentru perioada ${dateRange}`);
      // TODO: Implementează exportul real
    } catch (error) {
      console.error('Eroare la export:', error);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ro-RO').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  if (loading || !data) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Se încarcă analytics...</p>
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
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2" />
                  Analytics & Rapoarte
                </h1>
                <p className="text-gray-600">
                  Analizează performanța platformei și generează rapoarte
                </p>
              </div>
              <div className="flex space-x-3">
                <Link href="/admin">
                  <Button variant="outline">
                    ← Înapoi la Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={loadAnalytics}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizează
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="7days">Ultimele 7 zile</option>
                    <option value="30days">Ultimele 30 zile</option>
                    <option value="90days">Ultimele 90 zile</option>
                    <option value="1year">Ultimul an</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleExport('csv')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  onClick={() => handleExport('pdf')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vizualizări</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(data.overview.totalViews)}</p>
                  <div className="flex items-center mt-1">
                    {data.overview.viewsChange >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${data.overview.viewsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(data.overview.viewsChange)}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Utilizatori</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(data.overview.totalUsers)}</p>
                  <div className="flex items-center mt-1">
                    {data.overview.usersChange >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${data.overview.usersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(data.overview.usersChange)}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Anunțuri</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(data.overview.totalListings)}</p>
                  <div className="flex items-center mt-1">
                    {data.overview.listingsChange >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${data.overview.listingsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(data.overview.listingsChange)}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Venituri</p>
                  <p className="text-2xl font-bold text-gray-900">€{formatNumber(data.overview.totalRevenue)}</p>
                  <div className="flex items-center mt-1">
                    {data.overview.revenueChange >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${data.overview.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(data.overview.revenueChange)}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Time Series Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Evoluție în Timp</h3>
                <div className="flex space-x-2">
                  {(['views', 'users', 'listings'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveChart(type)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        activeChart === type
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {type === 'views' && 'Vizualizări'}
                      {type === 'users' && 'Utilizatori'}
                      {type === 'listings' && 'Anunțuri'}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Simple Chart Visualization */}
              <div className="h-64 flex items-end justify-between space-x-2">
                {data.chartData.daily.map((day, index) => {
                  const value = day[activeChart];
                  const maxValue = Math.max(...data.chartData.daily.map(d => d[activeChart]));
                  const height = (value / maxValue) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${height}%` }}
                        title={`${new Date(day.date).toLocaleDateString('ro-RO')}: ${formatNumber(value)}`}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date(day.date).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Categories Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Distribuție Categorii
              </h3>
              <div className="space-y-3">
                {data.chartData.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <span className="text-sm font-medium text-gray-900 w-32 truncate">
                        {category.name}
                      </span>
                      <div className="flex-1 mx-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{formatNumber(category.count)}</div>
                      <div className="text-xs text-gray-500">{category.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Listings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Top Anunțuri
              </h3>
              <div className="space-y-3">
                {data.topPerformers.listings.map((listing, index) => (
                  <div key={listing.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {listing.title}
                        </p>
                        <p className="text-xs text-gray-500">{listing.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{formatNumber(listing.views)}</div>
                      <div className="text-xs text-gray-500">vizualizări</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Users */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Top Utilizatori
              </h3>
              <div className="space-y-3">
                {data.topPerformers.users.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.listings} anunțuri</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{formatNumber(user.views)}</div>
                      <div className="text-xs text-gray-500">vizualizări</div>
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
