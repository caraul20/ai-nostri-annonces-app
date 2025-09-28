import { Plus, Bell, Shield, Lightbulb, Star, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name?: string;
  email: string;
  role?: 'user' | 'admin';
}

interface AccountSidebarProps {
  user: User;
}

export default function AccountSidebar({ user }: AccountSidebarProps) {
  const quickActions = [
    {
      label: 'Publică Anunț Nou',
      href: '/new',
      icon: Plus,
      primary: true
    },
    {
      label: 'Setări Notificări',
      href: '/account/notifications',
      icon: Bell
    },
    {
      label: 'Securitate & 2FA',
      href: '/account/security',
      icon: Shield
    }
  ];

  const tips = [
    {
      icon: Star,
      title: 'Fotografii de calitate',
      description: 'Anunțurile cu imagini clare primesc cu 70% mai multe vizualizări.'
    },
    {
      icon: TrendingUp,
      title: 'Preț competitiv',
      description: 'Verifică prețurile similare pentru a atrage mai mulți cumpărători.'
    },
    {
      icon: Users,
      title: 'Răspunde rapid',
      description: 'Răspunsurile rapide la mesaje cresc șansele de vânzare.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Acțiuni Rapide
        </h3>
        <div className="space-y-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <button 
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-colors min-h-[44px] ${
                    action.primary 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span className="font-medium">{action.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Admin Access */}
      {user.role === 'admin' && (
        <div className="card bg-purple-50 border-purple-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-purple-600" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900">
                Acces Administrator
              </h3>
              <p className="text-sm text-purple-700">
                Gestionează platforma
              </p>
            </div>
          </div>
          <Link href="/admin">
            <button className="w-full btn-primary bg-purple-600 hover:bg-purple-700">
              Accesează Admin Panel
            </button>
          </Link>
        </div>
      )}

      {/* Tips Card */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-500" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-gray-900">
            Sfaturi Utile
          </h3>
        </div>
        <div className="space-y-4">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {tip.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Stats Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rezumat Cont
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Membru din:</span>
            <span className="font-medium">
              {new Date().toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Profil completat:</span>
            <span className="font-medium text-green-600">
              {user.name ? '85%' : '60%'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rating:</span>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  aria-hidden="true"
                />
              ))}
              <span className="text-xs text-gray-600 ml-1">4.0</span>
            </div>
          </div>
        </div>
        
        {!user.name && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link href="/account/edit">
              <button className="w-full btn-secondary text-sm">
                Completează profilul
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
