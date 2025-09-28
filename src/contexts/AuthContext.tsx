'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role?: 'user' | 'admin';
  photoURL?: string;
  createdAt?: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: userData.name || firebaseUser.displayName || '',
            phone: userData.phone || '',
            role: userData.role || 'user',
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: userData.createdAt?.toDate() || new Date()
          };
          
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const createUserProfile = async (firebaseUser: FirebaseUser, additionalData: any = {}) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      const { displayName, email, photoURL } = firebaseUser;
      const createdAt = new Date();
      
      try {
        await setDoc(userRef, {
          name: additionalData.name || displayName || '',
          email,
          photoURL,
          role: 'user',
          createdAt,
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await createUserProfile(result.user);
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(result.user, {
        displayName: name
      });
      
      // Create user profile in Firestore
      await createUserProfile(result.user, { name });
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginWithGoogle,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to get user-friendly error messages
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Nu există niciun cont cu această adresă de email.';
    case 'auth/wrong-password':
      return 'Parola introdusă este incorectă.';
    case 'auth/email-already-in-use':
      return 'Există deja un cont cu această adresă de email.';
    case 'auth/weak-password':
      return 'Parola trebuie să aibă cel puțin 6 caractere.';
    case 'auth/invalid-email':
      return 'Adresa de email nu este validă.';
    case 'auth/too-many-requests':
      return 'Prea multe încercări. Încearcă din nou mai târziu.';
    case 'auth/network-request-failed':
      return 'Eroare de rețea. Verifică conexiunea la internet.';
    case 'auth/popup-closed-by-user':
      return 'Ai închis autentificarea. Încearcă din nou.';
    default:
      return 'A apărut o eroare la autentificare. Încearcă din nou.';
  }
}
