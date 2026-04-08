"use client";

import React, { useState } from 'react';
import { ADMIN_ROUTES, AdminRouteMetadata } from './routes-list';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Play,
  RefreshCw,
  Activity,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Terminal
} from "lucide-react";

interface TestResult {
  path: string;
  label: string;
  method: string;
  payload: string;
  status: 'idle' | 'running' | 'success' | 'error';
  statusCode?: number;
  message?: string;
  latency?: number;
  isExpanded: boolean;
}

export default function AdminDiagnosticsPage() {
  const [results, setResults] = useState<TestResult[]>(
    ADMIN_ROUTES.map(r => ({
      ...r,
      method: r.methods[0],
      payload: JSON.stringify(r.defaultPayload || {}, null, 2),
      status: 'idle',
      isExpanded: false
    }))
  );
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [allowMutations, setAllowMutations] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggleExpand = (index: number) => {
    setResults(prev => prev.map((r, i) => i === index ? { ...r, isExpanded: !r.isExpanded } : r));
  };

  const updatePath = (index: number, path: string) => {
    setResults(prev => prev.map((r, i) => i === index ? { ...r, path } : r));
  };

  const updateMethod = (index: number, method: string) => {
    setResults(prev => prev.map((r, i) => i === index ? { ...r, method } : r));
  };

  const updatePayload = (index: number, payload: string) => {
    setResults(prev => prev.map((r, i) => i === index ? { ...r, payload } : r));
  };

  const runTest = async (index: number) => {
    const route = results[index];

    // Safety check for mutations
    if (route.method !== 'GET' && !allowMutations) {
      setResults(prev => prev.map((r, i) => i === index ? {
        ...r,
        status: 'error',
        message: 'Mutations are locked. Enable "Mutation Mode" to test POST/PUT/DELETE.'
      } : r));
      return false;
    }

    setResults(prev => prev.map((r, i) => i === index ? { ...r, status: 'running' } : r));

    const start = performance.now();
    try {
      const options: RequestInit = {
        method: route.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (['POST', 'PUT', 'PATCH'].includes(route.method)) {
        options.body = route.payload;
      }

      const response = await fetch(route.path, options);
      const end = performance.now();
      const latency = Math.round(end - start);

      const isOk = response.ok;
      let responseData: any = null;
      try {
        responseData = await response.json();
      } catch (e) { }

      setResults(prev => {
        const newResults = [...prev];
        const res = responseData;
        // Robust ID extraction
        const extractedId = 
          res?.id || 
          res?.product?.id || 
          (Array.isArray(res?.product) ? res.product[0]?.id : null) ||
          (Array.isArray(res) ? res[0]?.id : null);
        
        newResults[index] = {
          ...newResults[index],
          status: isOk ? 'success' : 'error',
          statusCode: response.status,
          latency,
          // Extra debugging: show the full JSON if ID is not found but it's OK
          message: isOk ? (extractedId || JSON.stringify(res)) : (res?.error || 'Error'),
          isExpanded: isOk ? true : newResults[index].isExpanded
        };

        // AUTOFILL: Update dynamic route
        if (isOk && extractedId && route.path === '/api/admin/products') {
          const individualIndex = newResults.findIndex(r => r.label === 'Individual Product');
          if (individualIndex !== -1) {
            newResults[individualIndex].path = `/api/admin/products/${extractedId}`;
          }
        }

        return newResults;
      });
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

    // Only run GET tests in bulk by default unless user confirms otherwise
    // For now, we only run the GET ones in bulk to avoid accidents
    const testsToRun = results.filter(r => r.method === 'GET');

    for (let i = 0; i < testsToRun.length; i++) {
      const realIndex = results.findIndex(r => r.path === testsToRun[i].path);
      await runTest(realIndex);
      setProgress(((i + 1) / testsToRun.length) * 100);
    }

    setIsTestRunning(false);
  };

  const resetTests = () => {
    setResults(ADMIN_ROUTES.map(r => ({
      ...r,
      method: r.methods[0],
      payload: JSON.stringify(r.defaultPayload || {}, null, 2),
      status: 'idle',
      isExpanded: false
    })));
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
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Terminal className="h-8 w-8 text-rose-500" />
            Admin Suite Explorer <Badge variant="secondary" className="text-xs">v2.0</Badge>
          </h1>
          <p className="text-muted-foreground">
            Validador avanzado de endpoints administrativos con soporte para mutaciones de datos.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center space-x-2 bg-rose-50 p-2 rounded-lg border border-rose-100">
            {allowMutations ? <Unlock className="h-4 w-4 text-orange-500" /> : <Lock className="h-4 w-4 text-rose-500" />}
            <Label htmlFor="mutation-mode" className="text-xs font-semibold uppercase tracking-wider">Mutation Mode</Label>
            <Switch
              id="mutation-mode"
              checked={allowMutations}
              onCheckedChange={setAllowMutations}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              onClick={runAllTests}
              disabled={isTestRunning}
              variant="outline"
              size="sm"
            >
              {isTestRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              <span className="ml-2">Run all GETs</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={resetTests} disabled={isTestRunning}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', val: stats.total, color: 'border-rose-200' },
          { label: 'Exitosas', val: stats.success, color: 'border-green-300 text-green-700 bg-green-50' },
          { label: 'Fallidas', val: stats.error, color: 'border-red-300 text-red-700 bg-red-50' },
          { label: 'Pendientes', val: stats.idle, color: 'border-slate-200 bg-slate-50' }
        ].map(card => (
          <Card key={card.label} className={`${card.color} shadow-sm border-2 transition-all hover:scale-105`}>
            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
              <CardDescription className="text-xs font-bold uppercase">{card.label}</CardDescription>
              <CardTitle className="text-2xl font-black">{card.val}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="shadow-2xl border-rose-100">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Funcionalidad</TableHead>
              <TableHead>Método</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">HTTP</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((res, index) => (
              <React.Fragment key={res.path}>
                <TableRow className="group transition-colors">
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(index)}>
                      {res.isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-rose-900">{res.label}</div>
                    <input
                      className="text-[10px] font-mono text-slate-400 bg-transparent border-none focus:ring-0 focus:text-rose-600 w-full p-0"
                      value={res.path}
                      onChange={(e) => updatePath(index, e.target.value)}
                      disabled={isTestRunning}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={res.method}
                      onValueChange={(val) => updateMethod(index, val)}
                      disabled={isTestRunning}
                    >
                      <SelectTrigger className="w-[100px] h-8 text-xs font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ADMIN_ROUTES[index].methods.map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-center">
                    {res.status === 'idle' && <Badge variant="secondary" className="opacity-50">Idle</Badge>}
                    {res.status === 'running' && <Loader2 className="animate-spin h-5 w-5 mx-auto text-rose-500" />}
                    {res.status === 'success' && <div className="bg-green-100 text-green-700 rounded-full p-1 w-fit mx-auto"><CheckCircle2 className="h-4 w-4" /></div>}
                    {res.status === 'error' && <div className="bg-red-100 text-red-700 rounded-full p-1 w-fit mx-auto" title={res.message}><XCircle className="h-4 w-4" /></div>}
                  </TableCell>
                  <TableCell className="text-center font-mono font-black text-sm">
                    {res.statusCode || '--'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => runTest(index)}
                      disabled={isTestRunning || (res.method !== 'GET' && !allowMutations)}
                      className={res.method !== 'GET' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-rose-600 hover:bg-rose-700'}
                    >
                      Test
                    </Button>
                  </TableCell>
                </TableRow>

                {res.isExpanded && (
                  <TableRow className="bg-slate-50 animate-in slide-in-from-top-2 duration-300">
                    <TableCell colSpan={6} className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label className="text-xs font-bold text-slate-500 uppercase">JSON Payload Body</Label>
                          {res.latency && <span className="text-[10px] font-mono bg-slate-200 px-2 py-1 rounded">Execution: {res.latency}ms</span>}
                        </div>
                        <Textarea
                          className="font-mono text-xs h-[150px] bg-white shadow-inner border-slate-200"
                          value={res.payload}
                          onChange={(e) => updatePayload(index, e.target.value)}
                          placeholder='{"key": "value"}'
                          disabled={isTestRunning}
                        />
                        {res.message && (
                          <div className="p-3 bg-red-100 border border-red-200 rounded text-red-700 text-xs font-mono">
                            <strong>Error Context:</strong> {res.message}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="text-center pb-10">
        <p className="text-xs text-slate-400">
          Esta herramienta es para uso exclusivo de desarrollo y testing estructural.
          Al habilitar "Mutation Mode", el usuario asume la responsabilidad por los cambios en la base de datos local o de staging.
        </p>
      </div>
    </div>
  );
}
