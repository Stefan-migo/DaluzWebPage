"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Zap, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  TestTube
} from 'lucide-react';
import { toast } from 'sonner';

interface WebhookLog {
  id: string;
  webhook_type: string;
  event_type: string;
  status: string;
  response_code: number;
  error_message?: string;
  created_at: string;
  processed_at?: string;
}

interface WebhookStatus {
  mercadopago: {
    total: number;
    success: number;
    failed: number;
    last_delivery: string | null;
  };
  sanity: {
    total: number;
    success: number;
    failed: number;
    last_delivery: string | null;
  };
  urls: {
    mercadopago: string;
    sanity: string;
  };
}

export default function WebhookMonitor() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [status, setStatus] = useState<WebhookStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [typeFilter, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const [logsRes, statusRes] = await Promise.all([
        fetch(`/api/admin/system/webhooks/logs?${params}`),
        fetch('/api/admin/system/webhooks/status')
      ]);

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.logs || []);
      }

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setStatus(statusData);
      }
    } catch (error) {
      console.error('Error fetching webhook data:', error);
      toast.error('Error al cargar datos de webhooks');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (url: string, type: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`URL de ${type} copiada al portapapeles`);
  };

  const handleTestWebhook = async (type: string) => {
    try {
      const response = await fetch('/api/admin/system/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhook_type: type })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.error || 'Error al probar webhook');
      }
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast.error('Error al probar webhook');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Exitoso</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Fallido</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-azul-profundo">Monitoreo de Webhooks</h2>
          <p className="text-tierra-media">Monitorea el estado y las entregas de webhooks</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Webhook URLs */}
      {status?.urls && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">MercadoPago Webhook</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input value={status.urls.mercadopago} readOnly className="font-mono text-xs" />
                <Button variant="outline" size="sm" onClick={() => handleCopyUrl(status.urls.mercadopago, 'MercadoPago')}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleTestWebhook('mercadopago')}>
                  <TestTube className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 text-xs text-tierra-media">
                <p>Total (24h): {status.mercadopago.total} | Exitosos: {status.mercadopago.success} | Fallidos: {status.mercadopago.failed}</p>
                {status.mercadopago.last_delivery && (
                  <p>Última entrega: {new Date(status.mercadopago.last_delivery).toLocaleString('es-AR')}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sanity Webhook</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input value={status.urls.sanity} readOnly className="font-mono text-xs" />
                <Button variant="outline" size="sm" onClick={() => handleCopyUrl(status.urls.sanity, 'Sanity')}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleTestWebhook('sanity')}>
                  <TestTube className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 text-xs text-tierra-media">
                <p>Total (24h): {status.sanity.total} | Exitosos: {status.sanity.success} | Fallidos: {status.sanity.failed}</p>
                {status.sanity.last_delivery && (
                  <p>Última entrega: {new Date(status.sanity.last_delivery).toLocaleString('es-AR')}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div>
              <Label>Tipo:</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="mercadopago">MercadoPago</SelectItem>
                  <SelectItem value="sanity">Sanity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estado:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="success">Exitosos</SelectItem>
                  <SelectItem value="failed">Fallidos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Webhooks</CardTitle>
          <CardDescription>Últimas entregas de webhooks</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="p-8 text-center text-tierra-media">Cargando...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-tierra-media">No hay registros de webhooks</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant="outline">{log.webhook_type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.event_type || 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>{log.response_code || 'N/A'}</TableCell>
                    <TableCell className="text-xs">
                      {new Date(log.created_at).toLocaleString('es-AR')}
                    </TableCell>
                    <TableCell className="text-xs text-red-600 max-w-xs truncate">
                      {log.error_message || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

