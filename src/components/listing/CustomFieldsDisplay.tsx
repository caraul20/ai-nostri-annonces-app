'use client';

import { CATEGORY_CONFIG } from '@/types/listing-wizard';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { 
  Tag, 
  Smartphone, 
  Calendar, 
  Route, 
  Fuel, 
  Square, 
  Home, 
  Building, 
  Sparkles, 
  HardDrive, 
  Star, 
  Shield, 
  FileText, 
  Hammer, 
  Ruler, 
  Trophy, 
  Shirt,
  Car,
  Bed,
  Bath,
  ChefHat
} from 'lucide-react';

interface CustomFieldsDisplayProps {
  customFields?: { [key: string]: any };
  categoryId: string;
  subcategoryId?: string;
}

export default function CustomFieldsDisplay({ 
  customFields, 
  categoryId, 
  subcategoryId 
}: CustomFieldsDisplayProps) {
  if (!customFields || Object.keys(customFields).length === 0) {
    return null;
  }

  // Find category and subcategory configuration
  const category = CATEGORY_CONFIG.find(c => c.id === categoryId);
  const subcategory = category?.subcategories.find(s => 
    // Try to match by subcategoryId if provided, otherwise try to infer from customFields
    subcategoryId ? s.id === subcategoryId : 
    s.customFields.some(field => customFields.hasOwnProperty(field.id))
  );

  if (!subcategory) {
    return null;
  }

  const formatFieldValue = (field: any, value: any) => {
    if (!value) return '-';

    switch (field.type) {
      case 'select':
        // Find the label for the value
        const option = field.options?.find((opt: any) => 
          typeof opt === 'string' ? opt === value : opt.value === value
        );
        return option ? (typeof option === 'string' ? option : option.label) : value;
      
      case 'multiselect':
        if (Array.isArray(value)) {
          return value.map(v => {
            const option = field.options?.find((opt: any) => 
              typeof opt === 'string' ? opt === v : opt.value === v
            );
            return option ? (typeof option === 'string' ? option : option.label) : v;
          }).join(', ');
        }
        return value;
      
      case 'number':
        return typeof value === 'number' ? value.toLocaleString('ro-RO') : value;
      
      case 'checkbox':
        return value ? 'Da' : 'Nu';
      
      case 'date':
        if (value instanceof Date) {
          return value.toLocaleDateString('ro-RO');
        }
        if (typeof value === 'string') {
          try {
            return new Date(value).toLocaleDateString('ro-RO');
          } catch {
            return value;
          }
        }
        return value;
      
      default:
        return value;
    }
  };

  const getFieldIcon = (fieldId: string) => {
    const iconMap: { [key: string]: any } = {
      'marca': Tag,
      'model': Smartphone,
      'an_fabricatie': Calendar,
      'kilometraj': Route,
      'combustibil': Fuel,
      'suprafata': Square,
      'suprafata_utila': Square,
      'suprafata_teren': Square,
      'camere': Home,
      'etaj': Building,
      'dotari': Sparkles,
      'capacitate': HardDrive,
      'stare': Star,
      'garantie': Shield,
      'tip': FileText,
      'tip_haina': Shirt,
      'tip_echipament': Trophy,
      'material': Hammer,
      'marime': Ruler,
      'sport': Trophy,
      'echipa': Shirt,
      'cilindree': Car,
      'an_constructie': Calendar,
      'procesor': HardDrive
    };
    return iconMap[fieldId] || FileText;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CategoryIcon iconKey={subcategory.id} size={20} />
        <h3 className="text-lg font-semibold text-gray-900">
          Detalii specifice - {subcategory.name}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subcategory.customFields.map(field => {
          const value = customFields[field.id];
          if (!value && value !== 0 && value !== false) return null;

          const IconComponent = getFieldIcon(field.id);

          return (
            <div key={field.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                <IconComponent className="w-5 h-5 text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-sm font-medium text-gray-600 mb-1">
                  {field.label}
                </dt>
                <dd className="text-sm text-gray-900 font-medium">
                  {formatFieldValue(field, value)}
                </dd>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
