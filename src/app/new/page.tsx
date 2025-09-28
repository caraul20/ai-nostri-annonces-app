'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/ImageUploader';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Camera, MapPin, Euro, FileText, Tag, AlertCircle } from 'lucide-react';
import { getCategories, getLocations, Category, Location } from '@/server/repo/repoMock';
import { createListing } from '@/app/actions/listings';
import { useAuth } from '@/contexts/AuthContext';

export default function NewAdPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, locationsData] = await Promise.all([
          getCategories(),
          getLocations()
        ]);
        setCategories(categoriesData);
        setLocations(locationsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (!user) {
      setErrors({ _form: ['Trebuie să fii autentificat pentru a publica un anunț.'] });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.append('images', JSON.stringify(images));
    formData.append('userId', user.uid);

    try {
      const result = await createListing({}, formData);
      
      if (result.errors) {
        setErrors(result.errors);
      }
      // Si pas d'erreurs, la redirection se fait automatiquement dans l'action
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setErrors({ _form: ['Une erreur inattendue est survenue.'] });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Publică un anunț nou
        </h1>

        {/* Afișare erori globale */}
        {errors._form && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                {errors._form.map((error: string, index: number) => (
                  <p key={index} className="text-red-700 text-sm">{error}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-2" />
                Titlul anunțului *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Ex: iPhone 14 Pro în stare excelentă"
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {errors.title && (
                <div className="mt-1">
                  {errors.title.map((error: string, index: number) => (
                    <p key={index} className="text-red-600 text-sm">{error}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Catégorie */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4 inline mr-2" />
                Catégorie *
              </label>
              <select
                id="category"
                name="categoryId"
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.categoryId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
                disabled={isLoading}
              >
                <option value="">
                  {isLoading ? 'Se încarcă...' : 'Selectează o categorie'}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <div className="mt-1">
                  {errors.categoryId.map((error: string, index: number) => (
                    <p key={index} className="text-red-600 text-sm">{error}</p>
                  ))}
                </div>
              )}
              {categories.length === 0 && !isLoading && (
                <p className="text-sm text-yellow-600 mt-1">
                  Nicio categorie disponibilă. <a href="/seed" className="underline">Inițializează baza de date</a>
                </p>
              )}
            </div>

            {/* Prix */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                <Euro className="h-4 w-4 inline mr-2" />
                Preț *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
                <span className="absolute right-4 top-3 text-gray-500">€</span>
              </div>
              {errors.price && (
                <div className="mt-1">
                  {errors.price.map((error: string, index: number) => (
                    <p key={index} className="text-red-600 text-sm">{error}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                placeholder="Descrie articolul tău în detaliu..."
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-vertical ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              ></textarea>
              {errors.description && (
                <div className="mt-1">
                  {errors.description.map((error: string, index: number) => (
                    <p key={index} className="text-red-600 text-sm">{error}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Localisation */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Localisation *
              </label>
              <select
                id="location"
                name="locationId"
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.locationId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
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
                  {errors.locationId.map((error: string, index: number) => (
                    <p key={index} className="text-red-600 text-sm">{error}</p>
                  ))}
                </div>
              )}
              {locations.length === 0 && !isLoading && (
                <p className="text-sm text-yellow-600 mt-1">
                  Nicio locație disponibilă. <a href="/seed" className="underline">Inițializează baza de date</a>
                </p>
              )}
            </div>

            {/* Photos */}
            <div>
              <ImageUploader
                images={images}
                onImagesChange={setImages}
                maxImages={5}
                disabled={isSubmitting}
              />
              {errors.images && (
                <div className="mt-1">
                  {errors.images.map((error: string, index: number) => (
                    <p key={index} className="text-red-600 text-sm">{error}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Anulează
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Se publică...' : 'Publică anunțul'}
              </Button>
            </div>
          </form>
        </div>

        {/* Sfaturi */}
        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-3">Sfaturi pentru un anunț de succes</h3>
          <ul className="text-sm text-green-800 space-y-2">
            <li>• Folosește un titlu clar și descriptiv</li>
            <li>• Adaugă mai multe fotografii de calitate</li>
            <li>• Descrie starea obiectului în mod onest</li>
            <li>• Indică un preț corect și realist</li>
            <li>• Răspunde rapid la mesaje</li>
          </ul>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
