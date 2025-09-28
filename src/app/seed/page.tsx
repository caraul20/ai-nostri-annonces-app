'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createCategory, createLocation, getCategories, getLocations } from '@/server/repo/repoFirebase';
import { Loader2, CheckCircle, AlertCircle, Database } from 'lucide-react';

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [seedResults, setSeedResults] = useState<{
    categories: string[];
    locations: string[];
    errors: string[];
  }>({
    categories: [],
    locations: [],
    errors: []
  });

  // Données prédéfinies pour la communauté românească și moldovenească
  const predefinedCategories = [
    { name: 'Electronice & IT', slug: 'electronice-it' },
    { name: 'Auto & Moto', slug: 'auto-moto' },
    { name: 'Imobiliare', slug: 'imobiliare' },
    { name: 'Casă & Grădină', slug: 'casa-gradina' },
    { name: 'Modă & Frumusețe', slug: 'moda-frumusete' },
    { name: 'Sport & Hobby', slug: 'sport-hobby' },
    { name: 'Servicii', slug: 'servicii' },
    { name: 'Locuri de Muncă', slug: 'locuri-munca' }
  ];

  const predefinedLocations = [
    { name: 'Paris', slug: 'paris' },
    { name: 'Lyon', slug: 'lyon' },
    { name: 'Marseille', slug: 'marseille' },
    { name: 'Toulouse', slug: 'toulouse' },
    { name: 'Nice', slug: 'nice' },
    { name: 'Nantes', slug: 'nantes' },
    { name: 'Strasbourg', slug: 'strasbourg' },
    { name: 'Montpellier', slug: 'montpellier' },
    { name: 'Bordeaux', slug: 'bordeaux' },
    { name: 'Lille', slug: 'lille' }
  ];

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedStatus('idle');
    setSeedResults({ categories: [], locations: [], errors: [] });

    try {
      const results = {
        categories: [] as string[],
        locations: [] as string[],
        errors: [] as string[]
      };

      // Vérifier les catégories existantes
      const existingCategories = await getCategories();
      const existingCategoryNames = existingCategories.map(cat => cat.name.toLowerCase());

      // Ajouter les catégories
      console.log('🏷️ Ajout des catégories...');
      for (const category of predefinedCategories) {
        try {
          if (!existingCategoryNames.includes(category.name.toLowerCase())) {
            const categoryId = await createCategory({
              name: category.name,
              slug: category.slug,
              isActive: true,
              order: predefinedCategories.indexOf(category)
            });
            results.categories.push(`✅ ${category.name} (ID: ${categoryId})`);
            console.log(`✅ Catégorie ajoutée: ${category.name}`);
          } else {
            results.categories.push(`⚠️ ${category.name} (déjà existante)`);
            console.log(`⚠️ Catégorie déjà existante: ${category.name}`);
          }
        } catch (error) {
          const errorMsg = `❌ Erreur pour ${category.name}: ${error}`;
          results.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      // Vérifier les localisations existantes
      const existingLocations = await getLocations();
      const existingLocationNames = existingLocations.map(loc => loc.name.toLowerCase());

      // Ajouter les localisations
      console.log('📍 Ajout des localisations...');
      for (const location of predefinedLocations) {
        try {
          if (!existingLocationNames.includes(location.name.toLowerCase())) {
            const locationId = await createLocation({
              name: location.name,
              slug: location.slug,
              isActive: true,
              order: predefinedLocations.indexOf(location)
            });
            results.locations.push(`✅ ${location.name} (ID: ${locationId})`);
            console.log(`✅ Localisation ajoutée: ${location.name}`);
          } else {
            results.locations.push(`⚠️ ${location.name} (déjà existante)`);
            console.log(`⚠️ Localisation déjà existante: ${location.name}`);
          }
        } catch (error) {
          const errorMsg = `❌ Erreur pour ${location.name}: ${error}`;
          results.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      setSeedResults(results);
      setSeedStatus(results.errors.length > 0 ? 'error' : 'success');
      
    } catch (error) {
      console.error('Erreur générale lors du seed:', error);
      setSeedResults(prev => ({
        ...prev,
        errors: [...prev.errors, `Erreur générale: ${error}`]
      }));
      setSeedStatus('error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Database className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Seed Database
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Initialiser la base de données avec des catégories et localisations prédéfinies
          </p>
        </div>

        {/* Données à ajouter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Données à ajouter:</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">🏷️ Catégories:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {predefinedCategories.map((category, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">📍 Localisations:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {predefinedLocations.map((location, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {location.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bouton de seed */}
        <div className="text-center mb-6">
          <Button 
            onClick={handleSeed} 
            disabled={isSeeding}
            size="lg"
            className="min-w-48"
          >
            {isSeeding ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Initialisation en cours...
              </>
            ) : (
              <>
                <Database className="h-5 w-5 mr-2" />
                Initialiser la base de données
              </>
            )}
          </Button>
        </div>

        {/* Résultats */}
        {seedStatus !== 'idle' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              {seedStatus === 'success' ? (
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              )}
              <h2 className="text-xl font-semibold">
                {seedStatus === 'success' ? 'Seed completat ✅' : 'Seed terminé avec erreurs ⚠️'}
              </h2>
            </div>

            {/* Catégories */}
            {seedResults.categories.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">🏷️ Catégories:</h3>
                <ul className="text-sm space-y-1">
                  {seedResults.categories.map((result, index) => (
                    <li key={index} className="text-gray-600 font-mono">
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Localisations */}
            {seedResults.locations.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">📍 Localisations:</h3>
                <ul className="text-sm space-y-1">
                  {seedResults.locations.map((result, index) => (
                    <li key={index} className="text-gray-600 font-mono">
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Erreurs */}
            {seedResults.errors.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-red-900 mb-2">❌ Erreurs:</h3>
                <ul className="text-sm space-y-1">
                  {seedResults.errors.map((error, index) => (
                    <li key={index} className="text-red-600 font-mono">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Message de succès */}
            {seedStatus === 'success' && seedResults.errors.length === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-green-800 font-medium text-center">
                  🎉 Base de données initialisée avec succès!
                </p>
                <p className="text-green-600 text-sm text-center mt-1">
                  Vous pouvez maintenant utiliser les catégories et localisations dans l'application.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-medium text-blue-900 mb-2">📋 Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Cette page initialise la base de données Firestore</li>
            <li>• Les slugs sont générés automatiquement (ex: "Immobilier" → "immobilier")</li>
            <li>• Les doublons sont détectés et ignorés</li>
            <li>• Vérifiez la console pour plus de détails</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
