"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTreasures } from "@/hooks/useTreasures";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Gift,
  Play,
  Headphones,
  FileText,
  Download,
  Lock,
  Unlock,
  Sparkles,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { TESOROS_CONFIG } from "@/types/treasures";

export default function MisTesorosPage() {
  const { user, loading: authLoading } = useAuthContext();
  const { treasures, loading: treasuresLoading, hasAccess } = useTreasures();
  const [activeTab, setActiveTab] = useState("bienvenida");

  // Determine available tabs based on treasures (must be at top level for useEffect)
  const hasGeneralAccess =
    treasures.length > 0 ? hasAccess("tesoro-gral") : false;
  const lineaAccess = treasures.filter((t) => t.startsWith("linea-"));
  const kitAccess = treasures.filter((t) => t.startsWith("kit-"));
  const availableTabs = [
    hasGeneralAccess ? "bienvenida" : null,
    lineaAccess.length > 0 ? "lineas" : null,
    kitAccess.length > 0 ? "kits" : null,
  ].filter((tab): tab is string => tab !== null);

  // Set first available tab if current tab is not accessible
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treasures, availableTabs]);

  // Loading state
  if (authLoading || treasuresLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
          <p className="text-text-primary/70 font-text">
            Cargando tus Tesoros...
          </p>
        </div>
      </div>
    );
  }

  // User not authenticated (should not happen due to layout auth check)
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Lock className="h-16 w-16 text-text-primary/30 mx-auto mb-4" />
          <h2 className="text-2xl font-title text-brand-primary mb-2">
            Acceso Restringido
          </h2>
          <p className="text-text-primary/70 font-text mb-6">
            Iniciá sesión para ver tus Tesoros Da Luz
          </p>
          <Link href="/login">
            <Button className="bg-brand-primary hover:bg-brand-secondary text-white">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // No treasures yet - empty state
  if (treasures.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-title text-brand-primary">
            Mis Tesoros
          </h1>
          <p className="text-text-primary/70 font-text mt-1">
            Tu contenido exclusivo de transformación
          </p>
        </div>

        {/* Empty State */}
        <Card
          className="shadow-alkimya border-0 overflow-hidden"
          style={{ borderRadius: "0px 15px" }}
        >
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-6">
              <Gift className="h-10 w-10 text-brand-primary" />
            </div>
            <h2 className="text-2xl font-title text-brand-primary mb-4">
              Aún no tienes Tesoros
            </h2>
            <p className="text-text-primary/70 font-text max-w-md mx-auto mb-8">
              Cuando compres productos Da Luz, recibirás acceso a contenido
              exclusivo como audios rituales, ejercicios somáticos y guías de
              transformación.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/productos">
                <Button
                  className="bg-brand-primary hover:bg-brand-secondary text-white font-text"
                  style={{ borderRadius: "0px 15px" }}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Explorar la Tienda
                </Button>
              </Link>
              <Link href="/alkimya/tesoros-daluz">
                <Button
                  variant="outline"
                  className="font-text"
                  style={{ borderRadius: "0px 15px" }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  ¿Qué son los Tesoros?
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has treasures - show content
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-title text-brand-primary">
            Mis Tesoros
          </h1>
          <p className="text-text-primary/70 font-text mt-1">
            Tu contenido exclusivo de transformación
          </p>
        </div>
        <Badge className="bg-brand-primary/10 text-brand-primary font-text px-3 py-1">
          <Sparkles className="h-3 w-3 mr-1" />
          {treasures.length} Tesoros activos
        </Badge>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {availableTabs.includes("bienvenida") && (
            <TabsTrigger value="bienvenida" className="font-text">
              Bienvenida
            </TabsTrigger>
          )}
          {availableTabs.includes("lineas") && (
            <TabsTrigger value="lineas" className="font-text">
              Mis Líneas
            </TabsTrigger>
          )}
          {availableTabs.includes("kits") && (
            <TabsTrigger value="kits" className="font-text">
              Mis Kits
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab: Bienvenida (Tesoro General) */}
        {hasGeneralAccess && (
          <TabsContent value="bienvenida" className="space-y-6">
            <Card
              className="shadow-alkimya border-0 overflow-hidden"
              style={{ borderRadius: "0px 15px" }}
            >
              <CardHeader
                className="bg-white"
                style={{ backgroundColor: "var(--admin-accent-primary)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-title text-brand-primary">
                      Portal de Bienvenida
                    </CardTitle>
                    <CardDescription className="font-text">
                      Tu punto de inicio en el universo Da Luz
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="bg-bg-light p-6">
                <div className="prose prose-sm max-w-none">
                  <h3 className="font-subtitle text-lg text-brand-primary mb-4">
                    Bienvenida al Universo Da Luz
                  </h3>
                  <p className="font-text text-text-primary leading-relaxed mb-4">
                    Este contenido es tu puerta de entrada a la filosofía Da
                    Luz. Aquí encontrarás las herramientas fundamentales para
                    ritualizar tu autocuidado.
                  </p>

                  <h4 className="font-subtitle text-base text-brand-primary mt-6 mb-3">
                    Tu Ritualización Comienza Aquí
                  </h4>
                  <p className="font-text text-text-primary leading-relaxed mb-4">
                    Creemos que la soberanía nace cuando el conocimiento se
                    vuelve cuerpo. No se trata solo de adquirir información,
                    sino de acuerpar las herramientas que ya habitan en vos para
                    transformar tu realidad biológica y vibracional.
                  </p>
                </div>

                {/* Content Actions */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6 pt-6 border-t border-text-primary/20">
                  <ContentCard
                    type="audio"
                    title="Audio de Bienvenida"
                    description="Práctica breve de respiración consciente"
                    icon={<Headphones className="h-5 w-5" />}
                  />
                  <ContentCard
                    type="pdf"
                    title="Guía de Intención"
                    description="El manifiesto y tips para intencionar"
                    icon={<FileText className="h-5 w-5" />}
                  />
                  <ContentCard
                    type="video"
                    title="Portal de Inmersión"
                    description="Introducción a la filosofía Da Luz"
                    icon={<Play className="h-5 w-5" />}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Tab: Líneas */}
        {lineaAccess.length > 0 && (
          <TabsContent value="lineas" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {lineaAccess.map((lineaId) => {
                const linea = TESOROS_CONFIG.LINEAS.find(
                  (l) => l.id === lineaId,
                );
                if (!linea) return null;
                return (
                  <Card
                    key={lineaId}
                    className="shadow-alkimya border-0 overflow-hidden"
                    style={{ borderRadius: "0px 15px" }}
                  >
                    <CardHeader
                      className="bg-white"
                      style={{ backgroundColor: "var(--admin-accent-primary)" }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-xl">
                          {linea.emoji}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-title text-brand-primary">
                            {linea.name}
                          </CardTitle>
                          <CardDescription className="font-text">
                            {linea.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="bg-bg-light p-4">
                      <p className="font-text text-text-primary text-sm leading-relaxed mb-4">
                        Accedé al portal de inmersión de {linea.name} con
                        rituales, ejercicios y herramientas de transformación.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <ContentBadge type="audio" />
                        <ContentBadge type="video" />
                        <ContentBadge type="pdf" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        )}

        {/* Tab: Kits */}
        {kitAccess.length > 0 && (
          <TabsContent value="kits" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {kitAccess.map((kitId) => {
                const kit = TESOROS_CONFIG.KITS.find((k) => k.id === kitId);
                if (!kit) return null;
                return (
                  <Card
                    key={kitId}
                    className="shadow-alkimya border-0 overflow-hidden"
                    style={{ borderRadius: "0px 15px" }}
                  >
                    <CardHeader
                      className="bg-white"
                      style={{ backgroundColor: "var(--admin-accent-primary)" }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                          <Gift className="h-5 w-5 text-brand-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-title text-brand-primary">
                            {kit.name}
                          </CardTitle>
                          <CardDescription className="font-text">
                            {kit.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="bg-bg-light p-4">
                      <p className="font-text text-text-primary text-sm leading-relaxed mb-4">
                        Accedé al contenido exclusivo del {kit.name}, incluyendo
                        rituales avanzados y herramientas de maestría.
                      </p>
                      <Button
                        size="sm"
                        className="bg-brand-primary hover:bg-brand-secondary text-white"
                        style={{ borderRadius: "0px 15px" }}
                      >
                        <Unlock className="h-4 w-4 mr-2" />
                        Abrir Kit
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

// Content Card Component
function ContentCard({
  type,
  title,
  description,
  icon,
}: {
  type: "audio" | "video" | "pdf" | "text";
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  const icons = {
    audio: <Headphones className="h-5 w-5" />,
    video: <Play className="h-5 w-5" />,
    pdf: <FileText className="h-5 w-5" />,
    text: <FileText className="h-5 w-5" />,
  };

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-text-primary/10 hover:border-brand-primary/30 transition-colors">
      <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="font-subtitle text-sm text-brand-primary">{title}</h5>
        <p className="text-xs text-text-primary/70 font-text mt-0.5">
          {description}
        </p>
        <Button
          size="sm"
          variant="ghost"
          className="mt-2 text-brand-primary hover:text-brand-secondary p-0 h-auto font-text text-xs"
        >
          {type === "pdf" ? (
            <Download className="h-3 w-3 mr-1" />
          ) : (
            <Play className="h-3 w-3 mr-1" />
          )}
          {type === "pdf" ? "Descargar" : "Reproducir"}
        </Button>
      </div>
    </div>
  );
}

// Content Badge Component
function ContentBadge({ type }: { type: "audio" | "video" | "pdf" | "text" }) {
  const config = {
    audio: {
      icon: Headphones,
      label: "Audio Ritual",
      color: "bg-blue-100 text-blue-700",
    },
    video: {
      icon: Play,
      label: "Video",
      color: "bg-purple-100 text-purple-700",
    },
    pdf: { icon: FileText, label: "PDF", color: "bg-green-100 text-green-700" },
    text: { icon: FileText, label: "Guía", color: "bg-gray-100 text-gray-700" },
  };

  const { icon: Icon, label, color } = config[type];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-text ${color}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
