"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ProductLineTheme = 'default' | 'alma-terra' | 'ecos' | 'jade-ritual' | 'umbral' | 'utopica';

interface LineColors {
  primary: string;
  secondary: string;
  accent: string;
  light: string;
  lightest: string;
}

interface ProductLine {
  value: ProductLineTheme;
  label: string;
  color: string;
  description: string;
  colors: LineColors;
}

interface ThemeContextType {
  currentTheme: ProductLineTheme;
  setCurrentTheme: (theme: ProductLineTheme) => void;
  currentLine: ProductLine;
  productLines: ProductLine[];
  applyGlobalTheme: (theme: ProductLineTheme) => void;
}

const productLines: ProductLine[] = [
  { 
    value: 'default', 
    label: 'Alkimya General', 
    color: '#AE0000', 
    description: 'Alkimyas para alma y cuerpo',
    colors: {
      primary: '#8B5A3C',
      secondary: '#B17A47',
      accent: '#D4A574',
      light: '#F0E6D6',
      lightest: '#F8F4EF'
    }
  },
  { 
    value: 'alma-terra', 
    label: 'Alma Terra', 
    color: '#9B201A', 
    description: 'Conexión con la tierra',
    colors: {
      primary: '#9B201A',
      secondary: '#BD311C',
      accent: '#DF4E21',
      light: '#FFE58D',
      lightest: '#FFEFC6'
    }
  },
  { 
    value: 'ecos', 
    label: 'Ecos', 
    color: '#12406F', 
    description: 'Ritmos naturales',
    colors: {
      primary: '#12406F',
      secondary: '#1B5B8C',
      accent: '#2481C4',
      light: '#A8D4F0',
      lightest: '#E8F4FC'
    }
  },
  { 
    value: 'jade-ritual', 
    label: 'Jade Ritual', 
    color: '#345511', 
    description: 'Ceremonias sagradas',
    colors: {
      primary: '#345511',
      secondary: '#4A7A16',
      accent: '#6BA424',
      light: '#C8E6A0',
      lightest: '#E8F5D8'
    }
  },
  { 
    value: 'umbral', 
    label: 'Umbral', 
    color: '#EA4F12', 
    description: 'Transformación interior',
    colors: {
      primary: '#EA4F12',
      secondary: '#F17E06',
      accent: '#F49200',
      light: '#FFD18A',
      lightest: '#FFF2DB'
    }
  },
  { 
    value: 'utopica', 
    label: 'Utópica', 
    color: '#392E13', 
    description: 'Visión elevada',
    colors: {
      primary: '#392E13',
      secondary: '#72571C',
      accent: '#D2A00C',
      light: '#F8EE76',
      lightest: '#F9F5C5'
    }
  },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ProductLineTheme>('default');
  
  const currentLine = productLines.find(line => line.value === currentTheme) || productLines[0];

  const applyGlobalTheme = (theme: ProductLineTheme) => {
    const line = productLines.find(l => l.value === theme);
    if (!line) return;
    
    const root = document.documentElement;
    const colors = line.colors;
    
    // Set CSS custom properties globally
    root.style.setProperty('--line-primary', colors.primary);
    root.style.setProperty('--line-secondary', colors.secondary);
    root.style.setProperty('--line-accent', colors.accent);
    root.style.setProperty('--line-light', colors.light);
    root.style.setProperty('--line-lightest', colors.lightest);
    
    // Apply theme class to body for global styling
    document.body.classList.remove('theme-default', 'theme-alma-terra', 'theme-ecos', 'theme-jade-ritual', 'theme-umbral', 'theme-utopica');
    document.body.classList.add(`theme-${theme}`);
    
    console.log('🌍 Global theme applied:', theme, colors);
  };

  useEffect(() => {
    applyGlobalTheme(currentTheme);
  }, [currentTheme]);

  const handleSetCurrentTheme = (theme: ProductLineTheme) => {
    setCurrentTheme(theme);
    applyGlobalTheme(theme);
  };

  const value: ThemeContextType = {
    currentTheme,
    setCurrentTheme: handleSetCurrentTheme,
    currentLine,
    productLines,
    applyGlobalTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { productLines }; 