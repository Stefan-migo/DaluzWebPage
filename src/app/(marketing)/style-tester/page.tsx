'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  HeroSection, 
  ProductGrid, 
  ContentSection, 
  ContentHeader, 
  ContentBody, 
  ContentActions, 
  FeatureItem, 
  StatsItem,
  NavigationMenu,
  Breadcrumb,
  daLuzNavigationItems,
  FormContainer,
  FormField,
  ContactForm,
  NewsletterForm
} from '@/components/ui/brand';
import { Search, Heart, ShoppingCart, User, Mail, Phone, Leaf, Sparkles, Star, Award, Users, Zap, Shield, Truck, MessageSquare } from 'lucide-react';

export type ProductLine = 'default' | 'alma-terra' | 'ecos' | 'jade-ritual' | 'umbral' | 'utopica';

export interface StyleTesterState {
  currentTheme: ProductLine;
  selectedComponent: string;
  animationSpeed: number;
  borderRadius: number;
  shadowIntensity: number;
  fontSize: number;
  spacing: number;
}

interface LineColors {
  primary: string;
  secondary: string;
  accent: string;
  light: string;
  lightest: string;
}

const productLines: { value: ProductLine; label: string; color: string; description: string; colors: LineColors }[] = [
  { 
    value: 'default', 
    label: 'General', 
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
    color: '#04412D', 
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

const componentCategories = [
  { id: 'buttons', label: 'Botones', icon: '🔘' },
  { id: 'cards', label: 'Tarjetas', icon: '📄' },
  { id: 'inputs', label: 'Formularios', icon: '📝' },
  { id: 'hero', label: 'Hero Sections', icon: '🖼️' },
  { id: 'product-grid', label: 'Product Grid', icon: '📱' },
  { id: 'content-sections', label: 'Content Sections', icon: '📋' },
  { id: 'navigation', label: 'Navigation', icon: '🧭' },
  { id: 'forms', label: 'Forms', icon: '📝' },
  { id: 'colors', label: 'Colores', icon: '🎨' },
  { id: 'typography', label: 'Tipografía', icon: '📖' },
  { id: 'editor', label: 'Live Editor', icon: '🎛️' },
];

export default function StyleTesterPage() {
  const { currentTheme, setCurrentTheme, currentLine, productLines } = useTheme();
  
  const [state, setState] = useState<StyleTesterState>({
    currentTheme: 'default',
    selectedComponent: 'buttons',
    animationSpeed: 300,
    borderRadius: 8,
    shadowIntensity: 10,
    fontSize: 16,
    spacing: 16,
  });

  // Live Editor State
  const [selectedColorRole, setSelectedColorRole] = useState<'primary' | 'secondary' | 'accent' | 'light' | 'lightest'>('primary');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState<string>('#fe1f02');

  const updateState = (updates: Partial<StyleTesterState>) => {
    setState(prev => ({ ...prev, ...updates }));
    // If theme is being updated, also update global theme
    if (updates.currentTheme) {
      setCurrentTheme(updates.currentTheme);
    }
  };

  const updateTheme = (theme: ProductLine) => {
    console.log('🎨 Global theme update:', theme);
    setCurrentTheme(theme);
    setState(prev => ({ ...prev, currentTheme: theme }));
  };

  // Live Editor Functions
  const updateColorRole = (color: string) => {
    const root = document.documentElement;
    const property = `--line-${selectedColorRole}`;
    
    // Apply the CSS variable with important flag
    root.style.setProperty(property, color, 'important');
    
    // Also update the theme context to maintain consistency
    console.log(`🎨 Updating CSS Variable: ${property} = ${color}`);
    
    // Force style recalculation
    document.body.offsetHeight; // Trigger reflow
    
    // Update all elements that might be using this variable
    const elementsToUpdate = document.querySelectorAll(`[class*="text-line-${selectedColorRole}"], [class*="bg-line-${selectedColorRole}"], [class*="border-line-${selectedColorRole}"]`);
    elementsToUpdate.forEach((element) => {
      (element as HTMLElement).style.setProperty('--color-update-trigger', Math.random().toString());
    });
    
    console.log('📍 After update - CSS Variables:', {
      primary: getComputedStyle(root).getPropertyValue('--line-primary').trim(),
      secondary: getComputedStyle(root).getPropertyValue('--line-secondary').trim(),
      accent: getComputedStyle(root).getPropertyValue('--line-accent').trim(),
      light: getComputedStyle(root).getPropertyValue('--line-light').trim(),
      lightest: getComputedStyle(root).getPropertyValue('--line-lightest').trim()
    });
    
    // Show enhanced visual feedback
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded" style="background-color: ${color}"></div>
        <span>✅ ${selectedColorRole.toUpperCase()} → ${color}</span>
      </div>
    `;
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg z-50 shadow-lg border border-green-400';
    document.body.appendChild(notification);
    
    // Auto-remove notification
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, 2500);
  };

  const resetToOriginalTheme = () => {
    setCurrentTheme(currentTheme); // This will trigger the theme context to reset colors
    console.log('🔄 Reset to original theme');
  };

  // Sync local state with global theme changes
  useEffect(() => {
    setState(prev => ({ ...prev, currentTheme }));
  }, [currentTheme]);

  // Dynamic theme class based on current selection
  const themeClass = `theme-${currentTheme}`;
  console.log('🎯 Current theme:', currentTheme, 'Theme class:', themeClass);

  return (
    <div 
      className={`${themeClass} bg-background min-h-screen transition-all duration-500`}
      data-theme={state.currentTheme}
    >
      {/* Header */}
      <div className="border-b border-line-primary/20 bg-gradient-to-r from-line-lightest/30 to-white p-6 shadow-soft transition-all duration-500">
        <div className="container mx-auto">
          <h1 className="text-4xl font-heading font-bold text-line-primary mb-2 transition-colors duration-500">
            DA LUZ CONSCIENTE
          </h1>
          <p className="text-lg text-line-secondary font-body transition-colors duration-500">
            Sistema de Diseño Avanzado - Colaboración con Cliente
          </p>
          <div className="mt-3">
            <Badge variant="secondary" className="mr-2 bg-line-light/30 text-line-primary border-line-primary/20 transition-all duration-500">
              Fase 1: Foundation ✅
            </Badge>
            <Badge variant="secondary" className="mr-2 bg-line-light/30 text-line-primary border-line-primary/20 transition-all duration-500">
              Fase 2: Core Components ✅
            </Badge>
            <Badge variant="outline" className="bg-line-primary text-white border-line-primary transition-all duration-500">
              {currentLine?.label} - {currentLine?.description}
            </Badge>
            
            {/* DEBUG: Visual theme indicator */}
            <div className="mt-3 p-3 bg-line-lightest/50 border border-line-primary/20 rounded-lg transition-all duration-500">
              <p className="text-sm font-mono text-line-primary">
                <strong>🔍 DEBUG:</strong> Theme: {state.currentTheme} | Class: {themeClass}
              </p>
              <div 
                className="w-8 h-8 rounded-lg mt-2 transition-all duration-500"
                style={{ backgroundColor: 'var(--line-primary)', border: '2px solid var(--line-secondary)' }}
                title="This should show the theme color if CSS is working"
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6 pb-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Enhanced Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Product Lines Section */}
            <Card variant="elegant">
              <CardHeader>
                <CardTitle size="lg" theme="sophisticated">Líneas de Productos</CardTitle>
                <CardDescription>Selecciona una línea para ver su tema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                {productLines.map((line) => (
                  <Button
                    key={line.value}
                      variant={state.currentTheme === line.value ? 'brand' : 'brand-outline'}
                      size="default"
                      theme="sophisticated"
                    className="w-full justify-start"
                    onClick={() => updateState({ currentTheme: line.value })}
                  >
                    <div 
                        className="w-4 h-4 rounded-full mr-3 ring-2 ring-white/50" 
                      style={{ backgroundColor: line.color }}
                    />
                      <div className="text-left">
                        <div className="font-semibold">{line.label}</div>
                        <div className="text-xs opacity-75">{line.description}</div>
                      </div>
                  </Button>
                ))}
              </div>
              </CardContent>
              <CardFooter>
                <div className="w-full p-4 bg-line-lightest rounded-lg border border-line-primary/20">
                  <p className="text-sm font-medium text-line-primary">
                    🎨 Tema Activo
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentLine?.label} - Sistema dinámico funcionando
                  </p>
                </div>
              </CardFooter>
            </Card>

            {/* Component Category Selector */}
            <Card variant="brand-subtle">
              <CardHeader padding="sm">
                <CardTitle size="default">Componentes</CardTitle>
                <CardDescription size="sm">Navega por las categorías</CardDescription>
              </CardHeader>
              <CardContent padding="sm">
                <div className="space-y-2">
                  {componentCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={state.selectedComponent === category.id ? 'line-primary' : 'line-ghost'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => updateState({ selectedComponent: category.id })}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Preview Area */}
          <div className="col-span-9">
            <Card variant="artisanal" className="mb-6">
              <CardHeader>
                <CardTitle size="xl" theme="elegant">
                  Vista Previa Interactiva
                </CardTitle>
                <CardDescription size="lg">
                  Componentes con tema dinámico de {currentLine?.label}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Enhanced Button Showcase */}
            {state.selectedComponent === 'buttons' && (
              <div className="space-y-8">
                <Card variant="line" shimmer>
                  <CardHeader>
                    <CardTitle theme="sophisticated">Variantes de Botones</CardTitle>
                    <CardDescription>Botones con micro-interacciones y tema dinámico</CardDescription>
                  </CardHeader>
                  <CardContent spacing="relaxed">
                    <div className="space-y-6">
                      <div>
                        <h5 className="font-semibold mb-3 text-line-primary">Botones de Línea (Dinámicos)</h5>
                <div className="grid grid-cols-3 gap-4">
                          <Button variant="line-primary" size="lg">PRODUCTOS</Button>
                          <Button variant="line-outline" size="lg">Comprar ahora</Button>
                          <Button variant="line-ghost" size="lg">Más info</Button>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold mb-3 text-line-primary">Variantes Elegantes</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <Button variant="elegant" size="lg" shimmer>Experiencia Premium</Button>
                          <Button variant="brand" size="lg" loading>Procesando...</Button>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold mb-3 text-line-primary">Tamaños y Temas</h5>
                        <div className="flex flex-wrap gap-3 items-center">
                          <Button variant="line-accent" size="xs" theme="modern">XS</Button>
                          <Button variant="line-accent" size="sm" theme="modern">Small</Button>
                          <Button variant="line-accent" size="default" theme="sophisticated">Default</Button>
                          <Button variant="line-accent" size="lg" theme="artisanal">Large</Button>
                          <Button variant="line-accent" size="xl" theme="sophisticated">Extra Large</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Enhanced Card Showcase */}
            {state.selectedComponent === 'cards' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Card variant="line" float>
                    <CardHeader>
                      <CardTitle theme="elegant">Tarjeta Temática</CardTitle>
                      <CardDescription>Con animación flotante</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Esta tarjeta usa el tema dinámico de {currentLine?.label} y tiene efectos de flotación suaves.
                      </p>
                    </CardContent>
                  </Card>

                  <Card variant="elegant" shimmer>
                    <CardHeader>
                      <CardTitle theme="sophisticated">Tarjeta Elegante</CardTitle>
                      <CardDescription>Con efecto shimmer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Diseño sofisticado con gradientes y micro-interacciones premium.
                      </p>
                    </CardContent>
                    <CardFooter justify="end">
                      <Button variant="line-primary" size="sm">Ver más</Button>
                    </CardFooter>
                  </Card>
                </div>

                <Card variant="brand" className="relative overflow-hidden">
                  <CardHeader>
                    <CardTitle theme="elegant" size="lg">Tarjeta de Producto</CardTitle>
                    <CardDescription>Diseño para showcase de productos</CardDescription>
                  </CardHeader>
                  <CardContent spacing="loose">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-line-primary rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-lg">Crema Facial Regenerativa</h4>
                        <p className="text-muted-foreground">Con extractos botánicos de {currentLine?.label}</p>
                        <p className="text-2xl font-bold text-line-primary mt-2">$24.990</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter justify="between">
                    <Button variant="line-ghost" size="sm">
                      <Heart className="w-4 h-4 mr-2" />
                      Favorito
                    </Button>
                    <Button variant="line-primary">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Agregar al carrito
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {/* Enhanced Input Showcase */}
            {state.selectedComponent === 'inputs' && (
              <div className="space-y-6">
                <Card variant="line-subtle">
                  <CardHeader>
                    <CardTitle theme="sophisticated">Formularios Temáticos</CardTitle>
                    <CardDescription>Inputs con estados dinámicos y tema de línea</CardDescription>
                  </CardHeader>
                  <CardContent spacing="relaxed">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Input
                          variant="line"
                          label="Email"
                          placeholder="tu@email.com"
                          leftIcon={<Mail className="w-4 h-4" />}
                          helper="Te contactaremos para coordinar la entrega"
                        />
                        <Input
                          variant="line"
                          label="Teléfono"
                          placeholder="+54 9 11 1234-5678"
                          leftIcon={<Phone className="w-4 h-4" />}
                          inputSize="lg"
                        />
                        <Input
                          variant="brand"
                          label="Búsqueda de productos"
                          placeholder="Buscar en nuestra colección..."
                          leftIcon={<Search className="w-4 h-4" />}
                          loading
                        />
                      </div>
              <div className="space-y-4">
                        <Input
                          variant="elegant"
                          label="Nombre completo"
                          placeholder="Tu nombre"
                          success="Perfecto! Este nombre está disponible"
                          inputSize="lg"
                        />
                        <Input
                          variant="line-accent"
                          label="Código de descuento"
                          placeholder="DESCUENTO2024"
                          error="Código no válido o expirado"
                        />
                        <Input
                          variant="line-subtle"
                          label="Comentarios adicionales"
                          placeholder="Cuéntanos más sobre tus preferencias..."
                          helper="Información opcional para personalizar tu experiencia"
                          inputSize="xl"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Enhanced Color Palette */}
            {state.selectedComponent === 'colors' && (
              <div className="space-y-6">
                <Card variant="glass" className="backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle theme="sophisticated">Paleta de Colores Dinámica</CardTitle>
                    <CardDescription>Sistema de colores con tema de {currentLine?.label}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Current Line Colors */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-semibold" style={{ color: 'var(--line-primary)' }}>Colores de {currentLine?.label}</h5>
                          <Badge 
                            className="border"
                            style={{ 
                              backgroundColor: 'color-mix(in srgb, var(--line-primary) 10%, transparent)',
                              color: 'var(--line-primary)',
                              borderColor: 'color-mix(in srgb, var(--line-primary) 20%, transparent)'
                            }}
                          >
                            Tema Activo
                          </Badge>
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                          <div className="text-center group">
                            <div 
                              className="w-full h-20 rounded-lg mb-2 shadow-line transition-transform duration-300 group-hover:scale-105 relative overflow-hidden"
                              style={{ backgroundColor: 'var(--line-primary)' }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <span className="text-xs font-medium" style={{ color: 'var(--line-primary)' }}>Primary</span>
                            <div className="text-xs text-muted-foreground mt-1">
                              {currentTheme === 'alma-terra' && '#9B201A'}
                              {currentTheme === 'ecos' && '#12406F'}
                              {currentTheme === 'jade-ritual' && '#04412D'}
                              {currentTheme === 'umbral' && '#EA4F12'}
                              {currentTheme === 'utopica' && '#392E13'}
                              {currentTheme === 'default' && '#AE0000'}
                            </div>
                          </div>
                          <div className="text-center group">
                            <div 
                              className="w-full h-20 rounded-lg mb-2 transition-transform duration-300 group-hover:scale-105 relative overflow-hidden"
                              style={{ backgroundColor: 'var(--line-secondary)' }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <span className="text-xs font-medium" style={{ color: 'var(--line-primary)' }}>Secondary</span>
                            <div className="text-xs text-muted-foreground mt-1">
                              {currentTheme === 'alma-terra' && '#BD311C'}
                              {currentTheme === 'ecos' && '#005180'}
                              {currentTheme === 'jade-ritual' && '#286939'}
                              {currentTheme === 'umbral' && '#F17E06'}
                              {currentTheme === 'utopica' && '#72571C'}
                              {currentTheme === 'default' && '#C70000'}
                            </div>
                          </div>
                          <div className="text-center group">
                            <div 
                              className="w-full h-20 rounded-lg mb-2 transition-transform duration-300 group-hover:scale-105 relative overflow-hidden"
                              style={{ backgroundColor: 'var(--line-accent)' }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <span className="text-xs font-medium" style={{ color: 'var(--line-primary)' }}>Accent</span>
                            <div className="text-xs text-muted-foreground mt-1">
                              {currentTheme === 'alma-terra' && '#DF4E21'}
                              {currentTheme === 'ecos' && '#0084AC'}
                              {currentTheme === 'jade-ritual' && '#0C9E5D'}
                              {currentTheme === 'umbral' && '#F49200'}
                              {currentTheme === 'utopica' && '#D2A00C'}
                              {currentTheme === 'default' && '#DB3600'}
                            </div>
                          </div>
                          <div className="text-center group">
                            <div 
                              className="w-full h-20 rounded-lg mb-2 transition-transform duration-300 group-hover:scale-105 relative overflow-hidden"
                              style={{ backgroundColor: 'var(--line-light)' }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <span className="text-xs font-medium" style={{ color: 'var(--line-primary)' }}>Light</span>
                            <div className="text-xs text-muted-foreground mt-1">
                              {currentTheme === 'alma-terra' && '#FFE58D'}
                              {currentTheme === 'ecos' && '#81CCD7'}
                              {currentTheme === 'jade-ritual' && '#7BC38E'}
                              {currentTheme === 'umbral' && '#FFD18A'}
                              {currentTheme === 'utopica' && '#F8EE76'}
                              {currentTheme === 'default' && '#F8D794'}
                            </div>
                          </div>
                          <div className="text-center group">
                            <div 
                              className="w-full h-20 rounded-lg mb-2 transition-transform duration-300 group-hover:scale-105 relative overflow-hidden"
                              style={{ backgroundColor: 'var(--line-lightest)' }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <span className="text-xs font-medium" style={{ color: 'var(--line-primary)' }}>Lightest</span>
                            <div className="text-xs text-muted-foreground mt-1">
                              {currentTheme === 'alma-terra' && '#FFEFC6'}
                              {currentTheme === 'ecos' && '#B7DFE5'}
                              {currentTheme === 'jade-ritual' && '#D3E1BE'}
                              {currentTheme === 'umbral' && '#FFF2DB'}
                              {currentTheme === 'utopica' && '#F9F5C5'}
                              {currentTheme === 'default' && '#FFF4B3'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Gradientes Temáticos */}
                      <div>
                        <h5 className="font-semibold mb-4" style={{ color: 'var(--line-primary)' }}>Gradientes Temáticos</h5>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="relative group">
                            <div 
                              className="h-16 rounded-lg shadow-line transition-transform duration-300 group-hover:scale-105"
                              style={{ background: 'linear-gradient(135deg, var(--line-primary) 0%, var(--line-secondary) 100%)' }}
                            ></div>
                            <span className="text-xs font-medium text-center block mt-2">Gradiente Principal</span>
                          </div>
                          <div className="relative group">
                            <div className="h-16 bg-alkimya-gradient rounded-lg shadow-alkimya transition-transform duration-300 group-hover:scale-105"></div>
                            <span className="text-xs font-medium text-center block mt-2">Gradiente Alkimya</span>
                          </div>
                          <div className="relative group">
                            <div 
                              className="h-16 rounded-lg transition-transform duration-300 group-hover:scale-105"
                              style={{ background: 'linear-gradient(to right, var(--line-primary), var(--line-accent))' }}
                            ></div>
                            <span className="text-xs font-medium text-center block mt-2">Gradiente Accent</span>
                          </div>
                        </div>
                      </div>

                      {/* Color Usage Examples */}
                      <div>
                        <h5 className="font-semibold mb-4" style={{ color: 'var(--line-primary)' }}>Ejemplos de Uso</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div 
                            className="p-4 rounded-lg"
                            style={{ 
                              backgroundColor: 'color-mix(in srgb, var(--line-primary) 10%, transparent)',
                              borderColor: 'color-mix(in srgb, var(--line-primary) 20%, transparent)',
                              border: '1px solid'
                            }}
                          >
                            <h6 className="font-semibold mb-2" style={{ color: 'var(--line-primary)' }}>Elementos Primarios</h6>
                            <p className="text-sm text-muted-foreground">Botones principales, enlaces importantes, iconos destacados</p>
                          </div>
                          <div 
                            className="p-4 rounded-lg"
                            style={{ 
                              backgroundColor: 'color-mix(in srgb, var(--line-accent) 10%, transparent)',
                              borderColor: 'color-mix(in srgb, var(--line-accent) 20%, transparent)',
                              border: '1px solid'
                            }}
                          >
                            <h6 className="font-semibold mb-2" style={{ color: 'var(--line-accent)' }}>Elementos de Acento</h6>
                            <p className="text-sm text-muted-foreground">Badges, notificaciones, elementos decorativos</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comparison Grid */}
                <Card variant="line-subtle">
                  <CardHeader>
                    <CardTitle size="default">Comparación de Todas las Líneas</CardTitle>
                    <CardDescription>Vista rápida de todos los temas disponibles</CardDescription>
                  </CardHeader>
                  <CardContent>
                <div className="grid grid-cols-6 gap-2">
                      {productLines.map((line) => (
                        <div key={line.value} className="text-center group cursor-pointer" onClick={() => updateState({ currentTheme: line.value })}>
                          <div 
                            className={`w-full h-12 rounded-lg mb-2 transition-all duration-300 group-hover:scale-110 ${
                              state.currentTheme === line.value ? 'ring-2 ring-offset-2 ring-current' : ''
                            }`}
                            style={{ backgroundColor: line.color }}
                          ></div>
                          <span className="text-xs font-medium block">{line.label}</span>
                          {state.currentTheme === line.value && (
                            <Badge className="mt-1 text-xs">Activo</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Typography Showcase */}
            {state.selectedComponent === 'typography' && (
              <Card variant="brand-subtle">
                <CardHeader>
                  <CardTitle theme="elegant">Sistema Tipográfico</CardTitle>
                  <CardDescription>Jerarquía elegante con fuentes premium</CardDescription>
                </CardHeader>
                <CardContent spacing="loose">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h1 className="text-heading text-line-primary">Heading 1 - Playfair Display</h1>
                      <h2 className="text-heading text-line-primary">Heading 2 - Línea {currentLine?.label}</h2>
                      <h3 className="text-heading text-line-primary">Heading 3 - Título de sección</h3>
                      <h4 className="text-heading text-line-primary">Heading 4 - Subtítulo</h4>
                    </div>
                    <div className="space-y-2">
                      <p className="text-body text-base leading-relaxed">
                        Párrafo con tipografía Inter - Esta es la fuente principal para contenido de cuerpo, 
                        diseñada para ser legible y moderna, perfecta para la comunicación de DA LUZ CONSCIENTE.
                      </p>
                      <p className="text-body text-sm text-muted-foreground leading-loose">
                        Texto secundario con espaciado generoso para una lectura cómoda y sofisticada.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hero Section Showcase */}
            {state.selectedComponent === 'hero' && (
              <div className="space-y-8">
                <Card variant="line" shimmer>
                  <CardHeader>
                    <CardTitle theme="sophisticated">Hero Sections</CardTitle>
                    <CardDescription>Secciones hero con overlays dinámicos y tema de línea</CardDescription>
                  </CardHeader>
                </Card>

                <div className="space-y-6">
                  {/* Default Hero */}
                  <Card>
                    <CardHeader>
                      <CardTitle size="sm">Hero Elegante - {currentLine?.label}</CardTitle>
                    </CardHeader>
                    <CardContent padding="none">
                      <div className="rounded-lg overflow-hidden">
                        <HeroSection
                          title="Alkimyas para alma y cuerpo"
                          subtitle={currentLine?.description}
                          description="Descubre nuestras líneas biocosmética consciente, creadas con ingredientes naturales y procesos artesanales que honran la conexión entre tu ser y la naturaleza."
                          backgroundImage="/images/blog-placeholder.jpg"
                          lineTheme={state.currentTheme}
                          variant="elegant"
                          height="md"
                          badges={[
                            { text: "Natural", icon: <Leaf className="h-3 w-3" />, variant: "natural" },
                            { text: "Artesanal", icon: <Sparkles className="h-3 w-3" />, variant: "premium" }
                          ]}
                          primaryAction={{
                            text: "Explorar Productos",
                            href: "/productos"
                          }}
                          secondaryAction={{
                            text: "Conocer Más",
                            href: "/blog"
                          }}
                          showScrollIndicator={true}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Minimal Hero */}
                  <Card>
                    <CardHeader>
                      <CardTitle size="sm">Hero Artesanal - Centrado</CardTitle>
                    </CardHeader>
                    <CardContent padding="none">
                      <div className="rounded-lg overflow-hidden">
                        <HeroSection
                          title={`Línea ${currentLine?.label}`}
                          description={`${currentLine?.description}. Una colección única que refleja la esencia y filosofía de nuestra marca.`}
                          backgroundImage="/images/blog-placeholder.jpg"
                          lineTheme={state.currentTheme}
                          variant="artisanal"
                          textPosition="center"
                          height="sm"
                          overlayOpacity={0.7}
                          primaryAction={{
                            text: "Ver Colección",
                            href: `/categorias/${state.currentTheme}`
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Product Grid Showcase */}
            {state.selectedComponent === 'product-grid' && (
              <div className="space-y-8">
                <Card variant="line" shimmer>
                  <CardHeader>
                    <CardTitle theme="sophisticated">Product Grid</CardTitle>
                    <CardDescription>Grid responsivo con ProductCards mejorados y tema dinámico</CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle size="sm">Grid Completo - Línea {currentLine?.label}</CardTitle>
                    <CardDescription>Sistema completo con filtros, búsqueda y ordenamiento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProductGrid
                      title={`Productos ${currentLine?.label}`}
                      subtitle={currentLine?.description}
                      variant="elegant"
                      lineTheme={state.currentTheme}
                      initialGridCols={3}
                      products={[
                        {
                          id: "1",
                          name: `Serum Facial ${currentLine?.label}`,
                          description: "Serum regenerador con ingredientes naturales y orgánicos para una piel radiante.",
                          price: 2800,
                          originalPrice: 3500,
                          category: currentLine?.label || "General",
                          imageUrl: "/images/blog-placeholder.jpg",
                          rating: 4.8,
                          reviewCount: 124,
                          isNatural: true,
                          isNew: true,
                          isOnSale: true,
                          stock: 15,
                          size: "30ml",
                          lineTheme: state.currentTheme
                        },
                        {
                          id: "2",
                          name: `Crema Corporal ${currentLine?.label}`,
                          description: "Hidratación profunda con manteca de karité y aceites esenciales.",
                          price: 1900,
                          category: currentLine?.label || "General",
                          imageUrl: "/images/blog-placeholder.jpg",
                          rating: 4.6,
                          reviewCount: 89,
                          isNatural: true,
                          isNew: false,
                          isOnSale: false,
                          stock: 28,
                          size: "200ml",
                          lineTheme: state.currentTheme
                        },
                        {
                          id: "3",
                          name: `Aceite Esencial ${currentLine?.label}`,
                          description: "Aceite puro extraído de plantas aromáticas seleccionadas.",
                          price: 3200,
                          category: currentLine?.label || "General",
                          imageUrl: "/images/blog-placeholder.jpg",
                          rating: 4.9,
                          reviewCount: 156,
                          isNatural: true,
                          isNew: false,
                          isOnSale: false,
                          stock: 8,
                          size: "15ml",
                          lineTheme: state.currentTheme
                        },
                        {
                          id: "4",
                          name: `Mascarilla Facial ${currentLine?.label}`,
                          description: "Tratamiento intensivo con arcillas minerales y extractos botánicos.",
                          price: 2100,
                          originalPrice: 2500,
                          category: currentLine?.label || "General",
                          imageUrl: "/images/blog-placeholder.jpg",
                          rating: 4.7,
                          reviewCount: 93,
                          isNatural: true,
                          isNew: false,
                          isOnSale: true,
                          stock: 3,
                          size: "100g",
                          lineTheme: state.currentTheme
                        }
                      ]}
                      onAddToCart={(productId, quantity) => {
                        console.log(`Added ${quantity} of product ${productId} to cart`);
                      }}
                      onToggleFavorite={(productId) => {
                        console.log(`Toggled favorite for product ${productId}`);
                      }}
                      favoriteProducts={["2", "4"]}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Content Sections */}
            {state.selectedComponent === 'content-sections' && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Content Sections - Flexible Content Blocks</h3>
                  
                  {/* Basic Content Section */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-line-primary">Basic Content Section</h4>
                    <ContentSection variant="default" background="white" textAlign="center">
                      <ContentHeader 
                        badge={{ text: "Nueva Línea", variant: "secondary" }}
                        subtitle="Innovación Natural"
                        title="Alkimyas para Alma y Cuerpo"
                        description="Descubre nuestra nueva colección de productos biocosmética artesanal, cuidadosamente seleccionados para nutrir tu piel y elevar tu espíritu."
                      />
                      <ContentBody columns={3}>
                        <FeatureItem
                          icon={<Leaf className="w-6 h-6" />}
                          title="100% Natural"
                          description="Ingredientes orgánicos seleccionados con amor y consciencia."
                        />
                        <FeatureItem
                          icon={<Star className="w-6 h-6" />}
                          title="Artesanal"
                          description="Elaborados en pequeños lotes por artesanos especializados."
                        />
                        <FeatureItem
                          icon={<Shield className="w-6 h-6" />}
                          title="Cruelty Free"
                          description="Nunca testado en animales, respetuoso con todos los seres."
                        />
                      </ContentBody>
                      <ContentActions
                        primaryAction={{
                          text: "Explorar Productos",
                          href: "/productos",
                          variant: "line-primary"
                        }}
                        secondaryAction={{
                          text: "Nuestra Historia",
                          href: "/sobre-nosotros",
                          variant: "line-outline"
                        }}
                      />
                    </ContentSection>
                  </div>

                  {/* Stats Section */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-line-primary">Stats Section</h4>
                    <ContentSection variant="compact" background="cream" textAlign="center">
                      <ContentHeader title="Números que Nos Inspiran" />
                      <ContentBody columns={3}>
                        <StatsItem
                          value="500+"
                          label="Clientes Felices"
                          description="Transformaciones auténticas"
                        />
                        <StatsItem
                          value="7"
                          label="Años de Experiencia"
                          description="En biocosmética consciente"
                        />
                        <StatsItem
                          value="100%"
                          label="Ingredientes Naturales"
                          description="Pureza en cada fórmula"
                        />
                      </ContentBody>
                    </ContentSection>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Components */}
            {state.selectedComponent === 'navigation' && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Navigation Components</h3>
                  
                  {/* Enhanced Navigation Menu */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-line-primary">Enhanced Navigation with Mega Menu</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <NavigationMenu
                        items={daLuzNavigationItems}
                        variant="line"
                        size="normal"
                        logo={
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-8 h-8 text-line-primary" />
                            <div>
                              <div className="font-bold text-lg">DA LUZ</div>
                              <div className="text-xs text-muted-foreground">CONSCIENTE</div>
                            </div>
                          </div>
                        }
                        actions={
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <User className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ShoppingCart className="w-4 h-4" />
                            </Button>
                            <Button variant="line-primary" size="sm">
                              Membresía
                            </Button>
                          </div>
                        }
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Hover over "Productos" to see the mega menu with line-themed categories
                    </p>
                  </div>

                  {/* Breadcrumb Navigation */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-line-primary">Breadcrumb Navigation</h4>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Breadcrumb
                        items={[
                          { label: "Productos", href: "/productos" },
                          { label: "Línea Alma Terra", href: "/productos/alma-terra" },
                          { label: "Cremas Faciales" }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Form Components */}
            {state.selectedComponent === 'forms' && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Enhanced Form Components</h3>
                  
                  {/* Contact Form */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-line-primary">Contact Form with Validation</h4>
                    <div className="max-w-4xl mx-auto">
                      <ContactForm
                        onSubmit={(data) => {
                          console.log('Form submitted:', data);
                        }}
                      />
                    </div>
                  </div>

                  {/* Newsletter Form */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-line-primary">Newsletter Signup</h4>
                    <div className="max-w-md mx-auto">
                      <NewsletterForm />
                    </div>
                  </div>

                  {/* Individual Form Fields */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-line-primary">Individual Form Fields</h4>
                    <FormContainer variant="card" title="Form Field Examples">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            label="Campo con Error"
                            name="error-field"
                            type="text"
                            placeholder="Campo con validación"
                            error="Este campo contiene errores"
                          />
                          
                          <FormField
                            label="Campo Exitoso"
                            name="success-field"
                            type="text"
                            placeholder="Campo validado"
                            success="Campo válido"
                          />
                        </div>

                        <FormField
                          label="Email con Helper"
                          name="email-helper"
                          type="email"
                          placeholder="tu@email.com"
                          helper="Te enviaremos actualizaciones de productos exclusivos"
                          icon={<Mail className="w-4 h-4" />}
                        />

                        <FormField
                          label="Selección de Línea"
                          name="product-line"
                          type="select"
                          placeholder="Selecciona tu línea favorita"
                          options={[
                            { value: 'alma-terra', label: 'Alma Terra' },
                            { value: 'ecos', label: 'Ecos' },
                            { value: 'jade-ritual', label: 'Jade Ritual' },
                            { value: 'umbral', label: 'Umbral' },
                            { value: 'utopica', label: 'Utópica' }
                          ]}
                        />

                        <FormField
                          label="Mensaje Personalizado"
                          name="custom-message"
                          type="textarea"
                          placeholder="Cuéntanos sobre tu experiencia con nuestros productos..."
                          rows={4}
                          icon={<MessageSquare className="w-4 h-4" />}
                        />
                      </div>
                    </FormContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Live Style Editor */}
            {state.selectedComponent === 'editor' && (
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">🎛️ Live Style Editor</h3>
                  <p className="text-muted-foreground">
                    Herramientas avanzadas para personalizar elementos y construir paletas de colores en tiempo real.
                  </p>
                  
                  {/* Functional Color Editor */}
                  <Card variant="elegant" className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">🎨</span>
                        Editor de Colores en Vivo
                      </CardTitle>
                      <CardDescription>
                        Selecciona un rol de color y luego haz clic en cualquier color de la paleta para aplicarlo
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Color Role Selector */}
                      <div>
                        <h4 className="font-semibold mb-3 text-line-primary">1️⃣ Selecciona el Rol de Color a Modificar</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {[
                            { role: 'primary', label: 'Primary' },
                            { role: 'secondary', label: 'Secondary' },
                            { role: 'accent', label: 'Accent' },
                            { role: 'light', label: 'Light' },
                            { role: 'lightest', label: 'Lightest' }
                          ].map((colorRole) => {
                            const currentColor = getComputedStyle(document.documentElement).getPropertyValue(`--line-${colorRole.role}`) || '#cccccc';
                            return (
                              <button
                                key={colorRole.role}
                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                  selectedColorRole === colorRole.role 
                                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedColorRole(colorRole.role as any)}
                              >
                                <div 
                                  className="w-full h-10 rounded-lg mb-2 border border-gray-200 transition-all duration-300" 
                                  style={{ backgroundColor: `var(--line-${colorRole.role})` }}
                                ></div>
                                <div className="text-sm font-medium">{colorRole.label}</div>
                                <div className="text-xs text-gray-500 font-mono">
                                  {currentColor.trim() || 'var(--line-' + colorRole.role + ')'}
                                </div>
                                {selectedColorRole === colorRole.role && (
                                  <div className="text-xs text-blue-600 mt-1 font-semibold">✓ Seleccionado</div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Current Selection Info */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm">
                          <strong>🎯 Rol Seleccionado:</strong> <span className="text-blue-700">{selectedColorRole.toUpperCase()}</span>
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Haz clic en cualquier color de abajo para cambiar este rol de color en toda la aplicación.
                        </p>
                      </div>

                      {/* Advanced Color Picker */}
                      <div>
                        <h4 className="font-semibold mb-3 text-line-primary">2️⃣ Selector de Color Avanzado</h4>
                        {/* Modern Color Picker Interface */}
                        <div className="space-y-4">
                          {/* Main Color Picker */}
                          <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
                            <label className="block text-sm font-medium mb-3 text-gray-700">
                              🎨 Selector de Color Personalizado
                            </label>
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <input
                                  type="color"
                                  value={customColor}
                                  onChange={(e) => {
                                    setCustomColor(e.target.value);
                                    updateColorRole(e.target.value);
                                  }}
                                  className="w-20 h-20 rounded-xl border-2 border-gray-300 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                                  title="Haz clic para abrir el selector de color"
                                />
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">🎨</span>
                                </div>
                              </div>
                              <div className="flex-1 space-y-2">
                                <input
                                  type="text"
                                  value={customColor}
                                  onChange={(e) => {
                                    setCustomColor(e.target.value);
                                    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                                      updateColorRole(e.target.value);
                                    }
                                  }}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="#fe1f02"
                                />
                                <p className="text-xs text-gray-500">
                                  Escribe un código hex o usa el selector visual arriba
                                </p>
                              </div>
                              <Button
                                size="lg"
                                onClick={() => updateColorRole(customColor)}
                                className="bg-line-primary hover:bg-line-primary/80 px-6"
                              >
                                Aplicar Color
                              </Button>
                            </div>
                          </div>

                          {/* Quick Preset Colors */}
                          <div className="p-6 border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
                            <label className="block text-sm font-medium mb-4 text-gray-700">
                              ⚡ Colores Populares (Click Rápido)
                            </label>
                            <div className="grid grid-cols-10 gap-3">
                              {[
                                // DA LUZ brand colors from paleta general
                                '#fe1f02', '#ea1802', '#d11f02', '#c70000', '#920000',
                                '#f8d794', '#ffe993', '#ebca7c', '#f0eace', '#f6fbd6',
                                // Modern colors
                                '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
                                '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#84cc16',
                                // Professional colors
                                '#1f2937', '#374151', '#6b7280', '#9ca3af', '#d1d5db',
                                '#f3f4f6', '#ffffff', '#000000', '#7c3aed', '#059669'
                              ].map((color) => (
                                <button
                                  key={color}
                                  className="w-12 h-12 rounded-xl border-2 border-white shadow-md hover:scale-110 hover:shadow-xl transition-all duration-200 relative group"
                                  style={{ backgroundColor: color }}
                                  onClick={() => {
                                    setCustomColor(color);
                                    updateColorRole(color);
                                  }}
                                  title={color}
                                >
                                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 bg-black text-white px-2 py-1 rounded transition-opacity whitespace-nowrap z-10 font-mono">
                                    {color}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={resetToOriginalTheme}
                          className="flex-1"
                        >
                          🔄 Resetear a Tema Original
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => {
                            const colors = currentLine.colors;
                            navigator.clipboard.writeText(JSON.stringify(colors, null, 2));
                            console.log('🎨 Theme copied to clipboard');
                          }}
                          className="flex-1"
                        >
                          📋 Copiar Tema Actual
                        </Button>
                      </div>

                      {/* Real-time Debug Panel */}
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                        <h5 className="font-semibold text-purple-800 mb-3">🔍 Panel de Debug en Tiempo Real</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-purple-700 mb-2">Variables CSS Actuales:</p>
                            <div className="space-y-1 text-xs font-mono">
                              {['primary', 'secondary', 'accent', 'light', 'lightest'].map((role) => {
                                const color = typeof window !== 'undefined' 
                                  ? getComputedStyle(document.documentElement).getPropertyValue(`--line-${role}`).trim() 
                                  : '#cccccc';
                                return (
                                  <div key={role} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded border" style={{ backgroundColor: `var(--line-${role})` }}></div>
                                    <span className="text-purple-600">--line-{role}:</span>
                                    <span className="text-purple-800">{color || 'no definido'}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-purple-700 mb-2">Estado del Editor:</p>
                            <div className="space-y-1 text-xs">
                              <div>🎯 <strong>Rol Seleccionado:</strong> {selectedColorRole}</div>
                              <div>🎨 <strong>Color Personalizado:</strong> {customColor}</div>
                              <div>📱 <strong>Tema Actual:</strong> {currentTheme}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Usage Instructions */}
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-2">💡 Cómo usar el editor:</h5>
                        <ol className="text-sm text-green-700 space-y-1">
                          <li><strong>1.</strong> Selecciona un rol de color (Primary, Secondary, etc.)</li>
                          <li><strong>2.</strong> Usa el selector de color o haz clic en los colores populares</li>
                          <li><strong>3.</strong> Ve los cambios instantáneamente en toda la aplicación</li>
                          <li><strong>4.</strong> Revisa el panel de debug para verificar que los cambios se aplicaron</li>
                          <li><strong>5.</strong> Usa "Resetear" para volver al tema original</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Element Selector */}
                  <Card variant="line" className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">🎯</span>
                        Selector de Elementos
                      </CardTitle>
                      <CardDescription>
                        Selecciona elementos específicos para editar sus estilos
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { id: 'navbar', label: 'Navigation Bar', icon: '🧭' },
                          { id: 'footer', label: 'Footer', icon: '📍' },
                          { id: 'buttons', label: 'Buttons', icon: '🔘' },
                          { id: 'cards', label: 'Cards', icon: '📄' },
                          { id: 'text', label: 'Typography', icon: '📝' },
                          { id: 'background', label: 'Background', icon: '🎨' },
                          { id: 'borders', label: 'Borders', icon: '⬜' },
                          { id: 'shadows', label: 'Shadows', icon: '🌫️' }
                        ].map((element) => (
                          <Button
                            key={element.id}
                            variant="outline"
                            size="sm"
                            className="h-auto p-3 flex-col gap-1 hover:bg-line-lightest hover:border-line-primary"
                          >
                            <span className="text-lg">{element.icon}</span>
                            <span className="text-xs">{element.label}</span>
                          </Button>
                        ))}
                      </div>
                      
                      <div className="mt-6 p-4 bg-line-lightest/30 rounded-lg border border-line-primary/20">
                        <p className="text-sm text-muted-foreground">
                          💡 <strong>Próximamente:</strong> Haz clic en cualquier elemento para editarlo en tiempo real. 
                          Funciones avanzadas como selección de elementos, editor de CSS en vivo, y exportación de temas.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Typography Controls */}
                  <Card variant="brand-subtle" className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">🔤</span>
                        Controles de Tipografía
                      </CardTitle>
                      <CardDescription>
                        Ajusta fuentes, tamaños y espaciado
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Font Family</label>
                          <select className="w-full p-2 border border-line-primary/20 rounded-lg bg-white">
                            <option value="inter">Inter (Current Body)</option>
                            <option value="playfair">Playfair Display (Current Heading)</option>
                            <option value="montserrat">Montserrat</option>
                            <option value="open-sans">Open Sans</option>
                            <option value="merriweather">Merriweather</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Font Size</label>
                          <input 
                            type="range" 
                            min="12" 
                            max="24" 
                            defaultValue="16"
                            className="w-full h-2 bg-line-lightest rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>12px</span>
                            <span>24px</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg border border-line-primary/20">
                        <h4 className="font-heading text-xl mb-2">Preview Text</h4>
                        <p className="font-body text-muted-foreground">
                          Este es un ejemplo de cómo se verá la tipografía con los ajustes actuales. 
                          DA LUZ CONSCIENTE - Alkimyas para alma y cuerpo.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Export/Import Section */}
                  <Card variant="artisanal" className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">📤</span>
                        Exportar / Importar Temas
                      </CardTitle>
                      <CardDescription>
                        Guarda y comparte configuraciones de temas personalizados
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-3">
                        <Button variant="line-primary" size="sm" className="flex-1">
                          📥 Exportar Tema Actual
                        </Button>
                        <Button variant="line-outline" size="sm" className="flex-1">
                          📤 Importar Tema
                        </Button>
                      </div>
                      
                      <div className="text-sm text-muted-foreground bg-line-lightest/20 p-3 rounded-lg">
                        <strong>Tema Actual:</strong> {currentLine.label} <br />
                        <strong>Colores:</strong> Primary {currentLine.colors.primary}, Secondary {currentLine.colors.secondary}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Status Card */}
            <Card variant="interactive" className="mt-8 bg-gradient-to-r from-line-lightest/30 to-white border-line-primary/20 transition-all duration-500">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-line-primary transition-colors duration-500">
                      ✅ Sistema de Diseño + Editor Avanzado Funcionando
                    </p>
                    <p className="text-sm text-line-secondary transition-colors duration-500">
                      Tema: {currentLine?.label} | Componente: {componentCategories.find(c => c.id === state.selectedComponent)?.label} | 
                      🎛️ Editor en vivo con paleta general disponible
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-line-primary text-white border-line-primary transition-all duration-500">
                    Editor Funcional ✨
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 