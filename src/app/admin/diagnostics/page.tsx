"use client";

import React, { useState, useEffect } from 'react';
import { ADMIN_ROUTES, ROUTE_CATEGORIES, AdminRouteMetadata } from './routes-list';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Terminal,
  Copy,
  Check,
  Clock,
  Zap,
} from "lucide-react";

// ── Constants ──────────────────────────────────────────────
const STORAGE_KEY = 'admin-diagnostics-v2';
const MAX_HISTORY = 5;
const CONCURRENCY_LIMIT = 3;

// ── Types ──────────────────────────────────────────────────
interface HistoryEntry {
  timestamp: string;
  status: 'success' | 'error';
  statusCode?: number;
  latency?: number;
}

interface TestResult {
  path: string;
  originalPath: string;
  label: string;
  category: string;
  methods: string[];
  method: string;
  payload: string;
  status: 'idle' | 'running' | 'success' | 'error';
  statusCode?: number;
  message?: string;
  latency?: number;
  responseData?: any;
  isExpanded: boolean;
  history: HistoryEntry[];
  description?: string;
}

// ── Helpers ────────────────────────────────────────────────
const createTestResult = (route: AdminRouteMetadata): TestResult => ({
  path: route.path,
  originalPath: route.path,
  label: route.label,
  category: route.category,
  methods: route.methods,
  method: route.methods[0],
  payload: JSON.stringify(route.defaultPayload || {}, null, 2),
  status: 'idle',
  isExpanded: false,
  history: [],
  description: route.description,
});

const getLatencyColor = (ms: number): string => {
  if (ms < 300) return 'bg-green-100 text-green-700';
  if (ms < 1000) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
};

