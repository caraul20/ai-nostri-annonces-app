'use client';

import { CATEGORY_CONFIG, CategoryWithSubcategories } from '@/types/listing-wizard';
import { ArrowRight, Check, ArrowLeft } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';

interface SubcategoryStepProps {
  category: CategoryWithSubcategories;
  selectedSubcategoryId?: string;
  onSubcategorySelect: (subcategoryId: string, subcategoryName: string) => void;
  onBackToCategory: () => void;
  errors?: string[];
}

export default function SubcategoryStep({ 
  category, 
  selectedSubcategoryId, 
  onSubcategorySelect, 
  onBackToCategory,
  errors 
}: SubcategoryStepProps) {
  return (
    <div className="max-w-4xl mx-auto">

      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={onBackToCategory}
            className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Înapoi la categorii"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="mr-3">
            <CategoryIcon iconKey={category.id} size={36} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {category.name}
          </h2>
        </div>
        <p className="text-gray-600 text-lg">
          Alege subcategoria care descrie cel mai bine produsul tău
        </p>
      </div>

      {/* Error Message */}
      {errors && errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Te rog să selectezi o subcategorie
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

      {/* Subcategories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {category.subcategories.map((subcategory) => (
          <button
            key={subcategory.id}
            onClick={() => onSubcategorySelect(subcategory.id, subcategory.name)}
            className={`
              relative p-5 rounded-lg border transition-all duration-200 text-left group
              hover:shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400
              ${selectedSubcategoryId === subcategory.id
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            {/* Selected Indicator */}
            {selectedSubcategoryId === subcategory.id && (
              <div className="absolute top-3 right-3">
                <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              </div>
            )}

            {/* Subcategory Icon */}
            <div className="mb-3 opacity-60" role="img" aria-label={subcategory.name}>
              <CategoryIcon iconKey={subcategory.id} size={28} />
            </div>

            {/* Subcategory Info */}
            <div className="mb-3">
              <h3 className={`text-lg font-medium mb-1 ${
                selectedSubcategoryId === subcategory.id ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {subcategory.name}
              </h3>
              {subcategory.description && (
                <p className="text-sm text-gray-500">
                  {subcategory.description}
                </p>
              )}
            </div>

            {/* Custom Fields Count */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {subcategory.customFields.length} câmpuri specifice
              </span>
              <ArrowRight className="h-3 w-3 text-gray-300 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>
        ))}
      </div>

      {/* Help Text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Subcategoria te va ajuta să completezi informații specifice despre produsul tău
        </p>
      </div>
    </div>
  );
}
