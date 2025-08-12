"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProgressIndicator } from "@/components/ui/brand";
import { 
  Sparkles, 
  Play, 
  BookOpen, 
  Download, 
  Calendar,
  Award,
  Clock,
  Users,
  Target,
  ChevronRight,
  Star,
  Heart,
  Lock
} from "lucide-react";

// Mock data - replace with actual membership data
const mockMembershipData = {
  isActive: false, // Change to true to see active membership
  plan: "Programa Completo 7 Meses",
  startDate: "2024-01-01",
  currentWeek: 5,
  totalWeeks: 28,
  overallProgress: 32,
  nextPayment: "2024-02-01",
  currentModule: {
    id: "module-5",
    title: "Autoconocimiento Profundo",
    description: "Descubre tus patrones emocionales y conecta con tu esencia interior",
    progress: 75,
    estimatedTime: "2.5 horas",
    lessonsTotal: 4,
    lessonsCompleted: 3,
    dueDate: "2024-01-28"
  },
  recentProgress: [
    {
      id: "lesson-12",
      title: "Meditación de Conexión Interior",
      type: "video",
      completed: true,
      completedAt: "2024-01-20",
      duration: "25 min"
    },
    {
      id: "lesson-13", 
      title: "Ejercicio: Mapeo Emocional",
      type: "exercise",
      completed: true,
      completedAt: "2024-01-21",
      duration: "45 min"
    },
    {
      id: "lesson-14",
      title: "Reflexión: Mis Patrones",
      type: "reflection",
      completed: false,
      duration: "30 min"
    }
  ],
  upcomingContent: [
    {
      id: "lesson-15",
      title: "Sanación Emocional Avanzada",
      type: "video", 
      releaseDate: "2024-01-25",
      duration: "40 min"
    },
    {
      id: "kit-3",
      title: "Kit de Herramientas para el Autoconocimiento",
      type: "kit",
      releaseDate: "2024-01-28"
    }
  ]
};

const progressSteps = [
  {
    id: "step-1",
    title: "Fundamentos de la Consciencia",
    description: "Introducción a los conceptos básicos",
    status: "completed" as const,
    week: 1,
    estimatedTime: "2 horas"
  },
  {
    id: "step-2", 
    title: "Conexión Mente-Cuerpo",
    description: "Aprende a escuchar tu cuerpo",
    status: "completed" as const,
    week: 3,
    estimatedTime: "2.5 horas"
  },
  {
    id: "step-3",
    title: "Autoconocimiento Profundo", 
    description: "Descubre tus patrones emocionales",
    status: "current" as const,
    week: 5,
    completionPercentage: 75,
    estimatedTime: "3 horas"
  },
  {
    id: "step-4",
    title: "Transformación Personal",
    description: "Integra nuevos hábitos conscientes",
    status: "available" as const,
    week: 8,
    estimatedTime: "2.5 horas"
  },
  {
    id: "step-5",
    title: "Integración Final",
    description: "Consolida tu transformación",
    status: "locked" as const,
    week: 24,
    estimatedTime: "4 horas"
  }
];

