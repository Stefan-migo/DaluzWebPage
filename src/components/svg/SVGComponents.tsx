'use client';

import React from 'react';

// SVG Component Interfaces
interface SVGProps {
  size?: number;
  opacity?: number;
  className?: string;
  color?: string;
}



// Hero Floating Elements
export const FloatingMandala: React.FC<SVGProps> = ({ 
  size = 120, 
  opacity = 0.3, 
  className = "",
  color = "currentColor" 
}) => {
  return (
    <div 
      className={`floating-element ${className}`}
      style={{ opacity }}
    >
      <img 
        src="/svg/hero/mandala-1.svg" 
        alt="" 
        width={size} 
        height={size}
        style={{ filter: `opacity(${opacity})` }}
        className="animate-pulse"
      />
    </div>
  );
};

export const BotanicalElement: React.FC<SVGProps & { variant?: 1 | 2 | 3 | 4 }> = ({ 
  size = 80, 
  opacity = 0.2, 
  className = "",
  variant = 1 
}) => {
  return (
    <div 
      className={`floating-element ${className}`}
      style={{ opacity }}
    >
      <img 
        src={`/svg/hero/botanical-${variant}.svg`} 
        alt="" 
        width={size} 
        height={size}
        style={{ filter: `opacity(${opacity})` }}
        className="animate-float-gentle"
      />
    </div>
  );
};


// ✨ SOBRE NOSOTROS SECTION BACKGROUND
export const SobreNosotrosBackground: React.FC<{
  bgColor?: string;
  waveColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F0EACE", 
  waveColor = "#AE0000",
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        '--bg-color': bgColor,
        '--wave-color': waveColor,
        transform: 'translateZ(0)', // Mobile performance optimization
        willChange: 'transform' // GPU acceleration hint
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1922.54 1070.29"
        className="w-full h-full object-cover sm:object-cover md:object-cover"
        preserveAspectRatio="xMidYMid slice"
        style={{ minHeight: '100%' }}
      >
        <defs>
          <style>{`
            .background-fill { fill: var(--bg-color, #faf7ef); }
            .wave-fill { fill: var(--wave-color, #920000); }
          `}</style>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Capa_1" data-name="Capa 1">
            <polyline 
              points="0.92 0.09 0.92 1081.29 1920.77 1081.29 1920.77 0.1" 
              className="background-fill"
            />
            <path 
              id="OLITAS" 
              d="M1921.29.09c.42,161.63.84,318.2,1.25,500.54-248.81-129.22-460.74-183-606.64-208.34C957.58,230,777.13,357.71,476.42,258.72,303.82,201.9,98,86.52.82,0" 
              className="wave-fill"
            />
            <path 
              id="OLITAS-2" 
              d="M1921.72,1081.29v-145c-85.44,4.28-217.46,11.89-378.66,25.49-273.17,23-322.35,37.31-490.5,41.27-181.93,4.27-334.93-7.48-427.15-14.57C492.49,978.31,444.59,969.2,284.1,957,151.74,946.87,72.06,943.28.57,941,.38,990.35.19,1036.54,0,1081.29" 
              className="wave-fill"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

// ✨ NUESTROS SERVICIOS SECTION BACKGROUND
export const NuestrosServiciosBackground: React.FC<{
  bgColor?: string;
  waveColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#ffffff", 
  waveColor = "#AE0000",
  className = ""
}) => {
  return (
    <div 
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        '--bg-color': bgColor,
        '--wave-color': waveColor
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1921.75 1092.26"
        className="w-full h-full object-cover sm:object-cover md:object-cover"
        preserveAspectRatio="xMidYMid slice"
        style={{ minHeight: '100%' }}
      >
        <defs>
          <style>
            {`.background-fill { fill: var(--bg-color, #ffffff); }
             .wave-fill { fill: var(--wave-color, #AE0000); }`}
          </style>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Capa_1" data-name="Capa 1">
            <polyline points="0.94 11.06 0.94 1092.26 1920.79 1092.26 1920.79 11.07" className="background-fill"/>
            <path id="OLITAS" d="M1.52,0C1,182.21.51,348.71,0,549.76c248.81-117.19,460.74-166,606.64-188.95,358.33-56.45,538.77,59.33,839.49-30.44,172.59-51.53,378.47-156.18,475.59-234.65V0" className="wave-fill"/>
            <path id="OLITAS-2" d="M1921.75,1092.26v-145c-85.45,4.28-217.46,11.89-378.66,25.49-273.18,23-322.36,37.31-490.51,41.26-181.93,4.28-334.93-7.47-427.15-14.56-132.92-10.21-180.82-19.32-341.31-31.56-132.35-10.09-212-13.69-283.53-16C.4,1001.31.21,1047.51,0,1092.26" className="wave-fill"/>
          </g>
        </g>
      </svg>
    </div>
  );
};

