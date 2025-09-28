import { Package, Search, AlertCircle, Plus, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  type?: 'no-results' | 'no-listings' | 'error' | 'not-found';
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  type = 'no-results',
  title,
  description,
  actionLabel,
  actionHref,
  onAction
}: EmptyStateProps) {
  const getConfig = () => {
    switch (type) {
      case 'no-results':
        return {
          icon: Search,
          title: title || 'Niciun rezultat găsit',
          description: description || 'Încearcă să modifici filtrele de căutare pentru a găsi ce cauți.',
          actionLabel: actionLabel || 'Resetează filtrele',
          actionHref: actionHref || '/',
        };
      case 'no-listings':
        return {
          icon: Package,
          title: title || 'Niciun anunț disponibil',
          description: description || 'Fii primul din comunitatea noastră care publică un anunț!',
          actionLabel: actionLabel || 'Publică primul anunț',
          actionHref: actionHref || '/new',
        };
      case 'error':
        return {
          icon: AlertCircle,
          title: title || 'A apărut o eroare',
          description: description || 'Ne pare rău, ceva nu a mers bine. Te rog să încerci din nou.',
          actionLabel: actionLabel || 'Încearcă din nou',
          actionHref: actionHref || '/',
        };
      case 'not-found':
        return {
          icon: Home,
          title: title || 'Pagina nu a fost găsită',
          description: description || 'Pagina pe care o cauți nu există sau a fost mutată.',
          actionLabel: actionLabel || 'Înapoi acasă',
          actionHref: actionHref || '/',
        };
      default:
        return {
          icon: Package,
          title: title || 'Nimic aici',
          description: description || 'Nu am găsit nimic de afișat.',
          actionLabel: actionLabel || 'Înapoi',
          actionHref: actionHref || '/',
        };
    }
  };

  const config = getConfig();
  const IconComponent = config.icon;

  return (
    <div 
      className="text-center py-16 px-4"
      role="status"
      aria-live="polite"
    >
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <IconComponent 
              className="h-8 w-8 text-gray-400" 
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {config.title}
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {config.description}
        </p>

        {/* Action */}
        {(config.actionHref || onAction) && (
          <div className="space-y-4">
            {config.actionHref ? (
              <Link href={config.actionHref} className="focus-ring">
                <Button className="btn-primary">
                  {type === 'no-listings' && (
                    <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  )}
                  {type === 'not-found' && (
                    <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                  )}
                  {config.actionLabel}
                </Button>
              </Link>
            ) : onAction ? (
              <Button 
                onClick={onAction}
                className="btn-primary"
              >
                {config.actionLabel}
              </Button>
            ) : null}

            {/* Secondary action for search results */}
            {type === 'no-results' && (
              <div className="mt-4">
                <Link href="/new" className="focus-ring">
                  <Button className="btn-secondary">
                    <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                    Publică un anunț
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Additional help for search */}
        {type === 'no-results' && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Sfaturi pentru căutare:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Verifică ortografia cuvintelor</li>
              <li>• Încearcă termeni mai generali</li>
              <li>• Folosește sinonime</li>
              <li>• Elimină unele filtre</li>
            </ul>
          </div>
        )}

        {/* Community message for diaspora */}
        {type === 'no-listings' && (
          <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <span className="font-medium">Ai Nostri</span> este platforma comunității românești și moldovenești din Franța. 
              Ajută-ne să creștem publicând primul anunț! 🇷🇴 🇲🇩 🇫🇷
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Specialized Empty States
export function NoSearchResults({ query }: { query?: string }) {
  return (
    <EmptyState
      type="no-results"
      title="Niciun rezultat pentru căutarea ta"
      description={
        query 
          ? `Nu am găsit anunțuri pentru "${query}". Încearcă să modifici termenul de căutare sau filtrele.`
          : 'Nu am găsit anunțuri care să corespundă criteriilor tale de căutare.'
      }
    />
  );
}

export function NoListingsInCategory({ categoryName }: { categoryName?: string }) {
  return (
    <EmptyState
      type="no-listings"
      title={`Niciun anunț în ${categoryName || 'această categorie'}`}
      description={`Fii primul care publică un anunț în categoria ${categoryName || 'aceasta'}!`}
    />
  );
}

export function NoListingsInLocation({ locationName }: { locationName?: string }) {
  return (
    <EmptyState
      type="no-listings"
      title={`Niciun anunț în ${locationName || 'această locație'}`}
      description={`Fii primul din ${locationName || 'această zonă'} care publică un anunț!`}
    />
  );
}

export function ErrorState({ 
  title = 'Ceva nu a mers bine',
  description = 'A apărut o eroare neașteptată. Te rog să încerci din nou.',
  onRetry
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      type="error"
      title={title}
      description={description}
      actionLabel="Încearcă din nou"
      onAction={onRetry}
    />
  );
}

export function NotFoundState() {
  return (
    <EmptyState
      type="not-found"
      title="Pagina nu a fost găsită"
      description="Pagina pe care o cauți nu există sau a fost mutată."
    />
  );
}
