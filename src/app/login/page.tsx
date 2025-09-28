'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, login, register, loginWithGoogle } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      console.log('User detected, redirecting...', user);
      if (user.role === 'admin') {
        console.log('Redirecting admin to /admin');
        router.push('/admin');
      } else {
        console.log('Redirecting user to /account');
        router.push('/account');
      }
    }
  }, [user, authLoading, router]);

  // Show loading if auth is loading or user is authenticated (redirecting)
  if (authLoading || user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {user ? 'Redirecționare...' : 'Se încarcă...'}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Parolele nu se potrivesc');
        }
        if (formData.password.length < 6) {
          throw new Error('Parola trebuie să aibă cel puțin 6 caractere');
        }
        await register(formData.email, formData.password, formData.name);
      }
      
      // Redirect will be handled by AuthContext after user data is loaded
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Eroare autentificare:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      // Redirect will be handled by AuthContext after user data is loaded
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Eroare Google Sign-In:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error: any) => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Nu există un cont cu această adresă de email';
      case 'auth/wrong-password':
        return 'Parolă incorectă';
      case 'auth/email-already-in-use':
        return 'Există deja un cont cu această adresă de email';
      case 'auth/weak-password':
        return 'Parola este prea slabă';
      case 'auth/invalid-email':
        return 'Adresa de email nu este validă';
      case 'auth/too-many-requests':
        return 'Prea multe încercări. Încearcă din nou mai târziu';
      default:
        return error.message || 'A apărut o eroare. Te rog să încerci din nou';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600/70 via-yellow-500/60 to-orange-500/80 flex items-center justify-center p-4">
      {/* Imagine de fundal */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2089&q=80"
          alt="Oameni care se țin de mână - unire și prietenie"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-orange-900/10"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Link înapoi */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Înapoi acasă
            </Button>
          </Link>
        </div>

        {/* Card login */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Bun venit înapoi!' : 'Creează un cont'}
            </h1>
            <p className="text-gray-600">
              {isLogin 
                ? 'Conectează-te pentru a accesa contul tău' 
                : 'Înregistrează-te pentru a publica anunțuri'
              }
            </p>
          </div>

          {/* Eroare */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Formular */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nume (doar pentru înregistrare) */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nume complet
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Numele tău complet"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresa de email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="exemplu@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>

            {/* Parolă */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Parola
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Parola ta"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirmare parolă (doar pentru înregistrare) */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmă parola
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirmă parola"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Buton submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
            >
              {loading ? 'Se procesează...' : (isLogin ? 'Conectează-te' : 'Creează contul')}
            </Button>
          </form>

          {/* Separator */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">sau</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Sign-In */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outline"
            className="w-full border-gray-300 py-3 text-lg font-semibold"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuă cu Google
          </Button>

          {/* Toggle între login și înregistrare */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? 'Nu ai un cont?' : 'Ai deja un cont?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ email: '', password: '', name: '', confirmPassword: '' });
                }}
                className="ml-2 text-green-600 hover:text-green-700 font-semibold"
              >
                {isLogin ? 'Înregistrează-te' : 'Conectează-te'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
