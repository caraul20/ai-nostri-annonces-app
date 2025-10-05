'use client';

import { CATEGORY_CONFIG } from '@/types/listing-wizard';
import { ArrowRight, Check } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';

interface CategoryStepProps {
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string, categoryName: string) => void;
  errors?: string[];
}

export default function CategoryStep({ selectedCategoryId, onCategorySelect, errors }: CategoryStepProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Alege categoria anunțului tău
        </h2>
        <p className="text-gray-600 text-lg">
          Selectează categoria care descrie cel mai bine produsul sau serviciul pe care vrei să îl vinzi
        </p>
      </div>

      {/* Error Message */}
      {errors && errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Te rog să selectezi o categorie
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {errors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORY_CONFIG.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id, category.name)}
            className={`
              relative p-5 rounded-lg border transition-all duration-200 text-left group
              hover:shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400
              ${selectedCategoryId === category.id
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            {/* Selected Indicator */}
            {selectedCategoryId === category.id && (
              <div className="absolute top-3 right-3">
                <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              </div>
            )}

            {/* Category Icon */}
            <div className="mb-3 opacity-60" role="img" aria-label={category.name}>
              <CategoryIcon iconKey={category.id} size={32} />
            </div>

            {/* Category Info */}
            <div className="mb-3">
              <h3 className={`text-lg font-medium mb-1 ${
                selectedCategoryId === category.id ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">
                {category.description}
              </p>
            </div>

            {/* Subcategories Count */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {category.subcategories.length} subcategorii
              </span>
              <ArrowRight className="h-3 w-3 text-gray-300 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>
        ))}
      </div>

      {/* Help Text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Alege categoria care descrie cel mai bine produsul tău
        </p>
      </div>
    </div>
  );
}
