'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, LogOut, Settings } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function AuthHeader() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error('Eroare la deconectare:', error);
    }
  };

  if (!user) {
    return (
      <Link href="/login">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-700 hover:text-green-600 hover:bg-green-50 border border-gray-200 hover:border-green-300 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <User className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Conectează-te</span>
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 text-gray-700 hover:text-green-600 px-3 py-2 rounded-xl transition-all duration-200"
      >
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
        </div>
        <span className="hidden sm:inline font-medium">
          {user?.name || 'Utilizator'}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[60]">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || 'Utilizator'}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            {user?.role === 'admin' && (
              <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Admin
              </span>
            )}
          </div>
          
          <Link href="/account" onClick={() => setShowDropdown(false)}>
            <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <Settings className="h-4 w-4 mr-2" />
              Contul meu
            </div>
          </Link>
          
          {user?.role === 'admin' && (
            <Link href="/admin/moderation" onClick={() => setShowDropdown(false)}>
              <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Settings className="h-4 w-4 mr-2" />
                Moderare
              </div>
            </Link>
          )}
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Deconectează-te
          </button>
        </div>
      )}
    </div>
  );
}
