"use client";

import React, { useState, useEffect } from 'react';
import { ADMIN_ROUTES } from './routes-list';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Loader2, Play, RefreshCw, Activity } from "lucide-react";

interface TestResult {
  path: string;
  label: string;
  status: 'idle' | 'running' | 'success' | 'error';
  statusCode?: number;
  message?: string;
  latency?: number;
}

export default function AdminDiagnosticsPage() {
  const [results, setResults] = useState<TestResult[]>(
    ADMIN_ROUTES.map(r => ({ ...r, status: 'idle' }))
  );
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runTest = async (index: number) => {
    const route = results[index];
    setResults(prev => prev.map((r, i) => i === index ? { ...r, status: 'running' } : r));

    const start = performance.now();
    try {
      const response = await fetch(route.path);
      const end = performance.now();
      const latency = Math.round(end - start);

      const isOk = response.ok;
      setResults(prev => prev.map((r, i) => i === index ? {
        ...r,
        status: isOk ? 'success' : 'error',
        statusCode: response.status,
        latency
      } : r));
      return isOk;
    } catch (error: any) {
      setResults(prev => prev.map((r, i) => i === index ? {
        ...r,
        status: 'error',
        message: error.message || 'Network Error'
      } : r));
      return false;
    }
  };

  const runAllTests = async () => {
    setIsTestRunning(true);
    setProgress(0);

    for (let i = 0; i < results.length; i++) {
      await runTest(i);
      setProgress(((i + 1) / results.length) * 100);
    }

    setIsTestRunning(false);
  };

  const resetTests = () => {
    setResults(ADMIN_ROUTES.map(r => ({ ...r, status: 'idle' })));
    setProgress(0);
  };

  const stats = {
    total: results.length,
    success: results.filter(r => r.status === 'success').length,
    error: results.filter(r => r.status === 'error').length,
    idle: results.filter(r => r.status === 'idle').length,
  };

  return (
    <div className="container mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Activity className="h-8 w-8 text-rose-500" />
            Diagnóstico de API Admin
          </h1>
          <p className="text-muted-foreground mt-2">
            Verificación automática de conectividad y autenticación para los 50+ endpoints migrados.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runAllTests}
            disabled={isTestRunning}
            className="bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-lg hover:shadow-rose-500/25"
          >
            {isTestRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            Ejecutar Suite Completa
          </Button>
          <Button variant="outline" onClick={resetTests} disabled={isTestRunning}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/50 backdrop-blur-sm border-rose-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Total Rutas</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-green-50/50 backdrop-blur-sm border-green-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-green-700">Exitosas</CardDescription>
            <CardTitle className="text-2xl text-green-700">{stats.success}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-red-50/50 backdrop-blur-sm border-red-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-red-700">Fallidas</CardDescription>
            <CardTitle className="text-2xl text-red-700">{stats.error}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-gray-50/50 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Pendientes</CardDescription>
            <CardTitle className="text-2xl">{stats.idle}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {isTestRunning && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Progreso de Pruebas</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-rose-100" />
        </div>
      )}

      <Card className="overflow-hidden border-rose-100 shadow-xl">
        <Table>
          <TableHeader className="bg-rose-50/50">
            <TableRow>
              <TableHead className="w-[300px]">Módulo / Endpoint</TableHead>
              <TableHead>Ruta Relativa</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Status Code</TableHead>
              <TableHead className="text-right">Latencia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((res, index) => (
              <TableRow key={res.path} className="hover:bg-rose-50/20 transition-colors">
                <TableCell className="font-medium text-rose-900">{res.label}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{res.path}</TableCell>
                <TableCell className="text-center">
                  {res.status === 'idle' && <Badge variant="outline">Pendiente</Badge>}
                  {res.status === 'running' && <Loader2 className="animate-spin h-4 w-4 mx-auto text-rose-500" />}
                  {res.status === 'success' && <CheckCircle2 className="h-5 w-5 mx-auto text-green-500" />}
                  {res.status === 'error' && <XCircle className="h-5 w-5 mx-auto text-red-500" />}
                </TableCell>
                <TableCell className="text-center font-mono font-bold">
                  {res.statusCode ? (
                    <span className={res.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                      {res.statusCode}
                    </span>
                  ) : '-'}
                </TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">
                  {res.latency ? `${res.latency}ms` : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
