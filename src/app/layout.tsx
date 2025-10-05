import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import AuthHeader from '@/components/AuthHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Home, Package, Plus, Search } from 'lucide-react'
import ServiceWorkerRegister from './_app-sw-register'
import InstallPrompt from '@/components/InstallPrompt'

export const metadata: Metadata = {
  title: 'Ai Nostri - Anunțuri pentru românii și moldovenii din Franța',
  description: 'Platforma de anunțuri dedicată comunității românești și moldovenești din Franța. Găsește și publică anunțuri în limba română.',
  keywords: 'anunturi, romani franta, moldoveni franta, clasificate, diaspora, comunitate',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  authors: [{ name: 'Ai Nostri' }],
  creator: 'Ai Nostri',
  publisher: 'Ai Nostri',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Ai Nostri - Comunitatea românească din Franța',
    description: 'Platforma de anunțuri pentru diaspora românească și moldovenească',
    type: 'website',
    locale: 'ro_RO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ai Nostri - Comunitatea românească din Franța',
    description: 'Platforma de anunțuri pentru diaspora românească și moldovenească',
  },
}

function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group focus-ring"
            aria-label="Ai Nostri - Pagina principală"
          >
            <div className="relative">
              <div className="bg-green-600 rounded-lg p-2 group-hover:bg-green-700 transition-colors">
                <Home className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">
                Ai Nostri
              </span>
              <span className="text-xs text-gray-600 -mt-1 hidden sm:block">
                🇷🇴 🇲🇩 Diaspora în Franța 🇫🇷
              </span>
            </div>
          </Link>
          
          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Navigare principală">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-all focus-ring"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              <span>Acasă</span>
            </Link>
            <Link 
              href="/?category=" 
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-all focus-ring"
            >
              <Package className="h-4 w-4" aria-hidden="true" />
              <span>Categorii</span>
            </Link>
            <Link 
              href="/?q=" 
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-all focus-ring"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Căutare</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <AuthHeader />
            
            <Link href="/new/wizard" className="focus-ring">
              <Button 
                className="btn-primary min-h-[44px] px-4 py-2"
                aria-label="Publică un anunț nou"
              >
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Publică Anunț</span>
                <span className="sm:hidden">Publică</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12" role="contentinfo">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-600 rounded-lg p-2">
                <Home className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold">Ai Nostri</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Platforma de anunțuri dedicată comunității românești și moldovenești din Franța. 
              Conectăm diaspora prin schimbul de bunuri și servicii.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>🇷🇴 🇲🇩 Comunitatea noastră în limba română 🇫🇷</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Linkuri Rapide</h3>
            <nav className="space-y-2">
              <Link href="/" className="block text-gray-300 hover:text-white transition-colors focus-ring">
                Acasă
              </Link>
              <Link href="/new" className="block text-gray-300 hover:text-white transition-colors focus-ring">
                Publică Anunț
              </Link>
              <Link href="/login" className="block text-gray-300 hover:text-white transition-colors focus-ring">
                Conectare
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <nav className="space-y-2">
              <Link href="/privacy" className="block text-gray-300 hover:text-white transition-colors focus-ring">
                Confidențialitate
              </Link>
              <Link href="/terms" className="block text-gray-300 hover:text-white transition-colors focus-ring">
                Termeni
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors focus-ring">
                Contact
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Ai Nostri. Toate drepturile rezervate.</p>
          <p className="text-sm mt-2">
            Făcut cu ❤️ pentru diaspora românească și moldovenească din Franța
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        {/* Preconnect pentru performanță */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#059669" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ai Nostri" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#059669" />
        <meta name="msapplication-TileImage" content="/icons/icon-192.png" />
        
        {/* Additional PWA Meta */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Ai Nostri" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {/* Skip to Content Link */}
        <a href="#main-content" className="skip-to-content">
          Sari la conținut
        </a>
        
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            
            <main id="main-content" className="flex-1 bg-gray-50" role="main">
              {children}
            </main>
            
            <Footer />
          </div>
          
          {/* PWA Components */}
          <ServiceWorkerRegister />
          <InstallPrompt />
        </AuthProvider>
      </body>
    </html>
  )
}
