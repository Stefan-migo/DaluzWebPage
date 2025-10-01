'use client';

export default function ProcesosImage() {
  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
      {/* Elliptical shaped container for Procesos image */}
      <div 
        className="absolute shadow-2xl"
        style={{
          width: '120%',
          height: '105%',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) rotate(-57.22deg)',
          transformOrigin: 'center center',
          clipPath: 'ellipse(54% 47% at 50% 50%)', // rx:431.84 ry:380.28 ratio adapted
          border: '3px solid rgba(174, 0, 0, 0.3)'
        }}
      >
        {/* Procesos Image */}
        <img
          src="/images/procesos/procesos-image.jpg"
          alt="Procesos Integrales DA LUZ"
          className="w-full h-full object-cover"
          style={{
            transform: 'rotate(57.22deg) scale(1.2)', // Counter-rotate to keep image upright
            transformOrigin: 'center center',
            filter: "brightness(0.9) saturate(1.1) contrast(1.05)"
          }}
          onError={(e) => {
            // Hide the image and show fallback on error
            e.currentTarget.style.display = 'none';
            const fallback = document.getElementById('procesos-fallback');
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
            transform: 'rotate(57.22deg)'
          }}
          id="procesos-fallback"
        >
          <div className="text-center">
            <div className="font-title text-lg sm:text-xl lg:text-2xl text-brand-primary mb-2">Proceso</div>
            <div className="font-title text-base sm:text-lg text-brand-primary/70">Integral</div>
            <div className="w-12 sm:w-16 h-0.5 bg-brand-primary/50 mx-auto my-3 sm:my-4"></div>
            <div className="text-xs sm:text-sm text-gray-600">Transformación</div>
            <div className="text-xs sm:text-sm text-gray-600">Consciente</div>
          </div>
        </div>
      </div>
    </div>
  );
}
