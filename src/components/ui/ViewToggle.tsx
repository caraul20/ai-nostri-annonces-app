'use client';

import { Grid3X3, List } from 'lucide-react';

export type ViewType = 'grid' | 'list';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  className?: string;
}

export default function ViewToggle({ currentView, onViewChange, className = '' }: ViewToggleProps) {
  return (
    <div className={`flex items-center bg-gray-100 rounded-lg p-1 ${className}`}>
      <button
        onClick={() => onViewChange('grid')}
        className={`flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200 ${
          currentView === 'grid'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Afișare în grilă"
        title="Afișare în grilă"
      >
        <Grid3X3 className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200 ${
          currentView === 'list'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Afișare în listă"
        title="Afișare în listă"
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
}
