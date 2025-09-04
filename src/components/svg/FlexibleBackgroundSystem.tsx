'use client';

import React from 'react';

// Advanced Background Configuration Types
interface BackgroundConfig {
  id: string;
  type: 'svg' | 'css-gradient' | 'css-clippath' | 'hybrid';
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
    overlay?: string;
  };
  patterns: {
    shape: 'wave' | 'organic' | 'geometric' | 'custom';
    intensity: 'subtle' | 'medium' | 'bold';
    direction: 'top' | 'bottom' | 'left' | 'right' | 'center';
  };
  animations?: {
    enabled: boolean;
    type: 'float' | 'pulse' | 'wave' | 'rotate';
    duration: string;
  };
  responsive?: {
    mobile: Partial<BackgroundConfig>;
    tablet: Partial<BackgroundConfig>;
  };
}

// Flexible Background Generator
export const FlexibleBackground: React.FC<{
  config: BackgroundConfig;
  className?: string;
}> = ({ config, className = "" }) => {
  
  const generateSVGPattern = () => {
    const { colors, patterns } = config;
    
    switch (patterns.shape) {
      case 'wave':
        return (
          <svg viewBox="0 0 1920 1080" className="w-full h-full">
            <defs>
              <linearGradient id={`grad-${config.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.primary} />
                <stop offset="100%" stopColor={colors.secondary || colors.primary} />
              </linearGradient>
              <filter id={`glow-${config.id}`}>
                <feMorphology operator="dilate" radius="2"/>
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              </filter>
            </defs>
            
            {/* Background Fill */}
            <rect width="100%" height="100%" fill={colors.primary} />
            
            {/* Dynamic Wave Patterns */}
            {patterns.intensity === 'subtle' && (
              <path
                d="M0,800 Q480,700 960,750 T1920,800 L1920,1080 L0,1080 Z"
                fill={`url(#grad-${config.id})`}
                opacity="0.6"
              />
            )}
            
            {patterns.intensity === 'medium' && (
              <>
                <path
                  d="M0,600 Q480,500 960,550 T1920,600 L1920,1080 L0,1080 Z"
                  fill={colors.secondary || colors.primary}
                  opacity="0.8"
                />
                <path
                  d="M0,750 Q480,650 960,700 T1920,750 L1920,1080 L0,1080 Z"
                  fill={`url(#grad-${config.id})`}
                  opacity="0.6"
                />
              </>
            )}
            
            {patterns.intensity === 'bold' && (
              <>
                <path
                  d="M0,400 Q480,300 960,350 T1920,400 L1920,1080 L0,1080 Z"
                  fill={colors.secondary || colors.primary}
                />
                <path
                  d="M0,600 Q480,500 960,550 T1920,600 L1920,1080 L0,1080 Z"
                  fill={colors.accent || colors.primary}
                  opacity="0.8"
                />
                <path
                  d="M0,800 Q480,700 960,750 T1920,800 L1920,1080 L0,1080 Z"
                  fill={`url(#grad-${config.id})`}
                  filter={`url(#glow-${config.id})`}
                />
              </>
            )}
          </svg>
        );
        
      case 'organic':
        return (
          <svg viewBox="0 0 1920 1080" className="w-full h-full">
            <defs>
              <radialGradient id={`radial-${config.id}`}>
                <stop offset="0%" stopColor={colors.primary} />
                <stop offset="70%" stopColor={colors.secondary || colors.primary} />
                <stop offset="100%" stopColor={colors.accent || colors.primary} />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill={colors.primary} />
            <ellipse
              cx="960"
              cy="540"
              rx="800"
              ry="400"
              fill={`url(#radial-${config.id})`}
              opacity="0.7"
              transform="rotate(15 960 540)"
            />
            <path
              d="M0,200 Q200,100 400,150 Q600,200 800,120 Q1000,40 1200,100 Q1400,160 1600,80 Q1800,0 1920,50 L1920,1080 L0,1080 Z"
              fill={colors.secondary || colors.primary}
              opacity="0.6"
            />
          </svg>
        );
        
      case 'geometric':
        return (
          <svg viewBox="0 0 1920 1080" className="w-full h-full">
            <defs>
              <pattern id={`pattern-${config.id}`} patternUnits="userSpaceOnUse" width="100" height="100">
                <polygon
                  points="50,0 100,50 50,100 0,50"
                  fill={colors.secondary || colors.primary}
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={colors.primary} />
            <rect width="100%" height="100%" fill={`url(#pattern-${config.id})`} />
          </svg>
        );
        
      default:
        return null;
    }
  };

  const generateCSSGradient = () => {
    const { colors, patterns } = config;
    
    const gradientTypes = {
      'top': `linear-gradient(to bottom, ${colors.primary}, ${colors.secondary || colors.primary})`,
      'bottom': `linear-gradient(to top, ${colors.primary}, ${colors.secondary || colors.primary})`,
      'left': `linear-gradient(to right, ${colors.primary}, ${colors.secondary || colors.primary})`,
      'right': `linear-gradient(to left, ${colors.primary}, ${colors.secondary || colors.primary})`,
      'center': `radial-gradient(circle, ${colors.primary}, ${colors.secondary || colors.primary})`
    };
    
    return gradientTypes[patterns.direction];
  };

  const generateCSS = () => {
    const { colors, patterns, animations } = config;
    
    let clipPath = '';
    switch (patterns.shape) {
      case 'wave':
        clipPath = 'polygon(0 0, 100% 0, 100% 85%, 0 100%)';
        break;
      case 'organic':
        clipPath = 'ellipse(80% 60% at 50% 40%)';
        break;
      case 'geometric':
        clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
        break;
    }
    
    return {
      background: config.type === 'css-gradient' ? generateCSSGradient() : colors.primary,
      clipPath: config.type === 'css-clippath' ? clipPath : undefined,
      animation: animations?.enabled ? `${animations.type} ${animations.duration} infinite` : undefined,
    };
  };

  return (
    <div
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform',
        ...generateCSS()
      }}
    >
      {(config.type === 'svg' || config.type === 'hybrid') && generateSVGPattern()}
      
      {/* Overlay for additional effects */}
      {config.colors.overlay && (
        <div
          className="absolute inset-0"
          style={{
            background: config.colors.overlay,
            mixBlendMode: 'multiply'
          }}
        />
      )}
    </div>
  );
};

// Pre-configured Flexible Backgrounds
export const backgroundPresets: Record<string, BackgroundConfig> = {
  hero: {
    id: 'hero',
    type: 'svg',
    colors: { primary: '#F0EACE', secondary: '#AE0000' },
    patterns: { shape: 'wave', intensity: 'bold', direction: 'bottom' },
    animations: { enabled: true, type: 'float', duration: '6s' }
  },
  services: {
    id: 'services',
    type: 'hybrid',
    colors: { primary: '#AE0000', secondary: '#F0EACE', accent: '#8B0000' },
    patterns: { shape: 'organic', intensity: 'medium', direction: 'center' }
  },
  philosophy: {
    id: 'philosophy',
    type: 'css-gradient',
    colors: { primary: '#AE0000', secondary: '#B91C1C' },
    patterns: { shape: 'wave', intensity: 'subtle', direction: 'top' }
  }
};

// Easy-to-use Background Configurator
export const BackgroundConfigurator: React.FC<{
  sectionId: string;
  customConfig?: Partial<BackgroundConfig>;
}> = ({ sectionId, customConfig }) => {
  const baseConfig = backgroundPresets[sectionId] || backgroundPresets.hero;
  const finalConfig = { ...baseConfig, ...customConfig };
  
  return <FlexibleBackground config={finalConfig} />;
};
