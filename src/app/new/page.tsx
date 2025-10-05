'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAdPage() {
  const router = useRouter();

  // Redirect to wizard by default
  useEffect(() => {
    router.push('/new/wizard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-green-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Se redirecționează către wizard...</p>
      </div>
    </div>
  );
}
