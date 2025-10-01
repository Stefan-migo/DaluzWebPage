'use client';

import React from 'react';
import { FlexibleBackground, backgroundPresets } from './FlexibleBackgroundSystem';
import { ProceduralWaveGenerator, MorphingShapeBackground, ParticleBackground } from './AdvancedShapeTools';
import { designThemes, colorPalettes } from '@/config/backgroundDesigns';

// 🎯 EASY-TO-USE FLEXIBLE BACKGROUNDS FOR YOUR SECTIONS

// Replace your current backgrounds with these super-flexible versions
export const FlexibleSobreNosotrosBackground: React.FC<{
  variant?: 'original' | 'enhanced' | 'artistic' | 'minimal';
  customColors?: { primary: string; secondary: string; accent?: string };
  intensity?: 'subtle' | 'medium' | 'bold';
  animation?: boolean;
  className?: string;
}> = ({ 
  variant = 'enhanced',
  customColors,
  intensity = 'medium',
  animation = false,
  className = ""
}) => {
  
  const variants = {
    original: () => (
      // Keep your current SVG but make it themeable
      <div 
        className={`absolute inset-0 w-full h-full ${className}`}
        style={{
          '--bg-color': customColors?.primary || '#F0EACE',
          '--wave-color': customColors?.secondary || '#AE0000'
        } as React.CSSProperties}
      >
        {/* Your existing SVG component */}
      </div>
    ),
    
    enhanced: () => (
      <ProceduralWaveGenerator
        amplitude={intensity === 'subtle' ? 100 : intensity === 'medium' ? 200 : 400}
        frequency={0.003}
        phases={intensity === 'subtle' ? 1 : intensity === 'medium' ? 2 : 4}
        colors={[
          customColors?.primary || '#F0EACE',
          customColors?.secondary || '#AE0000',
          ...(customColors?.accent ? [customColors.accent] : [])
        ]}
        className={className}
      />
    ),
    
    artistic: () => (
      <MorphingShapeBackground
        shapes={[
          'M0,600 Q480,200 960,500 T1920,400 L1920,1080 L0,1080 Z',
          'M0,400 Q480,600 960,300 T1920,500 L1920,1080 L0,1080 Z',
          'M0,500 Q480,100 960,400 T1920,300 L1920,1080 L0,1080 Z'
        ]}
        colors={[
          customColors?.primary || '#F0EACE',
          customColors?.secondary || '#AE0000'
        ]}
        className={className}
      />
    ),
    
    minimal: () => (
      <div 
        className={`absolute inset-0 w-full h-full ${className}`}
        style={{
          background: `linear-gradient(135deg, ${customColors?.primary || '#F8F9FA'}, ${customColors?.secondary || '#AE0000'})`,
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)'
        }}
      />
    )
  };
  
  return variants[variant]();
};

// Flexible Services Background
export const FlexibleServicesBackground: React.FC<{
  style?: 'organic' | 'geometric' | 'particles' | 'waves';
  customColors?: string[];
  className?: string;
}> = ({ 
  style = 'organic',
  customColors = ['#F0EACE', '#AE0000'],
  className = ""
}) => {
  
  const styles = {
    organic: () => (
      <ProceduralWaveGenerator
        amplitude={150}
        frequency={0.004}
        phases={3}
        colors={customColors}
        className={className}
      />
    ),
    
    geometric: () => (
      <div 
        className={`absolute inset-0 w-full h-full ${className}`}
        style={{
          background: `conic-gradient(from 180deg, ${customColors.join(', ')})`,
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
        }}
      />
    ),
    
    particles: () => (
      <ParticleBackground
        particleCount={30}
        colors={customColors}
        shapes={['circle', 'square']}
        animation="float"
        className={className}
      />
    ),
    
    waves: () => (
      <ProceduralWaveGenerator
        amplitude={200}
        frequency={0.002}
        phases={2}
        colors={customColors}
        className={className}
      />
    )
  };
  
  return styles[style]();
};

// 🎨 THEME-BASED BACKGROUND SYSTEM
export const ThemeBasedBackground: React.FC<{
  sectionId: string;
  themeName?: keyof typeof designThemes;
  overrides?: any;
  className?: string;
}> = ({ 
  sectionId,
  themeName = 'daluz_enhanced',
  overrides = {},
  className = ""
}) => {
  const theme = designThemes[themeName];
  const sectionConfig = theme.sections[sectionId];
  
  if (!sectionConfig) return null;
  
  const finalConfig = { ...sectionConfig, ...overrides };
  
  // Generate background based on type and configuration
  switch (finalConfig.type) {
    case 'svg-generated':
      return (
        <ProceduralWaveGenerator
          amplitude={finalConfig.effects.intensity === 'minimal' ? 100 : 
                    finalConfig.effects.intensity === 'moderate' ? 200 : 400}
          phases={finalConfig.effects.layers}
          colors={[finalConfig.colors.primary, finalConfig.colors.secondary || finalConfig.colors.primary]}
          className={className}
        />
      );
      
    case 'css-modern':
      return (
        <div 
          className={`absolute inset-0 w-full h-full ${className}`}
          style={{
            background: `linear-gradient(135deg, ${finalConfig.colors.primary}, ${finalConfig.colors.secondary})`,
            clipPath: finalConfig.effects.shape === 'geometric' ? 
              'polygon(0 0, 100% 0, 100% 85%, 0 100%)' : 'none'
          }}
        />
      );
      
    case 'hybrid':
      return (
        <div className={`absolute inset-0 w-full h-full ${className}`}>
          <ProceduralWaveGenerator
            amplitude={200}
            phases={finalConfig.effects.layers}
            colors={[finalConfig.colors.primary, finalConfig.colors.secondary || finalConfig.colors.primary]}
          />
          <ParticleBackground
            particleCount={20}
            colors={[finalConfig.colors.accent || finalConfig.colors.primary]}
            animation="pulse"
          />
        </div>
      );
      
    default:
      return null;
  }
};
