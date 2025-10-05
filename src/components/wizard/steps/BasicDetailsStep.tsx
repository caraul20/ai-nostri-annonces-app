'use client';

import { useState, useEffect } from 'react';
import { getLocations, Location } from '@/server/repo/repoFirebase';
import { WizardFormData } from '@/types/listing-wizard';
import { FileText, Euro, MapPin, Phone, AlertCircle } from 'lucide-react';

interface BasicDetailsStepProps {
  formData: WizardFormData;
  onFormDataChange: (updates: Partial<WizardFormData>) => void;
  errors: { [key: string]: string[] };
}

export default function BasicDetailsStep({ formData, onFormDataChange, errors }: BasicDetailsStepProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locationsData = await getLocations();
        setLocations(locationsData);
      } catch (error) {
        console.error('Error loading locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, []);

  const handleInputChange = (field: keyof WizardFormData, value: any) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Detaliile de bază ale anunțului
        </h2>
        <p className="text-gray-600 text-lg">
          Completează informațiile principale despre produsul tău
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
              Titlul anunțului *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: iPhone 14 Pro în stare excelentă"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <div className="mt-1">
                {errors.title.map((error, index) => (
                  <p key={index} className="text-red-600 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            )}
            <p className="mt-1 text-xs text-gray-400">
              Folosește un titlu clar și descriptiv (minim 5 caractere)
            </p>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              <Euro className="h-4 w-4 inline mr-2" />
              Prețul *
            </label>
            <div className="relative">
              <input
                type="number"
                id="price"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0"
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              <span className="absolute right-4 top-3 text-gray-500 font-medium">€</span>
            </div>
            {errors.price && (
              <div className="mt-1">
                {errors.price.map((error, index) => (
                  <p key={index} className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {error}
                  </p>
                ))}
              </div>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Prețul în euro (EUR)
            </p>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-2" />
              Locația *
            </label>
            <select
              id="location"
              value={formData.locationId || ''}
              onChange={(e) => handleInputChange('locationId', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.locationId ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              <option value="">
                {isLoading ? 'Se încarcă...' : 'Selectează o locație'}
              </option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {errors.locationId && (
              <div className="mt-1">
                {errors.locationId.map((error, index) => (
                  <p key={index} className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {error}
                  </p>
                ))}
              </div>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Orașul din Franța unde se află produsul
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-2" />
              Numărul de telefon *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+33 6 12 34 56 78"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <div className="mt-1">
                {errors.phone.map((error, index) => (
                  <p key={index} className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {error}
                  </p>
                ))}
              </div>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Numărul tău de telefon pentru ca cumpărătorii să te contacteze
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrierea *
            </label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              placeholder="Descrie produsul tău în detaliu... Menționează starea, caracteristicile importante, motivul vânzării, etc."
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-vertical transition-colors ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <div className="mt-1">
                {errors.description.map((error, index) => (
                  <p key={index} className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {error}
                  </p>
                ))}
              </div>
            )}
            <div className="mt-1 flex justify-between">
              <p className="text-sm text-gray-500">
                Descriere detaliată (minim 20 de caractere)
              </p>
              <span className={`text-sm ${
                (formData.description?.length || 0) >= 20 ? 'text-green-600' : 'text-gray-400'
              }`}>
                {formData.description?.length || 0}/2000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Help Tips */}
      <div className="mt-8 bg-green-50 rounded-lg p-6">
        <h3 className="font-semibold text-green-900 mb-3">💡 Sfaturi pentru un anunț de succes</h3>
        <ul className="text-sm text-green-800 space-y-2">
          <li>• <strong>Titlu clar:</strong> Menționează marca, modelul și starea produsului</li>
          <li>• <strong>Preț realist:</strong> Verifică prețurile similare pe platformă</li>
          <li>• <strong>Telefon valid:</strong> Numărul tău real pentru contactare rapidă</li>
          <li>• <strong>Descriere completă:</strong> Cu cât mai multe detalii, cu atât mai multă încredere</li>
          <li>• <strong>Locație precisă:</strong> Ajută cumpărătorii să te găsească mai ușor</li>
        </ul>
      </div>
    </div>
  );
}