// ✨ NUESTRA FILOSOFÍA SECTION BACKGROUND
export const NuestraFilosofiaBackground: React.FC<{
  bgColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#AE0000",
  className = ""
}) => {
  return (
    <div 
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        '--bg-color': bgColor
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1920 1040.02"
        className="w-full h-full object-cover sm:object-cover md:object-cover"
        preserveAspectRatio="xMidYMid slice"
        style={{ minHeight: '100%' }}
      >
        <defs>
          <style>
            {`.background-fill { fill: var(--bg-color, #AE0000); }`}
          </style>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Capa_1" data-name="Capa 1">
            <path d="M1920,1080V0H0V1080" className="background-fill"/>
          </g>
        </g>
      </svg>
    </div>
  );
};

// ✨ ALKIMYA DA LUZ SECTION BACKGROUND
export const AlkimyaBackground: React.FC<{
  bgColor?: string;
  waveColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F0EACE", 
  waveColor = "#AE0000",
  className = ""
}) => {
  return (
    <div 
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        '--bg-color': bgColor,
        '--wave-color': waveColor
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1920 840.71"
        className="w-full h-full object-cover sm:object-cover md:object-cover"
        preserveAspectRatio="xMidYMid slice"
        style={{ minHeight: '100%' }}
      >
        <defs>
          <style>
            {`.background-fill { fill: var(--bg-color, #F0EACE); }
             .wave-fill { fill: var(--wave-color, #AE0000); }`}
          </style>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Capa_1" data-name="Capa 1">
            <polyline points="1.99 1088.71 1.99 8.61 1918.01 8.61 1918.01 1088.71" className="background-fill"/>
            <path d="M0,0C627.2,57.28,1291.13,26.69,1920,175.35V0" className="wave-fill"/>
          </g>
        </g>
      </svg>
    </div>
  );
};

// ✨ PROCESOS SECTION BACKGROUND
export const ProcesosBackground: React.FC<{
  bgColor?: string;
  waveColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#ffffff", 
  waveColor = "#AE0000",
  className = ""
}) => {
  return (
    <div 
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        '--bg-color': bgColor,
        '--wave-color': waveColor
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1920.03 1062.62"
        className="w-full h-full object-cover sm:object-cover md:object-cover"
        preserveAspectRatio="xMidYMid slice"
        style={{ minHeight: '100%' }}
      >
        <defs>
          <style>
            {`.background-fill { fill: var(--bg-color, #ffffff); }
             .wave-fill { fill: var(--wave-color, #AE0000); }`}
          </style>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Capa_1" data-name="Capa 1">
            <polyline points="0 1080.1 0 0 1916.02 0 1916.02 1080.1" className="background-fill"/>
            <path d="M0,1105.62V270.09c321.25-21.39,647.73-35.58,966.85-103.21C1298.33,96.64,1601,23.15,1920,.68V1105.62Z" className="wave-fill"/>
          </g>
        </g>
      </svg>
    </div>
  );
};

