'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Search, 
  Filter,
  MoreVertical,
  Shield,
  ShieldOff,
  Ban,
  CheckCircle,
  Mail,
  Calendar,
  MapPin,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  createdAt: Date;
  lastLogin?: Date;
  location?: string;
  listingsCount: number;
  verified: boolean;
}

export default function UsersManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // TODO(firebase): Înlocuiește cu date reale din Firebase
      // Mock data pentru dezvoltare
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'Maria Popescu',
            email: 'maria.popescu@example.com',
            role: 'user',
            status: 'active',
            createdAt: new Date('2024-01-15'),
            lastLogin: new Date('2024-01-20'),
            location: 'București',
            listingsCount: 12,
            verified: true
          },
          {
            id: '2',
            name: 'Ion Ionescu',
            email: 'ion.ionescu@example.com',
            role: 'admin',
            status: 'active',
            createdAt: new Date('2023-12-01'),
            lastLogin: new Date('2024-01-21'),
            location: 'Cluj-Napoca',
            listingsCount: 3,
            verified: true
          },
          {
            id: '3',
            name: 'Ana Georgescu',
            email: 'ana.georgescu@example.com',
            role: 'user',
            status: 'suspended',
            createdAt: new Date('2024-01-10'),
            lastLogin: new Date('2024-01-18'),
            location: 'Timișoara',
            listingsCount: 8,
            verified: false
          },
          {
            id: '4',
            name: 'Mihai Dumitrescu',
            email: 'mihai.dumitrescu@example.com',
            role: 'user',
            status: 'pending',
            createdAt: new Date('2024-01-21'),
            location: 'Iași',
            listingsCount: 0,
            verified: false
          }
        ];
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Eroare la încărcarea utilizatorilor:', error);
      setLoading(false);
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      // TODO(firebase): Implementează promovarea la admin
      console.log('Promovare la admin:', userId);
      // Actualizează local pentru demo
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: 'admin' as const } : u
      ));
    } catch (error) {
      console.error('Eroare la promovarea utilizatorului:', error);
    }
  };

  const handleDemoteFromAdmin = async (userId: string) => {
    try {
      // TODO(firebase): Implementează retrogradarea din admin
      console.log('Retrogradeaza din admin:', userId);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: 'user' as const } : u
      ));
    } catch (error) {
      console.error('Eroare la retrogradarea utilizatorului:', error);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      // TODO(firebase): Implementează suspendarea utilizatorului
      console.log('Suspendare utilizator:', userId);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: 'suspended' as const } : u
      ));
    } catch (error) {
      console.error('Eroare la suspendarea utilizatorului:', error);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      // TODO(firebase): Implementează activarea utilizatorului
      console.log('Activare utilizator:', userId);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: 'active' as const } : u
      ));
    } catch (error) {
      console.error('Eroare la activarea utilizatorului:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: User['status']) => {
    const classes = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[status]}`}>
        {status === 'active' ? 'Activ' : status === 'suspended' ? 'Suspendat' : 'În așteptare'}
      </span>
    );
  };

  const getRoleBadge = (role: User['role']) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {role === 'admin' ? 'Admin' : 'Utilizator'}
      </span>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Se încarcă utilizatorii...</p>
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
                  <Users className="h-6 w-6 mr-2" />
                  Gestionare Utilizatori
                </h1>
                <p className="text-gray-600">
                  Gestionează utilizatorii platformei ({filteredUsers.length} utilizatori)
                </p>
              </div>
              <div className="flex space-x-3">
                <Link href="/admin">
                  <Button variant="outline">
                    ← Înapoi la Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Caută utilizatori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Role Filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toate rolurile</option>
                <option value="user">Utilizatori</option>
                <option value="admin">Administratori</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toate statusurile</option>
                <option value="active">Activi</option>
                <option value="suspended">Suspendați</option>
                <option value="pending">În așteptare</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilizator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol & Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activitate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Anunțuri
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              {user.name}
                              {user.verified && (
                                <CheckCircle className="h-4 w-4 text-green-500 ml-1" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                            {user.location && (
                              <div className="text-xs text-gray-400 flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Înregistrat: {user.createdAt.toLocaleDateString('ro-RO')}
                          </div>
                          {user.lastLogin && (
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              Ultima vizită: {user.lastLogin.toLocaleDateString('ro-RO')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">{user.listingsCount}</span> anunțuri
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Role Actions */}
                          {user.role === 'user' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePromoteToAdmin(user.id)}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              Promovează Admin
                            </Button>
                          ) : user.id !== user.id && ( // Nu poate retrograda pe sine
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDemoteFromAdmin(user.id)}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              <ShieldOff className="h-3 w-3 mr-1" />
                              Retrogradează
                            </Button>
                          )}

                          {/* Status Actions */}
                          {user.status === 'active' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSuspendUser(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Ban className="h-3 w-3 mr-1" />
                              Suspendă
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleActivateUser(user.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Activează
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nu s-au găsit utilizatori</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Încearcă să modifici filtrele de căutare.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
