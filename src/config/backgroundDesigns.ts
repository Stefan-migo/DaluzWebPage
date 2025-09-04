// 🎨 VISUAL DESIGN CONFIGURATION
// Modify these settings to instantly change your backgrounds!

export interface DesignTheme {
  name: string;
  description: string;
  sections: {
    [key: string]: {
      type: 'svg-custom' | 'svg-generated' | 'css-modern' | 'hybrid';
      colors: {
        primary: string;
        secondary?: string;
        accent?: string;
        text?: string;
      };
      effects: {
        shape: 'wave' | 'organic' | 'geometric' | 'abstract';
        intensity: 'minimal' | 'moderate' | 'dramatic';
        flow: 'smooth' | 'jagged' | 'curved';
        layers: number;
      };
      animations?: {
        type: 'none' | 'float' | 'pulse' | 'wave' | 'rotate';
        speed: 'slow' | 'medium' | 'fast';
      };
    };
  };
}

// 🎯 DESIGN THEMES - Easy to modify!
export const designThemes: Record<string, DesignTheme> = {
  // Current Design (Enhanced)
  daluz_enhanced: {
    name: "Da Luz Enhanced",
    description: "Your current design with maximum flexibility",
    sections: {
      hero: {
        type: 'hybrid',
        colors: { primary: '#F0EACE', secondary: '#AE0000', accent: '#8B0000' },
        effects: { shape: 'wave', intensity: 'dramatic', flow: 'curved', layers: 3 },
        animations: { type: 'float', speed: 'slow' }
      },
      services: {
        type: 'svg-generated',
        colors: { primary: '#F0EACE', secondary: '#AE0000' },
        effects: { shape: 'organic', intensity: 'moderate', flow: 'smooth', layers: 2 }
      },
      philosophy: {
        type: 'css-modern',
        colors: { primary: '#AE0000', secondary: '#B91C1C' },
        effects: { shape: 'geometric', intensity: 'minimal', flow: 'smooth', layers: 1 }
      },
      alkimya: {
        type: 'hybrid',
        colors: { primary: '#F0EACE', secondary: '#AE0000', accent: '#D4AF37' },
        effects: { shape: 'wave', intensity: 'moderate', flow: 'curved', layers: 2 }
      },
      procesos: {
        type: 'svg-generated',
        colors: { primary: '#ffffff', secondary: '#AE0000' },
        effects: { shape: 'abstract', intensity: 'moderate', flow: 'jagged', layers: 2 }
      },
      sesiones: {
        type: 'svg-custom', // Keep your custom SVG
        colors: { primary: '#F0EACE', secondary: '#AE0000' },
        effects: { shape: 'wave', intensity: 'moderate', flow: 'curved', layers: 1 }
      }
    }
  },

  // Alternative Design Options
  modern_minimal: {
    name: "Modern Minimal",
    description: "Clean, geometric shapes with subtle effects",
    sections: {
      hero: {
        type: 'css-modern',
        colors: { primary: '#F8F9FA', secondary: '#AE0000' },
        effects: { shape: 'geometric', intensity: 'minimal', flow: 'smooth', layers: 1 }
      },
      services: {
        type: 'css-modern',
        colors: { primary: '#AE0000', secondary: '#F0EACE' },
        effects: { shape: 'geometric', intensity: 'minimal', flow: 'smooth', layers: 1 }
      }
      // ... other sections
    }
  },

  organic_nature: {
    name: "Organic Nature",
    description: "Flowing, natural shapes with rich textures",
    sections: {
      hero: {
        type: 'svg-generated',
        colors: { primary: '#2D5016', secondary: '#F0EACE', accent: '#AE0000' },
        effects: { shape: 'organic', intensity: 'dramatic', flow: 'curved', layers: 4 },
        animations: { type: 'wave', speed: 'slow' }
      },
      services: {
        type: 'hybrid',
        colors: { primary: '#F0EACE', secondary: '#2D5016' },
        effects: { shape: 'organic', intensity: 'moderate', flow: 'curved', layers: 3 }
      }
      // ... other sections
    }
  },

  artistic_bold: {
    name: "Artistic Bold",
    description: "Dramatic shapes with strong visual impact",
    sections: {
      hero: {
        type: 'svg-generated',
        colors: { primary: '#000000', secondary: '#AE0000', accent: '#FFD700' },
        effects: { shape: 'abstract', intensity: 'dramatic', flow: 'jagged', layers: 5 },
        animations: { type: 'pulse', speed: 'medium' }
      }
      // ... other sections
    }
  }
};

// 🎨 SHAPE GENERATORS - Create unlimited variations
export const shapePatterns = {
  waves: {
    gentle: "M0,400 Q480,200 960,350 T1920,400 L1920,1080 L0,1080 Z",
    medium: "M0,300 Q240,100 480,250 Q720,400 960,200 Q1200,0 1440,150 Q1680,300 1920,100 L1920,1080 L0,1080 Z",
    dramatic: "M0,600 Q120,200 240,500 Q360,800 480,300 Q600,100 720,600 Q840,900 960,400 Q1080,50 1200,700 Q1320,950 1440,250 Q1560,150 1680,600 Q1800,850 1920,400 L1920,1080 L0,1080 Z"
  },
  organic: {
    blob: "M200,400 Q400,200 600,400 Q800,600 1000,350 Q1200,100 1400,300 Q1600,500 1720,350 L1920,1080 L0,1080 Z",
    flowing: "M0,500 C200,200 400,800 600,400 C800,0 1000,600 1200,300 C1400,100 1600,700 1920,400 L1920,1080 L0,1080 Z"
  },
  geometric: {
    angular: "M0,400 L200,200 L400,500 L600,100 L800,600 L1000,250 L1200,550 L1400,150 L1600,450 L1800,300 L1920,400 L1920,1080 L0,1080 Z",
    stepped: "M0,600 L200,600 L200,300 L400,300 L400,500 L600,500 L600,200 L800,200 L800,400 L1000,400 L1000,100 L1200,100 L1200,350 L1400,350 L1400,250 L1600,250 L1600,450 L1800,450 L1800,300 L1920,300 L1920,1080 L0,1080 Z"
  }
};

// 🌈 COLOR PALETTE VARIATIONS
export const colorPalettes = {
  brand_default: { primary: '#F0EACE', secondary: '#AE0000', accent: '#8B0000' },
  warm_earth: { primary: '#8B4513', secondary: '#F4A460', accent: '#CD853F' },
  cool_ocean: { primary: '#1E90FF', secondary: '#87CEEB', accent: '#4682B4' },
  forest_green: { primary: '#228B22', secondary: '#98FB98', accent: '#32CD32' },
  sunset_gradient: { primary: '#FF6B35', secondary: '#F7931E', accent: '#FFD23F' },
  monochrome: { primary: '#2C3E50', secondary: '#ECF0F1', accent: '#95A5A6' }
};

// 🔧 EASY CONFIGURATION HELPERS
export const createCustomDesign = (
  baseName: keyof typeof designThemes,
  overrides: Partial<DesignTheme>
): DesignTheme => {
  const base = designThemes[baseName];
  return { ...base, ...overrides };
};

export const applyColorPalette = (
  design: DesignTheme,
  palette: keyof typeof colorPalettes
): DesignTheme => {
  const colors = colorPalettes[palette];
  const updatedSections = Object.fromEntries(
    Object.entries(design.sections).map(([key, section]) => [
      key,
      { ...section, colors: { ...section.colors, ...colors } }
    ])
  );
  return { ...design, sections: updatedSections };
};