// ✨ SESIONES SECTION BACKGROUND
export const SesionesBackground: React.FC<{
  bgColor?: string;
  waveColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F0EACE", 
  waveColor = "#920000",
  className = ""
}) => {
  return (
    <div 
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        '--bg-color': bgColor,
        '--wave-color': waveColor,
        transform: 'translateZ(0)', // Mobile performance optimization
        willChange: 'transform' // GPU acceleration hint
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1920.2 1080.87"
        className="w-full h-full object-cover sm:object-cover md:object-cover"
        preserveAspectRatio="xMidYMid slice"
        style={{ minHeight: '100%' }}
      >
        <defs>
          <style>
            {`
              .sesiones-bg-fill { fill: var(--bg-color, #F0EACE); }
              .sesiones-wave-fill { fill: var(--wave-color, #920000); }
            `}
          </style>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Capa_1" data-name="Capa 1">
            {/* Background from your updated sesionesBG.svg */}
            <rect x="0.15" y="0.2" width="1919.85" height="1085.55" className="sesiones-bg-fill"/>
            {/* Wave Pattern from your updated sesionesBG.svg */}
            <path 
              d="M1919.67,277C1600.81,256.08,1276.76,242.22,960,176.22,627.15,106.86.8,58.88.8,12.65L0,0H1920l-.33,12.65Z" 
              className="sesiones-wave-fill"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

// Enhanced Service Icons
export const AlkimyaDaLuzIcon: React.FC<SVGProps> = ({ size = 64, className = "" }) => {
  return (
    <div className={`service-icon ${className}`}>
      <img 
        src="/images/servicios/AlkimyaDaLuz.svg" 
        alt="Biología De Luz" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
        style={{ filter: `brightness(0) saturate(100%)` }}
      />
    </div>
  );
};

// Enhanced Service Icons
export const ProcesosIntegrativosIcon: React.FC<SVGProps> = ({ size = 64, className = "" }) => {
  return (
    <div className={`service-icon ${className}`}>
      <img 
        src="/images/servicios/procesos.svg" 
        alt="Biología De Luz" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
        style={{ filter: `brightness(0) saturate(100%)` }}
      />
    </div>
  );
};

export const SesionesIcon: React.FC<SVGProps> = ({ size = 64, className = "" }) => {
  return (
    <div className={`service-icon ${className}`}>
      <img 
        src="/images/servicios/sesiones.svg" 
        alt="Sesiones" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
        style={{ filter: `brightness(0) saturate(100%)` }}
      />
    </div>
  );
};

export const MembresiaIcon: React.FC<SVGProps> = ({ size = 64, className = "" }) => {
  return (
    <div className={`service-icon ${className}`}>
      <img 
        src="/images/servicios/membresia.svg" 
        alt="Membresía" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
        style={{ filter: `brightness(0) saturate(100%)` }}
      />
    </div>
  );
};

// Animated Background Component
// ✨ BLOG COMUNIDAD SECTION BACKGROUND
export const BlogComunidadBackground: React.FC<{
  bgColor?: string;
  waveColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#AE0000", 
  waveColor = "#920000",
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        '--bg-color': bgColor,
        '--wave-color': waveColor,
        transform: 'translateZ(0)', // Mobile performance optimization
        willChange: 'transform' // GPU acceleration hint
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1920 1080.21"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ minHeight: '100%' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <style>
            {`
              .blog-bg-fill { fill: var(--bg-color, #AE0000); }
              .blog-wave-fill { fill: var(--wave-color, #920000); }
            `}
          </style>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Capa_1" data-name="Capa 1">
            {/* Background */}
            <rect x="0.07" width="1919.85" height="1079.42" className="blog-bg-fill"/>
            {/* Wave Pattern from your blogBG.svg */}
            <path 
              d="M0,1078.78l1920,.29V202.8c-218.21-17.92-840.69-1-878.37,11.45s-134.6,47.2-106,206.52c37.44,208.62,27.15,313.71,15.93,400.34C917.17,1086.7,0,1078.78,0,1078.78Z" 
              className="blog-wave-fill"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

// ✨ GALERÍA SECTION BACKGROUND
export const GaleriaBackground: React.FC<{
  bgColor?: string;
  waveColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F0EACE", 
  waveColor = "#AE0000",
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        '--bg-color': bgColor,
        '--wave-color': waveColor,
        transform: 'translateZ(0)', // Mobile performance optimization
        willChange: 'transform' // GPU acceleration hint
      } as React.CSSProperties}
    >
      <svg
        viewBox="0 0 1920 1080"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ minHeight: '100%' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <style>
            {`
              .galeria-bg-fill { fill: var(--bg-color, #F0EACE); }
              .galeria-wave-fill { fill: var(--wave-color, #AE0000); }
            `}
          </style>
        </defs>
        
        {/* Background */}
        <rect width="1920" height="1080" className="galeria-bg-fill" />
        
        {/* Decorative Wave Pattern - Place your SVG file content here */}
        {/* This will be replaced with actual SVG content from galeriaBG.svg */}
        <path 
          className="galeria-wave-fill" 
          d="M0,300 Q480,200 960,300 T1920,300 L1920,0 L0,0 Z"
          opacity="0.6"
        />
        <path 
          className="galeria-wave-fill" 
          d="M0,400 Q480,300 960,400 T1920,400 L1920,0 L0,0 Z"
          opacity="0.4"
        />
      </svg>
    </div>
  );
};

