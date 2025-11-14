"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function BrandingManager() {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/system/branding/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config || {});
      }
    } catch (error) {
      console.error('Error fetching branding config:', error);
    }
  };

  const handleUpload = async (type: 'logo' | 'favicon', file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/admin/system/branding/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} subido exitosamente`);
        fetchConfig();
      } else {
        toast.error(data.error || 'Error al subir archivo');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error al subir archivo');
    } finally {
      setLoading(false);
    }
  };

  const handleColorUpdate = async (key: string, value: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/system/branding/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      });

      if (response.ok) {
        toast.success('Color actualizado');
        fetchConfig();
      }
    } catch (error) {
      console.error('Error updating color:', error);
      toast.error('Error al actualizar color');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-azul-profundo">Personalización y Branding</h2>
        <p className="text-tierra-media">Personaliza la apariencia de tu marca</p>
      </div>

      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Logo
          </CardTitle>
          <CardDescription>Sube el logo de tu marca</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.brand_logo_url && (
            <div className="border rounded-lg p-4">
              <img 
                src={config.brand_logo_url} 
                alt="Logo actual" 
                className="max-h-32 mx-auto"
              />
            </div>
          )}
          <div>
            <Label htmlFor="logo-upload">Subir nuevo logo</Label>
            <Input
              id="logo-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload('logo', file);
              }}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Formatos: PNG, JPG, SVG. Tamaño máximo: 5MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Favicon Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Favicon</CardTitle>
          <CardDescription>Sube el favicon de tu sitio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.brand_favicon_url && (
            <div className="border rounded-lg p-4">
              <img 
                src={config.brand_favicon_url} 
                alt="Favicon actual" 
                className="w-16 h-16 mx-auto"
              />
            </div>
          )}
          <div>
            <Label htmlFor="favicon-upload">Subir nuevo favicon</Label>
            <Input
              id="favicon-upload"
              type="file"
              accept="image/png,image/x-icon,image/svg+xml"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload('favicon', file);
              }}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Formatos: PNG, ICO, SVG. Tamaño recomendado: 32x32px
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Paleta de Colores
          </CardTitle>
          <CardDescription>Personaliza los colores de tu marca</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'brand_primary_color', label: 'Color Primario', default: '#AE0000' },
            { key: 'brand_secondary_color', label: 'Color Secundario', default: '#C70000' },
            { key: 'brand_accent_color', label: 'Color de Acento', default: '#DB3600' },
            { key: 'brand_highlight_color', label: 'Color de Resaltado', default: '#F8D794' }
          ].map(color => (
            <div key={color.key} className="flex items-center gap-4">
              <Label className="w-32">{color.label}</Label>
              <Input
                type="color"
                value={config[color.key] || color.default}
                onChange={(e) => handleColorUpdate(color.key, e.target.value)}
                className="w-20 h-10"
                disabled={loading}
              />
              <Input
                type="text"
                value={config[color.key] || color.default}
                onChange={(e) => handleColorUpdate(color.key, e.target.value)}
                className="flex-1 font-mono"
                disabled={loading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleColorUpdate(color.key, color.default)}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

