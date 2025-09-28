'use client';

import { createContext, useContext, useEffect, useState } from 'react';
// Firebase temporar dezactivat - folosim mock auth
console.log('Auth dezactivat - folosim mock');

interface UserData {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: any;
}

// Mock User interface
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false); // Mock - nu avem loading

  // Mock - simulează autentificarea
  const signIn = async (email: string, password: string) => {
    console.log('Mock: Sign in cu', email);
    // Simulează un delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user
    const mockUser: MockUser = {
      uid: 'mock-user-id',
      email: email,
      displayName: 'Utilizator Mock'
    };
    
    const mockUserData: UserData = {
      uid: 'mock-user-id',
      email: email,
      name: 'Utilizator Mock',
      role: 'user',
      createdAt: new Date()
    };
    
    setUser(mockUser);
    setUserData(mockUserData);
  };

  // Mock - simulează înregistrarea
  const signUp = async (email: string, password: string, name: string) => {
    console.log('Mock: Sign up cu', email, name);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: MockUser = {
      uid: 'mock-user-id-new',
      email: email,
      displayName: name
    };
    
    const mockUserData: UserData = {
      uid: 'mock-user-id-new',
      email: email,
      name: name,
      role: 'user',
      createdAt: new Date()
    };
    
    setUser(mockUser);
    setUserData(mockUserData);
  };

  // Mock - simulează Google Sign-In
  const signInWithGoogle = async () => {
    console.log('Mock: Google Sign-In');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: MockUser = {
      uid: 'mock-google-user',
      email: 'user@gmail.com',
      displayName: 'Google User'
    };
    
    const mockUserData: UserData = {
      uid: 'mock-google-user',
      email: 'user@gmail.com',
      name: 'Google User',
      role: 'user',
      createdAt: new Date()
    };
    
    setUser(mockUser);
    setUserData(mockUserData);
  };

  // Mock - simulează deconectarea
  const logout = async () => {
    console.log('Mock: Logout');
    setUser(null);
    setUserData(null);
  };

  // Mock - simulează actualizarea profilului
  const updateUserProfile = async (data: Partial<UserData>) => {
    console.log('Mock: Update profile', data);
    if (userData) {
      setUserData({ ...userData, ...data });
    }
  };

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
