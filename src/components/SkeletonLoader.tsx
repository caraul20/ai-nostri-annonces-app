// Skeleton Loading Components pentru UX îmbunătățit

interface SkeletonProps {
  className?: string;
  'aria-label'?: string;
}

export function Skeleton({ className = '', 'aria-label': ariaLabel }: SkeletonProps) {
  return (
    <div 
      className={`skeleton ${className}`}
      aria-label={ariaLabel || 'Se încarcă...'}
      role="status"
      aria-live="polite"
    />
  );
}

// Skeleton pentru Card Anunț
export function AdCardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden" role="status" aria-label="Se încarcă anunțul...">
      {/* Image Skeleton */}
      <Skeleton className="h-48 w-full" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        
        {/* Price */}
        <Skeleton className="h-6 w-1/3" />
        
        {/* Meta info */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        
        {/* Date */}
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

// Skeleton pentru Grid de Anunțuri
export function AdGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid-responsive" role="status" aria-label="Se încarcă anunțurile...">
      {Array.from({ length: count }, (_, i) => (
        <AdCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton pentru Pagina de Detaliu
export function ListingDetailSkeleton() {
  return (
    <div className="container-custom py-8" role="status" aria-label="Se încarcă detaliile anunțului...">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-2/3 mb-4" />
            <Skeleton className="h-10 w-1/3 mb-4" />
            
            {/* Meta info */}
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>

          {/* Description */}
          <div>
            <Skeleton className="h-6 w-1/3 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Contact Card */}
          <div className="card p-6">
            <Skeleton className="h-5 w-1/2 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="mt-6 space-y-3">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton pentru Filtre
export function FiltersSkeleton() {
  return (
    <div className="w-full" role="status" aria-label="Se încarcă filtrele...">
      <div className="text-center mb-6">
        <Skeleton className="h-6 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Search */}
        <div className="lg:col-span-2">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Category */}
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Location */}
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>

      {/* Price Range */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Skeleton className="h-4 w-32 mb-2" />
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

// Skeleton pentru Header
export function HeaderSkeleton() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Skeleton className="h-8 w-32" />
          <div className="hidden md:flex items-center space-x-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-18" />
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>
    </header>
  );
}

// Skeleton pentru Empty State
export function EmptyStateSkeleton() {
  return (
    <div className="text-center py-16" role="status" aria-label="Se încarcă...">
      <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
      <Skeleton className="h-6 w-48 mx-auto mb-2" />
      <Skeleton className="h-4 w-64 mx-auto mb-6" />
      <Skeleton className="h-10 w-32 mx-auto" />
    </div>
  );
}

// Skeleton pentru Form
export function FormSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Se încarcă formularul...">
      {/* Title */}
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Description */}
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-32 w-full" />
      </div>

      {/* Price */}
      <div>
        <Skeleton className="h-4 w-12 mb-2" />
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Selects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>

      {/* Images */}
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-48 w-full" />
      </div>

      {/* Submit */}
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
