import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Leaf, Zap, Calendar, Users } from "lucide-react";
import Link from "next/link";

export default function ProcesosIntegrativosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-cream via-bg-light to-bg-lightest">
      {/* Header */}
      <div className="bg-brand-primary py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
            
            <h1 className="font-title text-4xl md:text-6xl text-white mb-6 leading-tight">
              Procesos Integrativos
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Procesos de transformación profunda diseñados para acompañarte en cada etapa de tu evolución personal
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-16">
            <h2 className="font-title text-3xl md:text-4xl text-brand-primary mb-6">
              Nuestros Procesos de Transformación
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Combinamos técnicas ancestrales con enfoques contemporáneos para crear un camino único 
              hacia el bienestar integral. Cada proceso está diseñado para que aprendas a escuchar tu cuerpo 
              y crear mayor consciencia sobre tus acciones.
            </p>
          </div>

          {/* Processes Grid */}
          <div className="space-y-12 mb-16">
            {/* GENESIS */}
            <div className="card-enhanced p-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-brand-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-subtitle text-2xl text-brand-primary">
                      GENESIS
                    </h3>
                    <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-sm font-medium">
                      Personalizado
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>¿Qué es?</strong> Un proceso 100% personalizado, asistido con Flores de Bach, 
                    Péndulo y otras herramientas según tus necesidades específicas.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Duración flexible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Sesiones individuales</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* OASIS */}
            <div className="card-enhanced p-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center">
                    <Leaf className="w-10 h-10 text-brand-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-subtitle text-2xl text-brand-primary">
                      OASIS
                    </h3>
                    <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-sm font-medium">
                      4 meses
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>¿Qué es?</strong> Un proceso Individual en grupo, de Depuración Integral con 
                    hierbas medicinales. Incluye archivos descargables para cada ciclo.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>4 meses de duración</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Proceso grupal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* METAMORFOSIS */}
            <div className="card-enhanced p-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center">
                    <Zap className="w-10 h-10 text-brand-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-subtitle text-2xl text-brand-primary">
                      METAMORFOSIS
                    </h3>
                    <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-sm font-medium">
                      6 meses
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>¿Qué es?</strong> Depuración integral con hierbas medicinales. Incluye archivos 
                    descargables semanales y una sesión mensual uno a uno.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>6 meses de duración</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Sesión mensual individual</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-white/50 rounded-2xl p-12 mb-16">
            <h3 className="font-title text-2xl md:text-3xl text-brand-primary mb-8 text-center">
              ¿Qué Aprenderás en Nuestros Procesos?
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700">Aprende a escuchar tu cuerpo y crear mayor consciencia sobre tus acciones</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700">Explora ejercicios reflexivos, corporales y energéticos</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700">Reprograma patrones limitantes y siente tu poder creador</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700">Reconéctate con tu naturaleza esencial</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700">Desarrolla herramientas para tu autogestión</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-brand-primary rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700">Transforma de forma consciente dolencias y desequilibrios</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-brand-primary/5 rounded-2xl p-12">
            <h3 className="font-title text-2xl md:text-3xl text-brand-primary mb-6">
              ¿Lista para Iniciar tu Proceso de Transformación?
            </h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Descubre cuál de nuestros procesos es el ideal para ti y comienza tu camino hacia el bienestar integral.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-enhanced px-8 py-4 text-lg font-semibold">
                <Sparkles className="w-5 h-5 mr-2" />
                Iniciar Proceso
              </Button>
              <Button variant="outline" className="px-8 py-4 text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Consulta Disponibilidad
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
