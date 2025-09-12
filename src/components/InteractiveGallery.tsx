'use client';

import { ArrowLeftSVG, ArrowRightSVG } from "@/components/svg/SVGComponents";
import { Sparkles } from "lucide-react";

export default function InteractiveGallery() {
  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <button 
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-white/20 p-2 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
        onClick={() => {
          const carousel = document.getElementById('gallery-carousel');
          if (carousel) {
            const scrollAmount = window.innerWidth < 640 ? -240 : -320; // Responsive scroll
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }}
        style={{ color: '#AE0000' }}
      >
        <ArrowLeftSVG className="w-8 h-8" color="#AE0000" />
      </button>
      
      <button 
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-white/20 p-2 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
        onClick={() => {
          const carousel = document.getElementById('gallery-carousel');
          if (carousel) {
            const scrollAmount = window.innerWidth < 640 ? 240 : 320; // Responsive scroll
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }}
        style={{ color: '#AE0000' }}
      >
        <ArrowRightSVG className="w-8 h-8" color="#AE0000" />
      </button>

      {/* Gallery Container with Interactive Scroll */}
      <div 
        id="gallery-carousel"
        className="overflow-x-auto scrollbar-hide rounded-2xl px-4 sm:px-8 lg:px-12"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: 'grab'
        }}
        onMouseDown={(e) => {
          const carousel = e.currentTarget;
          let isDown = true;
          const startX = e.pageX - carousel.offsetLeft;
          const scrollLeft = carousel.scrollLeft;
          
          carousel.style.cursor = 'grabbing';
          
          const handleMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
          };
          
          const handleMouseUp = () => {
            isDown = false;
            carousel.style.cursor = 'grab';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };
          
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      >
        <div className="flex space-x-3 sm:space-x-4 lg:space-x-6 w-max">
          {/* First Set of Images */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={`set1-${i}`} className="flex-shrink-0 group">
              <div className="card-enhanced w-60 h-72 sm:w-72 sm:h-80 lg:w-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <div className="relative h-full">
                  {/* Gallery Image */}
                  <img
                    src={`/images/gallery/gallery-${i}.jpg`}
                    alt={`Galería DA LUZ ${i}`}
                    className="w-full h-full object-cover"
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
    </div>
  );
}
