"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Globe, Search, BarChart3, Save, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function SEOManager() {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/system/seo/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config || {});
      }
    } catch (error) {
      console.error('Error fetching SEO config:', error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/system/seo/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        toast.success('Configuración SEO guardada exitosamente');
      } else {
        toast.error('Error al guardar configuración');
      }
    } catch (error) {
      console.error('Error saving SEO config:', error);
      toast.error('Error al guardar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-azul-profundo">Configuración SEO</h2>
          <p className="text-tierra-media">Optimiza tu sitio para motores de búsqueda</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      {/* Global SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Configuración Global SEO
          </CardTitle>
          <CardDescription>Configuración básica para SEO</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default_title">Título por Defecto</Label>
            <Input
              id="default_title"
              value={config.seo_default_title || ''}
              onChange={(e) => handleUpdate('seo_default_title', e.target.value)}
              placeholder="DA LUZ CONSCIENTE - Productos Naturales"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_description">Descripción por Defecto</Label>
            <Textarea
              id="default_description"
              value={config.seo_default_description || ''}
              onChange={(e) => handleUpdate('seo_default_description', e.target.value)}
              placeholder="Descripción de tu sitio web..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {config.seo_default_description?.length || 0} / 160 caracteres recomendados
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_keywords">Palabras Clave</Label>
            <Input
              id="default_keywords"
              value={Array.isArray(config.seo_default_keywords) 
                ? config.seo_default_keywords.join(', ') 
                : config.seo_default_keywords || ''}
              onChange={(e) => {
                const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                handleUpdate('seo_default_keywords', keywords);
              }}
              placeholder="productos naturales, bienestar, salud"
            />
            <p className="text-xs text-muted-foreground">
              Separa las palabras clave con comas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="og_image">Imagen Open Graph</Label>
            <Input
              id="og_image"
              value={config.seo_og_image_url || ''}
              onChange={(e) => handleUpdate('seo_og_image_url', e.target.value)}
              placeholder="https://..."
            />
            <p className="text-xs text-muted-foreground">
              URL de la imagen que se mostrará al compartir en redes sociales (1200x630px recomendado)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociales</CardTitle>
          <CardDescription>Configura tus perfiles de redes sociales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="twitter_handle">Twitter Handle</Label>
            <Input
              id="twitter_handle"
              value={config.seo_twitter_handle || ''}
              onChange={(e) => handleUpdate('seo_twitter_handle', e.target.value)}
              placeholder="@usuario"
            />
          </div>
        </CardContent>
      </Card>

      {/* Analytics & Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics y Tracking
          </CardTitle>
          <CardDescription>Configura códigos de seguimiento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ga_id">Google Analytics ID</Label>
            <Input
              id="ga_id"
              value={config.seo_google_analytics_id || ''}
              onChange={(e) => handleUpdate('seo_google_analytics_id', e.target.value)}
              placeholder="G-XXXXXXXXXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gtm_id">Google Tag Manager ID</Label>
            <Input
              id="gtm_id"
              value={config.seo_google_tag_manager_id || ''}
              onChange={(e) => handleUpdate('seo_google_tag_manager_id', e.target.value)}
              placeholder="GTM-XXXXXXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fb_pixel">Facebook Pixel ID</Label>
            <Input
              id="fb_pixel"
              value={config.seo_facebook_pixel_id || ''}
              onChange={(e) => handleUpdate('seo_facebook_pixel_id', e.target.value)}
              placeholder="123456789012345"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sitemap & Robots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Sitemap y Robots.txt
          </CardTitle>
          <CardDescription>URLs para motores de búsqueda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="font-semibold">Sitemap</Label>
              <p className="text-sm text-muted-foreground">{baseUrl}/api/sitemap.xml</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={`${baseUrl}/api/sitemap.xml`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver
              </a>
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="font-semibold">Robots.txt</Label>
              <p className="text-sm text-muted-foreground">{baseUrl}/api/robots.txt</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={`${baseUrl}/api/robots.txt`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