export default function MembershipPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'content'>('overview');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4 text-azul-profundo" />;
      case 'exercise':
        return <Target className="h-4 w-4 text-dorado" />;
      case 'reflection':
        return <Heart className="h-4 w-4 text-coral-suave" />;
      case 'kit':
        return <Download className="h-4 w-4 text-verde-suave" />;
      default:
        return <BookOpen className="h-4 w-4 text-tierra-media" />;
    }
  };

  if (!mockMembershipData.isActive) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-azul-profundo">Mi Membresía</h1>
          <p className="text-tierra-media">
            Accede a tu programa de transformación personal
          </p>
        </div>

        {/* No Active Membership */}
        <Card className="text-center py-16">
          <CardContent>
            <Sparkles className="h-20 w-20 text-dorado mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-azul-profundo mb-4">
              ¡Inicia tu Transformación!
            </h3>
            <p className="text-tierra-media mb-8 max-w-md mx-auto">
              Únete al programa de transformación personal de 7 meses y descubre tu máximo potencial
              con alkimyas para alma y cuerpo.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-2 text-sm text-tierra-media">
                <Award className="h-4 w-4" />
                <span>28 semanas de contenido exclusivo</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-tierra-media">
                <Users className="h-4 w-4" />
                <span>Acceso a la comunidad privada</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-tierra-media">
                <Download className="h-4 w-4" />
                <span>Kits de herramientas descargables</span>
              </div>
            </div>

            <Button size="lg" className="bg-dorado hover:bg-dorado/90 text-azul-profundo font-semibold">
              <Sparkles className="h-5 w-5 mr-2" />
              Explorar Membresía
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-azul-profundo">Mi Membresía</h1>
          <p className="text-tierra-media">
            Semana {mockMembershipData.currentWeek} de {mockMembershipData.totalWeeks} - {mockMembershipData.plan}
          </p>
        </div>
        <Badge className="bg-dorado text-azul-profundo">
          <Sparkles className="h-3 w-3 mr-1" />
          Miembro Activo
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Resumen', icon: Sparkles },
          { id: 'progress', label: 'Progreso', icon: Target },
          { id: 'content', label: 'Contenido', icon: BookOpen }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 ${activeTab === tab.id ? 'bg-dorado text-azul-profundo hover:bg-dorado/90' : ''}`}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Module */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-azul-profundo">Módulo Actual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-azul-profundo">
                        {mockMembershipData.currentModule.title}
                      </h3>
                      <p className="text-tierra-media mt-1">
                        {mockMembershipData.currentModule.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-dorado text-dorado">
                      Semana {mockMembershipData.currentWeek}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-tierra-media">Progreso del módulo</span>
                      <span className="font-semibold text-azul-profundo">
                        {mockMembershipData.currentModule.progress}%
                      </span>
                    </div>
                    <Progress value={mockMembershipData.currentModule.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-tierra-media" />
                      <span>{mockMembershipData.currentModule.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-tierra-media" />
                      <span>
                        {mockMembershipData.currentModule.lessonsCompleted}/
                        {mockMembershipData.currentModule.lessonsTotal} lecciones
                      </span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-dorado hover:bg-dorado/90 text-azul-profundo">
                  Continuar Módulo
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Recent Progress */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-azul-profundo">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMembershipData.recentProgress.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      {getContentIcon(item.type)}
                      <div className="flex-1">
                        <p className="font-medium text-azul-profundo">{item.title}</p>
                        <p className="text-sm text-tierra-media">{item.duration}</p>
                      </div>
                      {item.completed ? (
                        <Badge className="bg-verde-suave text-white">Completado</Badge>
                      ) : (
                        <Badge variant="outline">Pendiente</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-azul-profundo">Tu Progreso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-azul-profundo mb-2">
                    {mockMembershipData.overallProgress}%
                  </div>
                  <Progress value={mockMembershipData.overallProgress} className="h-3" />
                  <p className="text-sm text-tierra-media mt-2">
                    Progreso general del programa
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-tierra-media">Semana actual:</span>
                    <span className="font-semibold text-azul-profundo">
                      {mockMembershipData.currentWeek}/{mockMembershipData.totalWeeks}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-tierra-media">Inicio:</span>
                    <span className="text-sm text-azul-profundo">
                      {formatDate(mockMembershipData.startDate)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-azul-profundo">Próximamente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMembershipData.upcomingContent.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      {getContentIcon(item.type)}
                      <div className="flex-1">
                        <p className="font-medium text-azul-profundo text-sm">{item.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3 text-tierra-media" />
                          <span className="text-xs text-tierra-media">
                            {formatDate(item.releaseDate)}
                          </span>
                        </div>
                      </div>
                      <Lock className="h-4 w-4 text-tierra-media" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <ProgressIndicator
          title="Programa de Transformación Personal"
          description="Tu camino hacia la consciencia plena"
          currentWeek={mockMembershipData.currentWeek}
          totalWeeks={mockMembershipData.totalWeeks}
          overallProgress={mockMembershipData.overallProgress}
          steps={progressSteps}
          showDetailed={true}
        />
      )}

      {activeTab === 'content' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-azul-profundo">Biblioteca de Contenido</CardTitle>
              <p className="text-tierra-media">
                Accede a todo el material del programa organizado por semanas
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="h-16 w-16 text-tierra-media mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-azul-profundo mb-2">
                  Contenido en Desarrollo
                </h3>
                <p className="text-tierra-media">
                  La biblioteca completa estará disponible próximamente
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 