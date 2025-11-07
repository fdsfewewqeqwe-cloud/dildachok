'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageModalProps {
  images: string[];
  productName: string;
}

export default function ImageModal({ images, productName }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Main Image - Clickable */}
      <div 
        className="glass-effect rounded-xl overflow-hidden mb-2 md:mb-3 h-80 md:h-96 bg-gradient-to-br from-gray-900 to-black relative cursor-zoom-in group"
        onClick={() => openModal(0)}
      >
        {images[0] ? (
          <>
            <Image 
              src={images[0]} 
              alt={productName}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
            <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm">
              🔍 Нажмите для увеличения
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-9xl">🔫</span>
          </div>
        )}
      </div>

      {/* Thumbnails - Clickable */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-2 mb-2 md:mb-3">
          {images.slice(0, 3).map((img, idx) => (
            <div
              key={idx}
              onClick={() => openModal(idx)}
              className="glass-effect rounded-lg overflow-hidden h-16 md:h-20 bg-gradient-to-br from-gray-900 to-black cursor-pointer hover:border-blue-400 transition-colors relative group"
            >
              <Image 
                src={img} 
                alt={`${productName} - ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform"
                unoptimized
              />
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/20 transition-colors" />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-colors"
          >
            ×
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-colors z-10"
            >
              ‹
            </button>
          )}

          {/* Current Image */}
          <div 
            className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex]}
              alt={`${productName} - ${currentIndex + 1}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-colors z-10"
            >
              ›
            </button>
          )}

          {/* Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-lg text-xs backdrop-blur-sm">
            Нажмите ESC или кликните вне изображения для закрытия
          </div>
        </div>
      )}
    </>
  );
}
