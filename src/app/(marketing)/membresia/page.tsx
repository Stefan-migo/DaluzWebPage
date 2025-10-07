import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, BookOpen, Heart, Sparkles, Star, Gift, Video } from "lucide-react";
import Link from "next/link";

export default function MembresiaPage() {
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
              Membresía DA LUZ
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Un espacio para introducirte en el mundo de DA LUZ y nutrir tu alma con herramientas que potenciarán tu bienestar
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
              Sé Parte del Ritual
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Accede a contenido exclusivo, herramientas de transformación y una comunidad que te acompañará 
              en tu camino hacia el bienestar consciente.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Videos y Meditaciones */}
            <div className="card-enhanced p-8 text-center">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="font-subtitle text-xl text-brand-primary mb-4">
                Videos y Meditaciones
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Accede a meditaciones guiadas, videos educativos y contenido exclusivo diseñado para tu transformación personal.
              </p>
            </div>

            {/* Biblioteca Virtual */}
            <div className="card-enhanced p-8 text-center">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="font-subtitle text-xl text-brand-primary mb-4">
                Biblioteca Virtual
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Explora nuestra colección de recursos, guías prácticas y materiales descargables para tu crecimiento personal.
              </p>
            </div>

            {/* Ejercicios Prácticos */}
            <div className="card-enhanced p-8 text-center">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="font-subtitle text-xl text-brand-primary mb-4">
                Ejercicios Prácticos
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Herramientas y ejercicios diseñados para que puedas aplicar los conocimientos en tu día a día.
              </p>
            </div>

            {/* Descuentos Exclusivos */}
            <div className="card-enhanced p-8 text-center">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="font-subtitle text-xl text-brand-primary mb-4">
                Descuentos Exclusivos
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Accede a descuentos especiales en productos, servicios y eventos exclusivos para miembros.
              </p>
            </div>

            {/* Comunidad */}
            <div className="card-enhanced p-8 text-center">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="font-subtitle text-xl text-brand-primary mb-4">
                Comunidad
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Conecta con una comunidad de personas que comparten tu interés por el bienestar consciente.
              </p>
            </div>

            {/* Contenido Actualizado */}
            <div className="card-enhanced p-8 text-center">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="font-subtitle text-xl text-brand-primary mb-4">
                Contenido Actualizado
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Recibe contenido nuevo regularmente, mantente al día con las últimas novedades y conocimientos.
              </p>
            </div>
          </div>

          {/* Membership Plans */}
          <div className="bg-white/50 rounded-2xl p-12 mb-16">
            <h3 className="font-title text-2xl md:text-3xl text-brand-primary mb-8 text-center">
              Planes de Membresía
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Plan Básico */}
              <div className="card-enhanced p-8 text-center">
                <h4 className="font-subtitle text-xl text-brand-primary mb-4">Plan Básico</h4>
                <div className="text-3xl font-bold text-brand-primary mb-6">$29<span className="text-lg text-gray-600">/mes</span></div>
                <ul className="space-y-3 text-sm text-gray-700 mb-8">
                  <li className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-brand-primary" />
                    Acceso a meditaciones básicas
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-brand-primary" />
                    Biblioteca virtual básica
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-brand-primary" />
                    Descuentos del 10%
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Elegir Plan Básico
                </Button>
              </div>

              {/* Plan Premium */}
              <div className="card-enhanced p-8 text-center border-2 border-brand-primary relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Más Popular
                  </span>
                </div>
                <h4 className="font-subtitle text-xl text-brand-primary mb-4">Plan Premium</h4>
                <div className="text-3xl font-bold text-brand-primary mb-6">$49<span className="text-lg text-gray-600">/mes</span></div>
                <ul className="space-y-3 text-sm text-gray-700 mb-8">
                  <li className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-brand-primary" />
                    Todo el contenido premium
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-brand-primary" />
                    Ejercicios prácticos exclusivos
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-brand-primary" />
                    Acceso a la comunidad
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-brand-primary" />
                    Descuentos del 20%
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-brand-primary" />
                    Soporte prioritario
                  </li>
                </ul>
                <Button className="w-full btn-enhanced">
                  Elegir Plan Premium
                </Button>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-brand-primary/5 rounded-2xl p-12">
            <h3 className="font-title text-2xl md:text-3xl text-brand-primary mb-6">
              ¿Lista para Comenzar tu Transformación?
            </h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Únete a nuestra comunidad y comienza tu camino hacia el bienestar consciente con herramientas 
              diseñadas especialmente para tu crecimiento personal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-enhanced px-8 py-4 text-lg font-semibold">
                <Users className="w-5 h-5 mr-2" />
                Unirse Ahora
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
