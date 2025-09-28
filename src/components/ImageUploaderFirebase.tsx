import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface ImageUploaderProps {
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
  folder?: string;
}

export default function ImageUploaderFirebase({ 
  onImagesChange, 
  maxImages = 5, 
  disabled = false,
  folder = 'listings'
}: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const validateFile = (file: File): string | null => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Doar fișierele JPEG, PNG și WebP sunt acceptate.';
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'Fișierul este prea mare. Dimensiunea maximă este 5MB.';
    }

    return null;
  };

  const uploadToFirebase = async (file: File): Promise<string> => {
    if (!user) {
      throw new Error('Trebuie să fii autentificat pentru a încărca imagini.');
    }

    // Create unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;
    
    // Create storage reference
    const storageRef = ref(storage, `images/${folder}/${user.id}/${fileName}`);
    
    try {
      // Upload file
      const uploadResult = await uploadBytes(storageRef, file);
      console.log('Firebase: Image uploaded successfully:', fileName);
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log('Firebase: Download URL obtained:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Firebase: Error uploading image:', error);
      throw error;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    files.forEach((file, index) => {
      const error = validateFile(file);
      if (error) {
        validationErrors.push(`Fișierul ${index + 1}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (validationErrors.length > 0) {
      alert('Erori de validare:\n' + validationErrors.join('\n'));
    }

    if (validFiles.length === 0) return;

    if (images.length + validFiles.length > maxImages) {
      alert(`Poți încărca maximum ${maxImages} imagini.`);
      return;
    }

    if (!user) {
      alert('Trebuie să fii autentificat pentru a încărca imagini.');
      return;
    }

    setUploading(true);
    const newImageUrls: string[] = [];
    const errors: string[] = [];

    try {
      // Upload files one by one
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const fileKey = `${file.name}_${i}`;
        
        try {
          setUploadProgress(prev => ({ ...prev, [fileKey]: 0 }));
          
          // Simulate progress (Firebase doesn't provide real-time progress for uploadBytes)
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => ({
              ...prev,
              [fileKey]: Math.min((prev[fileKey] || 0) + 10, 90)
            }));
          }, 100);
          
          const downloadURL = await uploadToFirebase(file);
          
          clearInterval(progressInterval);
          setUploadProgress(prev => ({ ...prev, [fileKey]: 100 }));
          
          newImageUrls.push(downloadURL);
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          errors.push(`Eroare la încărcarea ${file.name}`);
        }
      }

      if (newImageUrls.length > 0) {
        const updatedImages = [...images, ...newImageUrls];
        setImages(updatedImages);
        onImagesChange(updatedImages);
      }

      if (errors.length > 0) {
        alert('Unele imagini nu au putut fi încărcate:\n' + errors.join('\n'));
      }
    } catch (error) {
      console.error('General upload error:', error);
      alert('Eroare generală la încărcarea imaginilor. Încearcă din nou.');
    } finally {
      setUploading(false);
      setUploadProgress({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    
    try {
      // Try to delete from Firebase Storage
      if (imageUrl.includes('firebase')) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
        console.log('Firebase: Image deleted from storage');
      }
    } catch (error) {
      console.error('Error deleting image from storage:', error);
      // Continue with removal from state even if storage deletion fails
    }
    
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const triggerFileInput = () => {
    if (!user) {
      alert('Trebuie să fii autentificat pentru a încărca imagini.');
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Imagini ({images.length}/{maxImages})
        </label>
        
        {/* Upload Button */}
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            disabled={disabled || uploading || images.length >= maxImages}
            className="flex items-center space-x-2"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>
              {uploading ? 'Se încarcă...' : 'Încarcă Imagini'}
            </span>
          </Button>
          
          <span className="text-sm text-gray-500">
            JPEG, PNG, WebP (max 5MB fiecare)
          </span>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Progres încărcare:</h4>
          {Object.entries(uploadProgress).map(([fileKey, progress]) => (
            <div key={fileKey} className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={imageUrl}
                  alt={`Imagine ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={disabled}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && !uploading && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Nicio imagine încărcată încă
          </p>
          <p className="text-xs text-gray-500">
            Apasă butonul de mai sus pentru a încărca imagini
          </p>
        </div>
      )}
    </div>
  );
}
