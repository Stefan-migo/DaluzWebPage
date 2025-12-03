'use client';

import { useState } from "react";
import { ArrowLeftSVG, ArrowRightSVG } from "@/components/svg/SVGComponents";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function InteractiveGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageClick = (index: number, e: React.MouseEvent) => {
    // Only open dialog if not dragging
    if (!isDragging) {
      setSelectedImage(index);
    }
  };

  return (
    <div className="relative">
      {/* Mobile-specific arrow styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          .gallery-arrow-left svg,
          .gallery-arrow-right svg {
            width: 12px !important;
            height: 12px !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1279px) {
          .gallery-arrow-left svg,
          .gallery-arrow-right svg {
            width: 24px !important;
            height: 24px !important;
          }
        }
        @media (min-width: 1280px) {
          .gallery-arrow-left svg,
          .gallery-arrow-right svg {
            width: 32px !important;
            height: 32px !important;
          }
        }
      `}} />
      {/* Navigation Arrows */}
      <button 
        className="gallery-arrow-left absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-30 transition-all duration-300 hover:scale-110 cursor-pointer"
        onClick={() => {
          const carousel = document.getElementById('gallery-carousel');
          if (carousel) {
            const scrollAmount = window.innerWidth < 640 ? -240 : -320; // Responsive scroll
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }}
        style={{ color: '#AE0000', background: 'none', border: 'none', padding: 0 }}
        aria-label="Previous image"
      >
        <ArrowLeftSVG className="" color="#AE0000" />
      </button>
      
      <button 
        className="gallery-arrow-right absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-30 transition-all duration-300 hover:scale-110 cursor-pointer"
        onClick={() => {
          const carousel = document.getElementById('gallery-carousel');
          if (carousel) {
            const scrollAmount = window.innerWidth < 640 ? 240 : 320; // Responsive scroll
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }}
        style={{ color: '#AE0000', background: 'none', border: 'none', padding: 0 }}
        aria-label="Next image"
      >
        <ArrowRightSVG className="" color="#AE0000" />
      </button>

      {/* Gallery Container with Interactive Scroll */}
      <div 
        id="gallery-carousel"
        className="overflow-x-auto scrollbar-hide rounded-2xl px-4 sm:px-8 lg:px-12"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: 'grab',
          scrollBehavior: 'smooth',
          willChange: 'scroll-position',
          WebkitOverflowScrolling: 'touch'
        }}
        onMouseDown={(e) => {
          const carousel = e.currentTarget;
          let isDown = true;
          const startX = e.pageX - carousel.offsetLeft;
          const startScrollLeft = carousel.scrollLeft;
          
          setIsDragging(false);
          carousel.style.cursor = 'grabbing';
          
          let rafId: number | null = null;
          
          const handleMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            
            const x = e.pageX - carousel.offsetLeft;
            const walk = Math.abs(x - startX);
            
            // If mouse moved more than 5px, consider it a drag
            if (walk > 5) {
              setIsDragging(true);
            }
            
            if (rafId) {
              cancelAnimationFrame(rafId);
            }
            
            rafId = requestAnimationFrame(() => {
              const walk = (x - startX) * 2;
              carousel.scrollLeft = startScrollLeft - walk;
            });
          };
          
          const handleMouseUp = () => {
            isDown = false;
            if (rafId) {
              cancelAnimationFrame(rafId);
            }
            carousel.style.cursor = 'grab';
            // Reset dragging state after a short delay
            setTimeout(() => setIsDragging(false), 100);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };
          
          document.addEventListener('mousemove', handleMouseMove, { passive: false });
          document.addEventListener('mouseup', handleMouseUp);
        }}
      >
        <div className="flex space-x-3 sm:space-x-4 lg:space-x-6 w-max">
          {/* First Set of Images */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={`set1-${i}`} className="flex-shrink-0 group">
              <div 
                className="card-enhanced w-60 h-72 sm:w-72 sm:h-80 lg:w-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 cursor-pointer"
                onClick={(e) => handleImageClick(i, e)}
              >
                <div className="relative h-full w-full">
                  {/* Gallery Image - Optimized with Next.js Image */}
                  <Image
                    src={`/images/gallery/gallery-${i}.jpg`}
                    alt={`Galería DA LUZ ${i}`}
                    fill
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 288px, 320px"
                    className="object-cover"
                    loading={i === 1 ? undefined : "lazy"}
                    priority={i === 1}
                    quality={85}
                    style={{
                      willChange: 'transform',
                      transform: 'translateZ(0)'
                    }}
                  />

                  {/* Fallback content when image is not available */}
                  <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20" style={{ display: 'none' }}>
                    <div className="text-center text-white">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-60" />
                      <div className="font-title text-xl mb-2">Imagen {i}</div>
                      <div className="font-caption text-sm opacity-80">Próximamente</div>
                    </div>
                  </div>

                  {/* Elegant Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-subtitle text-lg mb-2">Momento Alkimya</h3>
                    <p className="font-caption text-sm opacity-90">Descubre la magia en cada detalle</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Dialog */}
      <Dialog open={selectedImage !== null} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent 
          className="max-w-7xl w-[95vw] h-[90vh] max-h-[90vh] p-0 border-2 shadow-2xl"
          style={{
            backgroundColor: '#F0EACE',
            borderColor: '#AE0000',
            borderRadius: '1rem'
          }}
        >
          {/* Visually hidden title and description for accessibility */}
          <DialogTitle className="sr-only">
            Galería DA LUZ - Imagen {selectedImage}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Vista ampliada de la imagen {selectedImage} de la galería DA LUZ
          </DialogDescription>
          
          {selectedImage !== null && (
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
              <div className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center bg-white/50 rounded-lg p-2 shadow-inner">
                <Image
                  src={`/images/gallery/gallery-${selectedImage}.jpg`}
                  alt={`Galería DA LUZ ${selectedImage}`}
                  width={1200}
                  height={800}
                  className="object-contain w-full h-full rounded-lg"
                  quality={80}
                  priority
                  sizes="(max-width: 768px) 95vw, (max-width: 1200px) 90vw, 1200px"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
