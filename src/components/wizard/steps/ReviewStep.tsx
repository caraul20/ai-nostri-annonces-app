'use client';

import { WizardFormData, CATEGORY_CONFIG } from '@/types/listing-wizard';
import { useState, useEffect } from 'react';
import { getLocationById, Location } from '@/server/repo/repoFirebase';
import { Check, Edit, MapPin, Euro, Tag, FileText, Camera, Phone, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface ReviewStepProps {
  formData: WizardFormData;
  onEdit: (stepIndex: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errors: { [key: string]: string[] };
}

export default function ReviewStep({ formData, onEdit, onSubmit, isSubmitting, errors }: ReviewStepProps) {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    const loadLocation = async () => {
      if (formData.locationId) {
        try {
          const locationData = await getLocationById(formData.locationId);
          setLocation(locationData);
        } catch (error) {
          console.error('Error loading location:', error);
        }
      }
      setIsLoadingLocation(false);
    };

    loadLocation();
  }, [formData.locationId]);

  const category = CATEGORY_CONFIG.find(c => c.id === formData.categoryId);
  const subcategory = category?.subcategories.find(s => s.id === formData.subcategoryId);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCustomFieldLabel = (fieldId: string) => {
    const field = subcategory?.customFields.find(f => f.id === fieldId);
    return field?.label || fieldId;
  };

  const getCustomFieldDisplayValue = (fieldId: string, value: any) => {
    const field = subcategory?.customFields.find(f => f.id === fieldId);
    
    if (!field) return value;

    switch (field.type) {
      case 'select':
        const option = field.options?.find(opt => opt.value === value);
        return option?.label || value;
      
      case 'multiselect':
        if (Array.isArray(value)) {
          return value.map(v => {
            const option = field.options?.find(opt => opt.value === v);
            return option?.label || v;
          }).join(', ');
        }
        return value;
      
      case 'checkbox':
        return value ? 'Da' : 'Nu';
      
      default:
        return value;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Verifică și publică anunțul
        </h2>
        <p className="text-gray-600 text-lg">
          Verifică toate informațiile înainte de a publica anunțul
        </p>
      </div>

      {/* Global Errors */}
      {errors._form && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Eroare la publicarea anunțului
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {errors._form.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Informații de bază
              </h3>
              <button
                onClick={() => onEdit(2)}
                className="text-green-600 hover:text-green-700 flex items-center text-sm"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editează
              </button>
            </div>

            {/* Phone Number Alert */}
            {!formData.phone && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center text-red-700">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Numărul de telefon lipsește!</span>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  Anunțul nu poate fi publicat fără numărul de telefon.
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {formData.title}
                </h4>
                <p className="text-gray-600">
                  {formData.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  {category?.name} → {subcategory?.name}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {isLoadingLocation ? 'Se încarcă...' : location?.name}
                </div>
                <div className={`flex items-center ${formData.phone ? 'text-green-600' : 'text-red-600'}`}>
                  <Phone className="h-4 w-4 mr-1" />
                  {formData.phone ? (
                    <span className="font-medium">{formData.phone}</span>
                  ) : (
                    <span className="font-medium">Număr de telefon lipsește</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Euro className="h-4 w-4 mr-1" />
                  {formatPrice(formData.price || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Custom Fields */}
          {subcategory && subcategory.customFields.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Detalii specifice
                </h3>
                <button
                  onClick={() => onEdit(3)}
                  className="text-green-600 hover:text-green-700 flex items-center text-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editează
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.customFields || {}).map(([fieldId, value]) => {
                  if (!value || (Array.isArray(value) && value.length === 0)) return null;
                  
                  return (
                    <div key={fieldId} className="border-l-4 border-green-500 pl-4">
                      <dt className="text-sm font-medium text-gray-600">
                        {getCustomFieldLabel(fieldId)}
                      </dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        {getCustomFieldDisplayValue(fieldId, value)}
                      </dd>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Images */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Fotografii ({formData.images?.length || 0})
              </h3>
              <button
                onClick={() => onEdit(4)}
                className="text-green-600 hover:text-green-700 flex items-center text-sm"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editează
              </button>
            </div>
            
            {formData.images && formData.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image}
                      alt={`Fotografia ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nicio fotografie adăugată</p>
                <p className="text-sm mt-1">Anunțurile cu fotografii au mai mult succes</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatPrice(formData.price || 0)}
              </div>
              <p className="text-sm text-gray-600">Preț de vânzare</p>
            </div>
          </div>

          {/* Publication Summary */}
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="font-semibold text-green-900 mb-4">
              Ce se întâmplă după publicare?
            </h3>
            <div className="space-y-3 text-sm text-green-800">
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                <span>Anunțul va fi vizibil imediat pe platformă</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                <span>Vei primi notificări pentru mesajele primite</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                <span>Poți edita anunțul oricând din contul tău</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                <span>Anunțul expiră automat după 90 de zile</span>
              </div>
            </div>
          </div>

          {/* Publish Button */}
          <button
            onClick={onSubmit}
            disabled={isSubmitting || !formData.phone}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                Se publică...
              </div>
            ) : !formData.phone ? (
              'Adaugă numărul de telefon pentru a publica'
            ) : (
              'Publică anunțul'
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Prin publicarea anunțului, accepți{' '}
            <a href="/terms" className="text-green-600 hover:underline">
              termenii și condițiile
            </a>{' '}
            platformei.
          </p>
        </div>
      </div>
    </div>
  );
}
