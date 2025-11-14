"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  content: string;
  variables: string[];
  is_active: boolean;
  is_system?: boolean;
}

interface EmailTemplateEditorProps {
  template?: EmailTemplate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export default function EmailTemplateEditor({
  template,
  open,
  onOpenChange,
  onSave
}: EmailTemplateEditorProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'custom',
    subject: '',
    content: '',
    is_active: true
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || '',
        type: template.type || 'custom',
        subject: template.subject || '',
        content: template.content || '',
        is_active: template.is_active ?? true
      });
    } else {
      setFormData({
        name: '',
        type: 'custom',
        subject: '',
        content: '',
        is_active: true
      });
    }
  }, [template, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.subject || !formData.content) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);

      if (template) {
        // Update existing template
        const response = await fetch(`/api/admin/system/email-templates/${template.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Error al actualizar plantilla');
        }

        toast.success('Plantilla actualizada exitosamente');
      } else {
        // Create new template
        const response = await fetch('/api/admin/system/email-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Error al crear plantilla');
        }

        toast.success('Plantilla creada exitosamente');
      }

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error(error instanceof Error ? error.message : 'Error al guardar plantilla');
    } finally {
      setLoading(false);
    }
  };

  const availableVariables = [
    { key: 'customer_name', label: 'Nombre del Cliente' },
    { key: 'order_number', label: 'Número de Pedido' },
    { key: 'order_total', label: 'Total del Pedido' },
    { key: 'order_date', label: 'Fecha del Pedido' },
    { key: 'company_name', label: 'Nombre de la Empresa' },
    { key: 'support_email', label: 'Email de Soporte' }
  ];

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const newText = before + `{{${variable}}}` + after;
      setFormData({ ...formData, content: newText });
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
      }, 0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Editar Plantilla' : 'Nueva Plantilla'}
          </DialogTitle>
          <DialogDescription>
            {template 
              ? 'Modifica la plantilla de email'
              : 'Crea una nueva plantilla de email para el sistema'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Plantilla *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Confirmación de Pedido"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                disabled={!!template?.is_system}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order_confirmation">Confirmación de Pedido</SelectItem>
                  <SelectItem value="order_shipped">Pedido Enviado</SelectItem>
                  <SelectItem value="order_delivered">Pedido Entregado</SelectItem>
                  <SelectItem value="password_reset">Restablecer Contraseña</SelectItem>
                  <SelectItem value="account_welcome">Bienvenida</SelectItem>
                  <SelectItem value="membership_welcome">Bienvenida Membresía</SelectItem>
                  <SelectItem value="membership_reminder">Recordatorio Membresía</SelectItem>
                  <SelectItem value="low_stock_alert">Alerta de Stock Bajo</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Asunto *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Ej: Confirmación de tu pedido {{order_number}}"
              required
            />
            <p className="text-xs text-muted-foreground">
              Puedes usar variables como {'{{customer_name}}'}, {'{{order_number}}'}, etc.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="content">Contenido HTML *</Label>
              <div className="flex gap-2 flex-wrap">
                {availableVariables.map((varItem) => (
                  <Badge
                    key={varItem.key}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => insertVariable(varItem.key)}
                  >
                    {varItem.label}
                  </Badge>
                ))}
              </div>
            </div>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="<html><body>...</body></html>"
              rows={12}
              className="font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">
              Haz clic en las variables para insertarlas en el contenido
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Plantilla Activa</Label>
              <p className="text-xs text-muted-foreground">
                Solo las plantillas activas se usarán para enviar emails
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

