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


// ✨ SOBRE NOSOTROS SECTION BACKGROUND (MANIFIESTO DA LUZ)
export const SobreNosotrosBackground: React.FC<{
  bgColor?: string;
  waveColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F6FBD6", // Default theme background color
  waveColor = "#AE0000", // Brand red wine color
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        backgroundColor: bgColor,
        '--wave-color': waveColor,
        transform: 'translateZ(0)',
        willChange: 'transform',
        minHeight: '100%',
        minWidth: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1922.91 1080.08"
        preserveAspectRatio="xMidYMid meet"
        style={{ 
          width: '100%',
          height: '100%',
          display: 'block',
          transform: 'scaleX(-1)', // Horizontally mirror for Manifiesto section
          transformOrigin: 'center'
        }}
      >
        <defs>
          <style>{`
            .wave-fill { fill: var(--wave-color, #AE0000); }
          `}</style>
        </defs>
        <g>
          {/* Top wave */}
          <path 
            className="wave-fill" 
            d="M1922.04,0c-97.13,86.58-303,202.04-475.6,258.9-300.72,99.06-481.16-28.7-839.49,33.59C461.06,317.85,249.12,371.67.31,500.97.73,319.47,0,.9,0,.02"
          />
          {/* Bottom wave */}
          <path 
            className="wave-fill" 
            d="M1922.91,1080.08c0-65.27,0-130.55,0-195.82-85.4,4.03-217.34,11.21-378.45,24.03-273.02,21.73-322.18,35.19-490.24,38.91-181.83,4.03-334.74-7.05-426.91-13.73-132.85-9.63-180.72-18.22-341.12-29.76-132.28-9.52-212.72-12.64-284.18-14.81-.28,68.58.25,130.38-.03,191.17"
          />
        </g>
      </svg>
    </div>
  );
};