// ✨ CONTACTO SECTION BACKGROUND
export const ContactoBackground: React.FC<{
  bgColor?: string;
  waveColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F0EACE", 
  waveColor = "#920000",
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        '--bg-color': bgColor,
        '--wave-color': waveColor,
        transform: 'translateZ(0)', // Mobile performance optimization
        willChange: 'transform' // GPU acceleration hint
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1920.98 1085.64"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ minHeight: '100%' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <style>
            {`
              .contacto-bg-fill { fill: var(--bg-color, #F0EACE); }
              .contacto-wave-fill { fill: var(--wave-color, #920000); }
            `}
          </style>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Capa_1" data-name="Capa 1">
            {/* Background */}
            <rect x="3.43" width="1916.83" height="1084.33" className="contacto-bg-fill"/>
            {/* Wave Pattern from your contactoBG.svg */}
            <path 
              d="M0,1085.64H1921V1.31c-320.92,21.1-627.33,94-960.35,163.7-310,64.87-627,79.59-939.33,99.84-7.14.64-7.57.66-15.44,1l-5.39.36" 
              className="contacto-wave-fill"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Mandala Elements */}
      <FloatingMandala 
        size={100} 
        opacity={0.15} 
        className="absolute top-20 left-20 animate-float-gentle" 
      />
      <FloatingMandala 
        size={80} 
        opacity={0.1} 
        className="absolute bottom-32 right-32 animate-float-gentle delay-1000" 
      />
      
      {/* Botanical Elements */}
      <BotanicalElement 
        variant={1}
        size={60} 
        opacity={0.2} 
        className="absolute top-40 right-20 animate-float-gentle delay-500" 
      />
      <BotanicalElement 
        variant={2}
        size={70} 
        opacity={0.15} 
        className="absolute top-1/2 left-10 animate-float-gentle delay-1500" 
      />
      <BotanicalElement 
        variant={3}
        size={50} 
        opacity={0.25} 
        className="absolute bottom-40 left-1/3 animate-float-gentle delay-700" 
      />
      <BotanicalElement 
        variant={4}
        size={65} 
        opacity={0.18} 
        className="absolute top-1/3 right-1/4 animate-float-gentle delay-2000" 
      />
      
      {/* Additional Floating Particles */}
      {Array.from({length: 15}).map((_, i) => {
        // Use deterministic values based on index to avoid hydration mismatch
        const positions = [
          { left: 8.6, top: 24.9, delay: 2.5, duration: 3.8 },
          { left: 87.7, top: 38.1, delay: 1.6, duration: 4.2 },
          { left: 15.3, top: 67.2, delay: 0.8, duration: 3.5 },
          { left: 92.1, top: 12.4, delay: 2.1, duration: 4.0 },
          { left: 23.7, top: 45.8, delay: 1.3, duration: 3.7 },
          { left: 78.9, top: 56.3, delay: 2.8, duration: 4.1 },
          { left: 34.2, top: 18.6, delay: 0.5, duration: 3.9 },
          { left: 65.4, top: 73.1, delay: 1.9, duration: 3.6 },
          { left: 41.8, top: 29.7, delay: 2.3, duration: 4.3 },
          { left: 56.2, top: 81.4, delay: 0.7, duration: 3.4 },
          { left: 19.5, top: 52.6, delay: 1.8, duration: 4.5 },
          { left: 83.7, top: 35.9, delay: 2.6, duration: 3.2 },
          { left: 27.1, top: 14.3, delay: 1.1, duration: 3.8 },
          { left: 71.3, top: 68.7, delay: 2.4, duration: 4.0 },
          { left: 48.6, top: 42.1, delay: 0.9, duration: 3.6 }
        ];
        const pos = positions[i] || positions[0];
        
        return (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`
            }}
          />
        );
      })}
    </div>
  );
};

// Gallery Navigation Arrows with Theme Color Support
export const ArrowLeftSVG = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 85.24 105.19" 
      className={className}
    >
      <g>
        <g>
          <path 
            d="M83.93,0C66,16.18,46.83,30.93,27.42,45.22c-6.47,4.75-13,9.4-19.58,14L7.63,50.9C30.94,65.48,54.19,80.94,76,97.75c2.67,2.08,6.72,5.26,9.29,7.44-3.11-1.3-7.66-3.6-10.77-5.07C49.81,88,25.69,73.89,2.34,59.38A5,5,0,0,1,2.12,51C8.71,46.47,15.33,41.93,22,37.49,42.12,24.18,62.57,11.24,83.93,0Z" 
            fill={color}
          />
        </g>
      </g>
    </svg>
  );
};

export const ArrowRightSVG = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 85.24 105.19" 
      className={className}
    >
      <g>
        <g>
          <path 
            d="M1.32,105.19C19.22,89,38.41,74.26,57.82,60c6.47-4.75,13-9.4,19.58-14l.21,8.33C54.3,39.71,31.05,24.25,9.29,7.44,6.62,5.37,2.57,2.18,0,0,3.11,1.3,7.67,3.6,10.77,5.07,35.43,17.2,59.55,31.3,82.9,45.81a5,5,0,0,1,.22,8.34c-6.59,4.57-13.21,9.11-19.9,13.55C43.12,81,22.67,94,1.32,105.19Z" 
            fill={color}
          />
        </g>
      </g>
    </svg>
  );
};

// ✨ PHILOSOPHY SECTION CUSTOM ICONS
export const AncestralidadNaturalezaIcon: React.FC<SVGProps> = ({ 
  size = 50, 
  className = "",
  color = "currentColor" 
}) => {
  return (
    <div className={`philosophy-icon ${className}`}>
      <img 
        src="/svg/filosofia/Ancestralidad-y-naturaleza.svg" 
        alt="Naturaleza y Ancestralidad" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
        style={{ filter: `brightness(0) saturate(100%) invert(100%)` }}
      />
    </div>
  );
};

export const VisionIntegralIcon: React.FC<SVGProps> = ({ 
  size = 50, 
  className = "",
  color = "currentColor" 
}) => {
  return (
    <div className={`philosophy-icon ${className}`}>
      <img 
        src="/svg/filosofia/vision-integral-y-autogestion.svg" 
        alt="Visión Integral y Autogestión" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
        style={{ filter: `brightness(0) saturate(100%) invert(100%)` }}
      />
    </div>
  );
};

export const CeremoniaPresenciaIcon: React.FC<SVGProps> = ({ 
  size = 50, 
  className = "",
  color = "currentColor" 
}) => {
  return (
    <div className={`philosophy-icon ${className}`}>
      <img 
        src="/svg/filosofia/ceremoniaypresencia.svg" 
        alt="Ceremonia y Presencia" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
        style={{ filter: `brightness(0) saturate(100%) invert(100%)` }}
      />
    </div>
  );
};

export const PlacerCreatividadIcon: React.FC<SVGProps> = ({ 
  size = 50, 
  className = "",
  color = "currentColor" 
}) => {
  return (
    <div className={`philosophy-icon ${className}`}>
      <img 
        src="/svg/filosofia/placerycreatividad.svg" 
        alt="Placer y Creatividad Consciente" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
        style={{ filter: `brightness(0) saturate(100%) invert(100%)` }}
      />
    </div>
  );
};

// ✨ ALKIMYA DA LUZ SECTION CUSTOM ICONS
export const EcologicaVeganaIcon: React.FC<SVGProps> = ({ 
  size = 48, 
  className = "",
  color = "currentColor" 
}) => {
  return (
    <div className={`alkimia-icon flex items-center justify-center ${className}`}>
      <img 
        src="/svg/alkimia/ecologicasyveganas.svg" 
        alt="Ecológica y Vegana" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
        style={{ filter: `brightness(0) saturate(100%)` }}
      />
    </div>
  );
};

export const PoderBotanicoIcon: React.FC<SVGProps> = ({ 
  size = 48, 
  className = "",
  color = "currentColor" 
}) => {
  return (
    <div className={`alkimia-icon flex items-center justify-center ${className}`}>
      <img 
        src="/svg/alkimia/poderbotanicoynatural.svg" 
        alt="Poder botánico y Natural" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
        style={{ filter: `brightness(0) saturate(100%)` }}
      />
    </div>
  );
};

export const TransmutacionCoherenciaIcon: React.FC<SVGProps> = ({ 
  size = 48, 
  className = "",
  color = "currentColor" 
}) => {
  return (
    <div className={`alkimia-icon flex items-center justify-center ${className}`}>
      <img 
        src="/svg/alkimia/transmutaciónycoherencia.svg" 
        alt="Transmutación y coherencia" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
        style={{ filter: `brightness(0) saturate(100%)` }}
      />
    </div>
  );
};

export const NeurocosmeticaIcon: React.FC<SVGProps> = ({ 
  size = 48, 
  className = "",
  color = "currentColor" 
}) => {
  return (
    <div className={`alkimia-icon flex items-center justify-center ${className}`}>
      <img 
        src="/svg/alkimia/neurocosmetica.svg" 
        alt="Neurocosmética Vibracional" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
        style={{ filter: `brightness(0) saturate(100%)` }}
      />
    </div>
  );
};
