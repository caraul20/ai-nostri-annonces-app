'use client';

import { useState } from 'react';
import { Upload, X, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

// Validare extensii imagini
const VALID_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_IMAGES = 8;

// Mock pentru validare dimensiune (simulată)
const validateImageUrl = (url: string): Promise<{ valid: boolean; error?: string; width?: number; height?: number }> => {
  return new Promise((resolve) => {
    // Simulăm o validare asincronă
    setTimeout(() => {
      const extension = url.split('.').pop()?.toLowerCase();
      
      if (!extension || !VALID_EXTENSIONS.includes(extension)) {
        resolve({ 
          valid: false, 
          error: `Extensie nevalidă. Folosește: ${VALID_EXTENSIONS.join(', ')}` 
        });
        return;
      }

      // Simulăm dimensiuni random pentru demo
      const mockWidth = Math.floor(Math.random() * 1000) + 400;
      const mockHeight = Math.floor(Math.random() * 800) + 300;
      
      if (mockWidth < 200 || mockHeight < 200) {
        resolve({ 
          valid: false, 
          error: 'Imaginea trebuie să aibă cel puțin 200x200 pixeli' 
        });
        return;
      }

      resolve({ 
        valid: true, 
        width: mockWidth, 
        height: mockHeight 
      });
    }, 500); // Simulăm delay de validare
  });
};

export default function ImageUploaderMock({ 
  images, 
  onImagesChange, 
  maxImages = MAX_IMAGES,
  disabled = false 
}: ImageUploaderProps) {
  const [urlInput, setUrlInput] = useState('');
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddUrl = async () => {
    if (!urlInput.trim()) {
      setError('Te rog să introduci un URL valid');
      return;
    }

    if (images.length >= maxImages) {
      setError(`Poți adăuga maximum ${maxImages} imagini`);
      return;
    }

    if (images.includes(urlInput.trim())) {
      setError('Această imagine a fost deja adăugată');
      return;
    }

    setValidating(true);
    setError(null);

    try {
      const validation = await validateImageUrl(urlInput.trim());
      
      if (!validation.valid) {
        setError(validation.error || 'URL invalid');
        return;
      }

      // Adaugă imaginea validată
      onImagesChange([...images, urlInput.trim()]);
      setUrlInput('');
      
    } catch (err) {
      setError('Eroare la validarea imaginii');
    } finally {
      setValidating(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUrl();
    }
  };

  return (
    <div className="space-y-4">
      {/* Input pentru URL */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Imagini ({images.length}/{maxImages})
        </label>
        
        <div className="flex space-x-2">
          <div className="flex-1">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://example.com/imagine.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={disabled || validating || images.length >= maxImages}
            />
          </div>
          
          <Button
            type="button"
            onClick={handleAddUrl}
            disabled={disabled || validating || images.length >= maxImages || !urlInput.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {validating ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Mesaj de ajutor */}
        <p className="text-xs text-gray-500">
          Extensii acceptate: {VALID_EXTENSIONS.join(', ')}. Dimensiune minimă: 200x200px
        </p>
      </div>

      {/* Erori */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview imagini */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={`Imagine ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                
                {/* Overlay cu buton de ștergere */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <Button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Indicator poziție */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Placeholder când nu sunt imagini */}
      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Adaugă imagini folosind URL-uri</p>
          <p className="text-sm text-gray-500">
            Perfect pentru imagini de pe Unsplash, Google Drive, sau alte servicii
          </p>
        </div>
      )}

      {/* TODO: Placeholder pentru Cloudflare Turnstile */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          🔒 TODO: Cloudflare Turnstile
        </h4>
        <p className="text-sm text-blue-700">
          Verificarea anti-spam va fi activată la migrarea către producție.
        </p>
      </div>
    </div>
  );
}
