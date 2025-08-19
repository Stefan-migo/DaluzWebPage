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

// Section Divider
export const WaveDivider: React.FC<{ 
  fromColor?: string; 
  toColor?: string; 
  className?: string;
}> = ({ 
  fromColor = "#F0EACE", 
  toColor = "#ffffff", 
  className = "" 
}) => {
  return (
    <div className={`relative h-20 overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C360,20 720,100 1440,40 L1440,120 L0,120 Z"
          fill={toColor}
        />
        <path
          d="M0,80 C360,40 720,120 1440,60 L1440,120 L0,120 Z"
          fill={fromColor}
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

// Enhanced Service Icons
export const BiologiaLuzIcon: React.FC<SVGProps> = ({ size = 64, className = "" }) => {
  return (
    <div className={`service-icon ${className}`}>
      <img 
        src="/svg/icons/biologia-luz.svg" 
        alt="Biología De Luz" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  );
};

export const SesionesIcon: React.FC<SVGProps> = ({ size = 64, className = "" }) => {
  return (
    <div className={`service-icon ${className}`}>
      <img 
        src="/svg/icons/sesiones.svg" 
        alt="Sesiones" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  );
};

export const CoachingIcon: React.FC<SVGProps> = ({ size = 64, className = "" }) => {
  return (
    <div className={`service-icon ${className}`}>
      <img 
        src="/svg/icons/coaching.svg" 
        alt="Coaching" 
        width={size} 
        height={size}
        className="transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  );
};

// Animated Background Component
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
      {Array.from({length: 15}).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};
