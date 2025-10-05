'use client';

import { WizardFormData } from '@/types/listing-wizard';
import ImageUploader from '@/components/ImageUploader';
import { Camera, Info } from 'lucide-react';

interface ImagesStepProps {
  formData: WizardFormData;
  onFormDataChange: (updates: Partial<WizardFormData>) => void;
  errors: { [key: string]: string[] };
}

export default function ImagesStep({ formData, onFormDataChange, errors }: ImagesStepProps) {
  const handleImagesChange = (images: string[]) => {
    onFormDataChange({ images });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Camera className="h-8 w-8 text-green-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-900">
            Adaugă fotografii
          </h2>
        </div>
        <p className="text-gray-600 text-lg">
          Fotografiile de calitate îți vor ajuta să vinzi mai repede produsul
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <ImageUploader
          images={formData.images || []}
          onImagesChange={handleImagesChange}
          maxImages={5}
          folder="listings"
        />
        
        {errors.images && (
          <div className="mt-4">
            {errors.images.map((error, index) => (
              <p key={index} className="text-red-600 text-sm">{error}</p>
            ))}
          </div>
        )}
      </div>

      {/* Photography Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          Sfaturi pentru fotografii de calitate
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">📸 Tehnici de fotografiere:</h4>
            <ul className="space-y-1">
              <li>• Folosește lumina naturală</li>
              <li>• Fotografiază din mai multe unghiuri</li>
              <li>• Asigură-te că produsul este curat</li>
              <li>• Evită umbrele și reflexiile</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">✨ Ce să incluzi:</h4>
            <ul className="space-y-1">
              <li>• Fotografie generală a produsului</li>
              <li>• Detalii importante (etichete, defecte)</li>
              <li>• Accesorii incluse</li>
              <li>• Ambalajul original (dacă există)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Optional Note */}
      <div className="mt-6 bg-green-50 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900">Fotografiile sunt opționale</h4>
            <p className="text-sm text-green-700 mt-1">
              Poți publica anunțul și fără fotografii, dar anunțurile cu imagini au cu 70% mai multe vizualizări.
              Poți adăuga fotografii și mai târziu, editând anunțul.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
