'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ListingGalleryProps {
  images: string[];
  title: string;
}

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center" role="img" aria-label="Fără imagini disponibile">
        <div className="text-center">
          <div className="text-6xl mb-4" aria-hidden="true">📷</div>
          <div className="text-gray-500">Fără imagini disponibile</div>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedIndex(index);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image - Clean Minimalist */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden group">
        <Image
          src={images[selectedIndex]}
          alt={`${title} - imagine ${selectedIndex + 1}`}
          fill
          className="object-cover"
          priority={selectedIndex === 0}
          sizes="(max-width: 1024px) 100vw, 720px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        
        {/* Simple Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-700 p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Imagine anterioară"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-700 p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Imagine următoare"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Simple Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-sm">
            {selectedIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Simple Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.slice(0, 5).map((image, index) => (
            <button
              key={index}
              className={`relative w-16 h-16 bg-gray-100 overflow-hidden flex-shrink-0 border ${
                selectedIndex === index
                  ? 'border-green-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={image}
                alt={`${title} - thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
          
          {images.length > 5 && (
            <div className="w-16 h-16 bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 text-xs">
              +{images.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