// ✨ ALKIMYA NEUROCOSMÉTICA SECTION BACKGROUND
export const AlkimyaNeurocosmeticaBackground: React.FC<{
  bgColor?: string;
  waveColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F6FBD6", // Default theme background color
  waveColor = "#AE0000", // Brand red wine color
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        backgroundColor: bgColor,
        '--wave-color': waveColor,
        transform: 'translateZ(0)',
        willChange: 'transform',
        minHeight: '100%',
        minWidth: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920.19 1080.18"
        preserveAspectRatio="xMidYMid meet"
        style={{ 
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      >
        <defs>
          <style>{`
            .wave-fill { fill: var(--wave-color, #AE0000); }
          `}</style>
        </defs>
        <g>
          {/* Top wave */}
          <path 
            className="wave-fill" 
            d="M1920.16.06c-97.13,86.58-303,202.04-475.59,258.9-300.72,99.06-481.16-28.7-839.49,33.59C459.18,317.91,246.95,354.5.12,483.72V0s1920.04.06,1920.04.06Z"
          />
          {/* Bottom wave */}
          <path 
            className="wave-fill" 
            d="M1920.19,1080.09l-.02-191.43s-150.87,5.53-283.09,15.04c-160.33,11.54-208.18,20.13-340.97,29.76-92.13,6.68-244.98,17.77-426.73,13.73-167.99-3.73-217.12-17.18-490.02-38.91C218.31,895.46.12,884.23.12,884.23l-.12,195.95,1920.19-.09Z"
          />
        </g>
      </svg>
    </div>
  );
};

// ✨ EXPLORÁ NUESTRAS 5 LINEAS SECTION BACKGROUND (Upper edge wave only)
export const Explora5LineasBackground: React.FC<{
  bgColor?: string;
  waveColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F6FBD6", // Default theme background color
  waveColor = "#AE0000", // Brand red wine color
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        backgroundColor: bgColor,
        '--wave-color': waveColor,
        transform: 'translateZ(0)',
        willChange: 'transform',
        minHeight: '100%',
        minWidth: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920.05 451.37"
        preserveAspectRatio="xMidYMin meet"
        style={{ 
          width: '100%',
          height: 'auto',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        <defs>
          <style>{`
            .wave-fill { fill: var(--wave-color, #AE0000); }
          `}</style>
        </defs>
        <g>
          {/* Top wave */}
          <path 
            className="wave-fill" 
            d="M1920.05.05c-75.07,29.18-1375.32,24.69-1617.37,105.69S7.71,385.46,0,451.37V0s1920.04.05,1920.04.05Z"
          />
        </g>
      </svg>
    </div>
  );
};

// ✨ VALOR Y CONFIANZA DA LUZ SECTION BACKGROUND
export const ValorYConfianzaBackground: React.FC<{
  bgColor?: string;
  waveColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F6FBD6", // Default theme background color
  waveColor = "#AE0000", // Brand red wine color
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        backgroundColor: bgColor,
        '--wave-color': waveColor,
        transform: 'translateZ(0)',
        willChange: 'transform',
        minHeight: '100%',
        minWidth: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920.07 1080.12"
        preserveAspectRatio="xMidYMid meet"
        style={{ 
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      >
        <defs>
          <style>{`
            .wave-fill { fill: var(--wave-color, #AE0000); }
          `}</style>
        </defs>
        <g>
          {/* Background rectangle to fill any gaps */}
          <rect 
            width="100%" 
            height="100%" 
            fill={bgColor}
          />
          {/* Top wave */}
          <path 
            className="wave-fill" 
            d="M1920.05.06c-75.07,31.28-1375.32,26.46-1617.37,113.27S7.71,413.09,0,483.72V0s1920.04.06,1920.04.06Z"
          />
          {/* Bottom wave */}
          <path 
            className="wave-fill" 
            d="M1920.07,1080.12l-.02-163.31s-150.87,4.77-283.09,12.97c-160.33,9.95-208.18,17.36-340.97,25.66-92.13,5.76-244.98,15.32-426.73,11.84-167.99-3.21-217.12-14.82-490.02-33.56C218.2,922.67,0,912.98,0,912.98v167.12s1920.07.01,1920.07.01Z"
          />
        </g>
      </svg>
    </div>
  );
};

// ✨ SERVICIOS HOLÍSTICOS SECTION BACKGROUND
export const ServiciosHolisticosBackground: React.FC<{
  bgColor?: string;
  waveColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F6FBD6", // Default theme background color
  waveColor = "#AE0000", // Brand red wine color
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        backgroundColor: bgColor,
        '--wave-color': waveColor,
        transform: 'translateZ(0)',
        willChange: 'transform',
        minHeight: '100%',
        minWidth: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920.23 1080.23"
        preserveAspectRatio="xMidYMid meet"
        style={{ 
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      >
        <defs>
          <style>{`
            .wave-fill { fill: var(--wave-color, #AE0000); }
          `}</style>
        </defs>
        <g>
          {/* Background rectangle to fill any gaps */}
          <rect 
            width="100%" 
            height="100%" 
            fill={bgColor}
          />
          {/* Top wave */}
          <path 
            className="wave-fill" 
            d="M1920.2,0C1225.01,573.05,830.83,38.05,0,483.62V0h1920.2Z"
          />
          {/* Bottom wave */}
          <path 
            className="wave-fill" 
            d="M1920.23,1080.23l-.04-191.58s-150.9,5.53-283.12,15.04c-160.33,11.54-208.18,20.13-340.97,29.76-92.13,6.68-244.98,17.77-426.73,13.73-167.99-3.73-217.12-17.18-490.02-38.91C218.31,895.46,0,884.17,0,884.17v196.01l1920.23.05Z"
          />
        </g>
      </svg>
    </div>
  );
};

// ✨ BLOG SECTION BACKGROUND (Bottom edge wave only)
export const BlogBackground: React.FC<{
  bgColor?: string;
  waveColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F0EACE", // Default theme background color
  waveColor = "#AE0000", // Brand red wine color
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        backgroundColor: bgColor,
        '--wave-color': waveColor,
        transform: 'translateZ(0)',
        willChange: 'transform',
        minHeight: '100%',
        minWidth: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 779.07"
        preserveAspectRatio="xMidYMax meet"
        style={{ 
          width: '100%',
          height: 'auto',
          display: 'block',
          position: 'absolute',
          bottom: 0,
          left: 0
        }}
      >
        <defs>
          <style>{`
            .wave-fill { fill: var(--wave-color, #AE0000); }
          `}</style>
        </defs>
        <g>
          {/* Bottom wave */}
          <path 
            className="wave-fill" 
            d="M0,778.84l1920,.23V2c-490.89,0-992.34-35.52-960,193.14,23,162.62,19.74,318.94,0,394.91-17.11,65.85-147.23,129.75-323.4,140.94C227.72,756.95,0,778.84,0,778.84Z"
          />
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
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: '100%'
        }}
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
        backgroundColor: bgColor,
        '--bg-color': bgColor
      } as React.CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1920 1040.02"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: '100%'
        }}
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
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: '100%'
        }}
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
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: '100%'
        }}
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
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: '100%'
        }}
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
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: '100%'
        }}
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
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: '100%'
        }}
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
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: '100%'
        }}
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

