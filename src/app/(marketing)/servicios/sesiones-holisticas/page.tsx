import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Sparkles, Leaf, Zap } from "lucide-react";
import Link from "next/link";

export default function SesionesHolisticasPage() {
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
              Sesiones Holísticas
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Un espacio sagrado de encuentro contigo mismo, donde puedes explorar, sanar y expandir tu consciencia
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
              Nuestras Sesiones Individuales
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Diseñadas para crear un ambiente de total confianza y respeto, donde puedas 
              conectar profundamente con tu ser interior y activar tu capacidad de autosanación.
            </p>
          </div>

          {/* Sessions Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Sesión Armonía/Pacifica */}
            <div className="card-enhanced p-8 text-center">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="font-subtitle text-xl text-brand-primary mb-4">
                Sesión Armonía/Pacifica
              </h3>
              <p className="text-sm text-gray-600 mb-4 font-semibold">Reiki Usui y Karuna</p>
              <div className="text-gray-700 space-y-2 text-sm">
                <p><strong>Duración:</strong> 60 min.</p>
                <p><strong>Ideal para:</strong> Relajación, calma, insomnio, ansiedad y nerviosismo.</p>
                <p><strong>Beneficio:</strong> Equilibra chakras y aura para activar tu capacidad de autosanación.</p>
              </div>
            </div>

            {/* Sesión Reprogramación Integral */}
            <div className="card-enhanced p-8 text-center">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="font-subtitle text-xl text-brand-primary mb-4">
                Sesión Reprogramación Integral
              </h3>
              <p className="text-sm text-gray-600 mb-4 font-semibold">Chamanismo y Péndulo</p>
              <div className="text-gray-700 space-y-2 text-sm">
                <p><strong>Duración:</strong> 75 min.</p>
                <p><strong>Beneficio:</strong> Descifra tu subconsciente con el péndulo y reprograma tu energía a través de diversas técnicas Ancestrales.</p>
                <p><strong>Incluye:</strong> Mapa pendular y ejercicios para potenciar nuevas conexiones neuronales.</p>
              </div>
            </div>

            {/* Sesión Bioequilibrio Integral */}
            <div className="card-enhanced p-8 text-center">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="font-subtitle text-xl text-brand-primary mb-4">
                Sesión Bioequilibrio Integral
              </h3>
              <p className="text-sm text-gray-600 mb-4 font-semibold">Reiki y Chamanismo</p>
              <div className="text-gray-700 space-y-2 text-sm">
                <p><strong>Duración:</strong> 90 min.</p>
                <p><strong>Beneficio:</strong> Armoniza y equilibra tu energía con Reiki Usui y técnicas chamánicas.</p>
                <p><strong>Incluye:</strong> Elixir floral o aromático para mantener el equilibrio.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white/50 rounded-2xl p-12">
            <h3 className="font-title text-2xl md:text-3xl text-brand-primary mb-6">
              ¿Lista para tu Transformación?
            </h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Reserva la sesión que necesita tu cuerpo y alma. Cada encuentro es un paso hacia tu bienestar integral.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-enhanced px-8 py-4 text-lg font-semibold">
                <Zap className="w-5 h-5 mr-2" />
                Reservar Sesión
              </Button>
              <Button variant="outline" className="px-8 py-4 text-lg">
                <Heart className="w-5 h-5 mr-2" />
                Más Información
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
