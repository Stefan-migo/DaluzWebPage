'use client';

export default function SesionesImage() {
  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
      {/* Elliptical shaped container for Sesiones image */}
      <div 
        className="absolute shadow-2xl"
        style={{
          width: '100%',
          height: '120%',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) rotate(-32.78deg)',
          transformOrigin: 'center center',
          clipPath: 'ellipse(45% 54% at 50% 50%)', // rx:360.02 ry:431.84 ratio adapted
          border: '3px solid rgba(174, 0, 0, 0.3)'
        }}
      >
        {/* Sesiones Image */}
        <img
          src="/images/sesiones/sesiones-image.jpg"
          alt="Sesiones Personales DA LUZ"
          className="w-full h-full object-cover"
          style={{
            transform: 'rotate(32.78deg) scale(1.2)', // Counter-rotate to keep image upright
            transformOrigin: 'center center',
            filter: "brightness(0.9) saturate(1.1) contrast(1.05)"
          }}
          onError={(e) => {
            // Hide the image and show fallback on error
            e.currentTarget.style.display = 'none';
            const fallback = document.getElementById('sesiones-fallback');
            if (fallback) {
              fallback.style.opacity = '1';
              fallback.style.pointerEvents = 'auto';
            }
          }}
        />
        
        {/* Fallback content when image is not available - Hidden by default */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white to-bg-cream flex items-center justify-center opacity-0 pointer-events-none"
          style={{ 
            transform: 'rotate(32.78deg)'
          }}
          id="sesiones-fallback"
        >
          <div className="text-center">
            <div className="font-title text-lg sm:text-xl lg:text-2xl text-brand-primary mb-2">Sesiones</div>
            <div className="font-title text-base sm:text-lg text-brand-primary/70">Personales</div>
            <div className="w-12 sm:w-16 h-0.5 bg-brand-primary/50 mx-auto my-3 sm:my-4"></div>
            <div className="text-xs sm:text-sm text-gray-600">Sanación</div>
            <div className="text-xs sm:text-sm text-gray-600">Consciente</div>
          </div>
        </div>
      </div>
    </div>
  );
}