// ✨ MANIFIESTO SECTION 1 BACKGROUND
export const ManifiestoSection1Background: React.FC<{
  bgColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F6FBD6", // Default theme background color
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        backgroundColor: bgColor,
        transform: 'translateZ(0)',
        willChange: 'transform',
        minHeight: '100%',
        minWidth: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      } as React.CSSProperties}
    >
      {/* Mobile/Tablet SVG Background - Height adapts to content */}
      <div
        className="xl:hidden absolute inset-0 w-full overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '100%',
          zIndex: 0
        }}
      >
        <img
          src="/svg/manifiesto-section1-mobile-tablet-background.svg"
          alt=""
          className="w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            width: '100%',
            height: '100%',
            minHeight: '100%'
          }}
        />
      </div>
      
      {/* Desktop SVG Background - Fixed height based on aspect ratio */}
      <div 
        className="hidden xl:block absolute top-0 left-0 w-full overflow-hidden svg-container-desktop" 
        style={{ 
          maxWidth: '100%',
          width: '100%',
          aspectRatio: '1920.08 / 3140.34', // Desktop SVG aspect ratio
          height: 'auto',
          minHeight: 'calc(100vw * (3140.34 / 1920.08))',
          zIndex: 0
        }}
      >
        <img
          src="/svg/manifiesto-section1-background.svg"
          alt=""
          className="w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            height: '100%',
            width: '100%',
            minWidth: '100%',
            minHeight: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      </div>
    </div>
  );
};

// ✨ MANIFIESTO SECTION 2 MERGED BACKGROUND (Sections 2 & 3 combined)
export const ManifiestoSection2MergedBackground: React.FC<{
  bgColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F6FBD6", // Default theme background color
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        backgroundColor: bgColor,
        transform: 'translateZ(0)',
        willChange: 'transform',
        minHeight: '100%',
        minWidth: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      } as React.CSSProperties}
    >
      {/* Mobile SVG Background - Height adapts to content */}
      <div
        className="md:hidden absolute top-0 left-0 w-full overflow-hidden"
        style={{
          maxWidth: '100%',
          width: '100%',
          height: '100%', // Adapts to section height
          minHeight: '100%',
          zIndex: 0
        }}
      >
        <img
          src="/svg/manifiesto-section2-mobile-background.svg"
          alt=""
          className="w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            width: '100%',
            height: '100%',
            minHeight: '100%'
          }}
        />
      </div>

      {/* Tablet SVG Background - Full width, height adapts to content */}
      <div
        className="hidden md:block xl:hidden absolute top-0 left-0 w-full overflow-hidden svg-container-tablet"
        style={{
          maxWidth: '100%',
          width: '100%',
          height: '100%',
          minHeight: '100%',
          zIndex: 0
        }}
      >
        <img
          src="/svg/manifiesto-section2-mobile-background.svg"
          alt=""
          className="w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            width: '100%',
            height: '100%',
            minHeight: '100%'
          }}
        />
      </div>
      
      {/* Desktop SVG Background - Fixed height based on aspect ratio */}
      <div 
        className="hidden xl:block absolute top-0 left-0 w-full overflow-hidden svg-container-desktop" 
        style={{ 
          maxWidth: '100%',
          width: '100%',
          aspectRatio: '1924.37 / 5362.08', // Desktop SVG aspect ratio
          height: 'auto',
          minHeight: 'calc(100vw * (5362.08 / 1924.37))',
          zIndex: 0
        }}
      >
        <img
          src="/svg/manifiesto-section2-merged-background.svg"
          alt=""
          className="w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            height: '100%',
            width: '100%',
            minWidth: '100%',
            minHeight: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      </div>
    </div>
  );
};