// ── Component ──────────────────────────────────────────────
export default function AdminDiagnosticsPage() {
  const [results, setResults] = useState<TestResult[]>(
    ADMIN_ROUTES.map(createTestResult)
  );
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [allowMutations, setAllowMutations] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // ── localStorage: Load on mount ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.mutations !== undefined) setAllowMutations(saved.mutations);
      if (saved.customPaths) {
        setResults(prev => prev.map(r => ({
          ...r,
          path: saved.customPaths[r.originalPath] || r.path,
        })));
      }
    } catch { /* ignore corrupt data */ }
  }, []);

  // ── localStorage: Save mutations toggle ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : {};
      saved.mutations = allowMutations;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch { /* ignore */ }
  }, [allowMutations]);

  // ── Persist custom paths helper ──
  const saveCustomPaths = (nextResults: TestResult[]) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : {};
      const customPaths: Record<string, string> = {};
      nextResults.forEach(r => {
        if (r.path !== r.originalPath) customPaths[r.originalPath] = r.path;
      });
      saved.customPaths = Object.keys(customPaths).length > 0 ? customPaths : undefined;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch { /* ignore */ }
  };

  // ── Row actions ──
  const toggleExpand = (index: number) => {
    setResults(prev => prev.map((r, i) => i === index ? { ...r, isExpanded: !r.isExpanded } : r));
  };

  const updatePath = (index: number, path: string) => {
    setResults(prev => {
      const next = prev.map((r, i) => i === index ? { ...r, path } : r);
      saveCustomPaths(next);
      return next;
    });
  };

  const updateMethod = (index: number, method: string) => {
    setResults(prev => prev.map((r, i) => i === index ? { ...r, method } : r));
  };

  const updatePayload = (index: number, payload: string) => {
    setResults(prev => prev.map((r, i) => i === index ? { ...r, payload } : r));
  };

  // ── Run single test ──
  const runTest = async (index: number, { autoExpand = true } = {}) => {
    const route = results[index];

    if (route.method !== 'GET' && !allowMutations) {
      setResults(prev => prev.map((r, i) => i === index ? {
        ...r,
        status: 'error' as const,
        message: 'Mutations locked. Enable "Mutation Mode" to test POST/PUT/DELETE.',
      } : r));
      return false;
    }

    setResults(prev => prev.map((r, i) => i === index ? { ...r, status: 'running' as const } : r));

    const start = performance.now();
    try {
      const options: RequestInit = {
        method: route.method,
        headers: { 'Content-Type': 'application/json' },
      };

      if (['POST', 'PUT', 'PATCH'].includes(route.method)) {
        options.body = route.payload;
      }

      const response = await fetch(route.path, options);
      const latency = Math.round(performance.now() - start);

      let responseData: any = null;
      try { responseData = await response.json(); } catch { /* non-json */ }

      const isOk = response.ok;

      setResults(prev => {
        const newResults = [...prev];
        const res = responseData;

        // Robust ID extraction
        const extractedId =
          res?.id ||
          res?.product?.id ||
          (Array.isArray(res?.product) ? res.product[0]?.id : null) ||
          (Array.isArray(res) ? res[0]?.id : null);

        // History entry
        const historyEntry: HistoryEntry = {
          timestamp: new Date().toISOString(),
          status: isOk ? 'success' : 'error',
          statusCode: response.status,
          latency,
        };
        const updatedHistory = [historyEntry, ...newResults[index].history].slice(0, MAX_HISTORY);

        newResults[index] = {
          ...newResults[index],
          status: isOk ? 'success' : 'error',
          statusCode: response.status,
          latency,
          responseData,
          message: isOk
            ? (extractedId ? String(extractedId) : JSON.stringify(res))
            : (res?.error || 'Error'),
          isExpanded: (isOk && autoExpand) ? true : newResults[index].isExpanded,
          history: updatedHistory,
        };

        // ── AUTOFILL dynamic routes ──
        if (isOk && extractedId) {
          const autofillMap: Record<string, string> = {
            '/api/admin/products': 'Individual Product',
            '/api/admin/orders': 'Individual Order',
            '/api/admin/customers': 'Individual Customer',
            '/api/admin/support/tickets': 'Individual Ticket',
          };
          const targetLabel = autofillMap[route.path];
          if (targetLabel) {
            const idx = newResults.findIndex(r => r.label === targetLabel);
            if (idx !== -1) newResults[idx].path = `${route.path}/${extractedId}`;
          }
        }

        return newResults;
      });

      return isOk;
    } catch (error: any) {
      const latency = Math.round(performance.now() - start);
      setResults(prev => prev.map((r, i) => i === index ? {
        ...r,
        status: 'error' as const,
        message: error.message || 'Network Error',
        responseData: null,
        latency,
        history: [{
          timestamp: new Date().toISOString(),
          status: 'error' as const,
          latency,
        }, ...r.history].slice(0, MAX_HISTORY),
      } : r));
      return false;
    }
  };

  // ── Run all GETs concurrently (batches of CONCURRENCY_LIMIT) ──
  const runAllTests = async () => {
    setIsTestRunning(true);
    setProgress(0);

    const testsToRun = results
      .map((r, i) => ({ index: i, method: r.method }))
      .filter(({ method }) => method === 'GET');

    let completed = 0;

    for (let i = 0; i < testsToRun.length; i += CONCURRENCY_LIMIT) {
      const batch = testsToRun.slice(i, i + CONCURRENCY_LIMIT);
      await Promise.allSettled(
        batch.map(({ index }) => runTest(index, { autoExpand: false }))
      );
      completed += batch.length;
      setProgress((completed / testsToRun.length) * 100);
    }

    setIsTestRunning(false);
  };

  // ── Reset ──
  const resetTests = () => {
    setResults(ADMIN_ROUTES.map(createTestResult));
    setProgress(0);
  };

  // ── Expand / Collapse all ──
  const expandAll = () => setResults(prev => prev.map(r => ({ ...r, isExpanded: true })));
  const collapseAll = () => setResults(prev => prev.map(r => ({ ...r, isExpanded: false })));

  // ── Export to clipboard ──
  const exportResults = async () => {
    const data = results
      .filter(r => r.status !== 'idle')
      .map(r => ({
        path: r.path,
        label: r.label,
        category: r.category,
        method: r.method,
        status: r.status,
        statusCode: r.statusCode,
        latency: r.latency,
        response: r.responseData,
        history: r.history,
      }));
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  };

  // ── Computed values ──
  const filteredEntries = results
    .map((r, i) => ({ result: r, index: i }))
    .filter(({ result }) => !activeCategory || result.category === activeCategory);

  const groupedResults = ROUTE_CATEGORIES
    .map(category => ({
      category,
      entries: filteredEntries.filter(({ result }) => result.category === category),
    }))
    .filter(group => group.entries.length > 0);

  const testedResults = results.filter(r => r.latency);
  const stats = {
    total: results.length,
    success: results.filter(r => r.status === 'success').length,
    error: results.filter(r => r.status === 'error').length,
    idle: results.filter(r => r.status === 'idle').length,
    avgLatency: testedResults.length > 0
      ? Math.round(testedResults.reduce((sum, r) => sum + (r.latency || 0), 0) / testedResults.length)
      : 0,
  };

  const getCount = results.filter(r => r.method === 'GET').length;

  // ── Render ──
  return (
    <div className="container mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-700">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Terminal className="h-8 w-8 text-rose-500" />
            Admin Suite Explorer <Badge variant="secondary" className="text-xs">v3.0</Badge>
          </h1>
          <p className="text-muted-foreground">
            Validador avanzado de endpoints con historial, ejecucion concurrente y persistencia local.
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
          <div className="flex gap-2 justify-end flex-wrap">
            <Button onClick={runAllTests} disabled={isTestRunning} variant="outline" size="sm">
              {isTestRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              <span className="ml-1">Run {getCount} GETs</span>
            </Button>
            <Button variant="outline" size="sm" onClick={exportResults} disabled={isTestRunning || stats.idle === stats.total}>
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              <span className="ml-1">{copied ? 'Copied!' : 'Export'}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={resetTests} disabled={isTestRunning}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      {isTestRunning && (
        <Progress value={progress} className="h-2 animate-in fade-in duration-300" />
      )}

      {/* ── Category Filter ── */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(null)}
          className="text-xs"
        >
          Todos ({results.length})
        </Button>
        {ROUTE_CATEGORIES.map(cat => {
          const count = results.filter(r => r.category === cat).length;
          if (count === 0) return null;
          const catErrors = results.filter(r => r.category === cat && r.status === 'error').length;
          return (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className="text-xs"
            >
              {cat} ({count})
              {catErrors > 0 && (
                <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 text-[10px]">{catErrors}</span>
              )}
            </Button>
          );
        })}
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', val: stats.total, color: 'border-rose-200' },
          { label: 'Exitosas', val: stats.success, color: 'border-green-300 text-green-700 bg-green-50' },
          { label: 'Fallidas', val: stats.error, color: 'border-red-300 text-red-700 bg-red-50' },
          { label: 'Pendientes', val: stats.idle, color: 'border-slate-200 bg-slate-50' },
          { label: 'Latencia Prom.', val: `${stats.avgLatency}ms`, color: 'border-blue-200 bg-blue-50 text-blue-700' },
        ].map(card => (
          <Card key={card.label} className={`${card.color} shadow-sm border-2 transition-all hover:scale-105`}>
            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
              <CardDescription className="text-xs font-bold uppercase">{card.label}</CardDescription>
              <CardTitle className="text-2xl font-black">{card.val}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* ── Main Table ── */}
      <Card className="shadow-2xl border-rose-100">
        {/* Expand/Collapse toolbar */}
        <div className="flex justify-end p-2 gap-2 border-b">
          <Button variant="ghost" size="sm" onClick={expandAll} className="text-xs">
            <ChevronDown className="h-3 w-3 mr-1" /> Expand All
          </Button>
          <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs">
            <ChevronUp className="h-3 w-3 mr-1" /> Collapse All
          </Button>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Funcionalidad</TableHead>
              <TableHead>Metodo</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">HTTP</TableHead>
              <TableHead className="text-center">Latencia</TableHead>
              <TableHead className="text-right">Accion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedResults.map(({ category, entries }) => (
              <React.Fragment key={category}>
                {/* ── Category Header Row ── */}
                <TableRow className="bg-slate-100/80 hover:bg-slate-100/80">
                  <TableCell colSpan={7} className="py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                        {category}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">{entries.length}</Badge>
                    </div>
                  </TableCell>
                </TableRow>

                {/* ── Route Rows ── */}
                {entries.map(({ result: res, index }) => (
                  <React.Fragment key={`${index}-${res.originalPath}`}>
                    <TableRow className="group transition-colors">
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toggleExpand(index)}>
                          {res.isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-rose-900">{res.label}</div>
                        {res.description && (
                          <div className="text-[10px] text-slate-400 mb-0.5">{res.description}</div>
                        )}
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
                            {res.methods.map(m => (
                              <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">
                        {res.status === 'idle' && <Badge variant="secondary" className="opacity-50">Idle</Badge>}
                        {res.status === 'running' && <Loader2 className="animate-spin h-5 w-5 mx-auto text-rose-500" />}
                        {res.status === 'success' && (
                          <div className="bg-green-100 text-green-700 rounded-full p-1 w-fit mx-auto">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        )}
                        {res.status === 'error' && (
                          <div className="bg-red-100 text-red-700 rounded-full p-1 w-fit mx-auto" title={res.message}>
                            <XCircle className="h-4 w-4" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-mono font-black text-sm">
                        {res.statusCode || '--'}
                      </TableCell>
                      <TableCell className="text-center">
                        {res.latency ? (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${getLatencyColor(res.latency)}`}>
                            {res.latency}ms
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">--</span>
                        )}
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

                    {/* ── Expanded Detail Panel ── */}
                    {res.isExpanded && (
                      <TableRow className="bg-slate-50 animate-in slide-in-from-top-2 duration-300">
                        <TableCell colSpan={7} className="p-4">
                          <div className="space-y-4">
                            {/* History Bar */}
                            {res.history.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <Clock className="h-3 w-3 text-slate-400" />
                                <Label className="text-[10px] font-bold text-slate-400 uppercase">
                                  Historial ({res.history.length})
                                </Label>
                                <div className="flex gap-1 flex-wrap">
                                  {res.history.map((h, i) => (
                                    <span
                                      key={i}
                                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                                        h.status === 'success'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-red-100 text-red-700'
                                      }`}
                                      title={`${h.timestamp}`}
                                    >
                                      {h.statusCode || 'ERR'} · {h.latency}ms
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Request / Response side-by-side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Request Payload */}
                              <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase">
                                  Request Payload
                                </Label>
                                <Textarea
                                  className="font-mono text-xs h-[200px] bg-white shadow-inner border-slate-200"
                                  value={res.payload}
                                  onChange={(e) => updatePayload(index, e.target.value)}
                                  placeholder='{"key": "value"}'
                                  disabled={isTestRunning}
                                />
                              </div>

                              {/* Response */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-bold text-slate-500 uppercase">Response</Label>
                                  {res.latency && (
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${getLatencyColor(res.latency)}`}>
                                      <Zap className="h-3 w-3 inline mr-0.5" />{res.latency}ms
                                    </span>
                                  )}
                                </div>
                                <pre className="font-mono text-xs h-[200px] overflow-auto bg-slate-900 text-green-400 p-3 rounded border border-slate-700 whitespace-pre-wrap break-all">
                                  {res.responseData
                                    ? JSON.stringify(res.responseData, null, 2)
                                    : (res.status === 'idle' ? 'Run the test to see the response...' : res.message || 'No response body')}
                                </pre>
                              </div>
                            </div>

                            {/* Error Context */}
                            {res.status === 'error' && res.message && (
                              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-mono">
                                <strong>Error:</strong> {res.message}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* ── Footer ── */}
      <div className="text-center pb-10">
        <p className="text-xs text-slate-400">
          Esta herramienta es para uso exclusivo de desarrollo y testing estructural.
          Al habilitar &quot;Mutation Mode&quot;, el usuario asume la responsabilidad por los cambios en la base de datos local o de staging.
        </p>
      </div>
    </div>
  );
}