// ✨ ACTIVOS Y ORIGEN BACKGROUND
export const ActivosOrigenBackground: React.FC<{
  bgColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F6FBD6", // Default theme background color
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        backgroundColor: bgColor,
        transform: 'translateZ(0)',
        willChange: 'transform',
        minHeight: '100%',
        minWidth: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      } as React.CSSProperties}
    >
      {/* Full page background - covers entire scrollable content */}
      <div
        className="absolute inset-0 w-full min-h-full"
        style={{
          backgroundImage: 'url(/svg/alkimia/tesoros/BgTesoros.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100%',
          zIndex: 0
        }}
      />
    </div>
  );
};

export const BiotiposSection1Background: React.FC<{
  bgColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F6FBD6", // Default theme background color
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        backgroundColor: bgColor,
        transform: 'translateZ(0)',
        willChange: 'transform',
        minHeight: '100%',
        minWidth: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      } as React.CSSProperties}
    >
      {/* Mobile/Tablet - SVG Background (using desktop SVG) */}
      <div
        className="xl:hidden absolute inset-0 w-full overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          zIndex: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          minHeight: '100%'
        }}
      >
        <img
          src="/svg/Biotipos/BiotiposSection1BG.svg"
          alt="Biotipos Section 1 Mobile/Tablet Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            minHeight: '100%',
            minWidth: '100%',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      </div>
      
      {/* Desktop SVG Background - Fixed height based on aspect ratio */}
      <div 
        className="hidden xl:block absolute top-0 left-0 w-full overflow-hidden svg-container-desktop" 
        style={{ 
          maxWidth: '100%',
          width: '100%',
          aspectRatio: '1920 / 1086.13', // Desktop SVG aspect ratio
          height: 'auto',
          minHeight: 'calc(100vw * (1086.13 / 1920))',
          zIndex: 0
        }}
      >
        <img
          src="/svg/Biotipos/BiotiposSection1BG.svg"
          alt="Biotipos Section 1 Desktop Background"
          className="w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            height: '100%',
            width: '100%',
            minWidth: '100%',
            minHeight: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      </div>
    </div>
  );
};

export const BiotiposGeneralBackground: React.FC<{
  bgColor?: string;
  className?: string;
}> = ({ 
  bgColor = "#F6FBD6", // Default theme background color
  className = ""
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        backgroundColor: bgColor,
        transform: 'translateZ(0)',
        willChange: 'transform',
        minHeight: '100%',
        minWidth: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      } as React.CSSProperties}
    >
      {/* Mobile/Tablet - SVG Background (using desktop SVG) */}
      <div
        className="xl:hidden absolute inset-0 w-full overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          zIndex: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          minHeight: '100%'
        }}
      >
        <img
          src="/svg/Biotipos/GnerealBGBiotipoYDoshas.svg"
          alt="Biotipos General Mobile/Tablet Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            minHeight: '100%',
            minWidth: '100%',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      </div>
      
      {/* Desktop SVG Background - Fixed height based on aspect ratio */}
      <div 
        className="hidden xl:block absolute top-0 left-0 w-full overflow-hidden svg-container-desktop" 
        style={{ 
          maxWidth: '100%',
          width: '100%',
          aspectRatio: '1920 / 1078.65', // Desktop SVG aspect ratio
          height: 'auto',
          minHeight: 'calc(100vw * (1078.65 / 1920))',
          zIndex: 0
        }}
      >
        <img
          src="/svg/Biotipos/GnerealBGBiotipoYDoshas.svg"
          alt="Biotipos General Desktop Background"
          className="w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            height: '100%',
            width: '100%',
            minWidth: '100%',
            minHeight: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        />
      </div>
    </div>
  );
};