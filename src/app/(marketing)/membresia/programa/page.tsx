import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock, Users, Star } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Programa de Transformación | DA LUZ CONSCIENTE',
  description: 'Descubre nuestro programa completo de 7 meses para tu transformación consciente.',
}

export default function ProgramaPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Programa Completo
          </Badge>
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6">
            Programa de Transformación
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Un viaje de 7 meses hacia tu despertar consciente con alkimyas para alma y cuerpo
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              7 Meses de Contenido
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Acceso de por Vida
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Comunidad Exclusiva
            </div>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-6 text-brand-primary">
              Módulos del Programa
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cada mes incluye contenido exclusivo, prácticas guiadas y productos alkímicos especialmente seleccionados
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { month: 1, title: "Despertar Interior", theme: "bg-alma-primary" },
              { month: 2, title: "Conexión Elemental", theme: "bg-ecos-primary" },
              { month: 3, title: "Transformación", theme: "bg-umbral-primary" },
              { month: 4, title: "Rituales Sagrados", theme: "bg-jade-primary" },
              { month: 5, title: "Visión Elevada", theme: "bg-utopica-primary" },
              { month: 6, title: "Integración", theme: "bg-brand-primary" },
              { month: 7, title: "Manifestación", theme: "bg-brand-secondary" }
            ].map((module) => (
              <Card key={module.month} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className={`absolute top-0 left-0 right-0 h-1 ${module.theme}`} />
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Mes {module.month}</Badge>
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                  <CardTitle className="font-velista text-xl">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Contenido exclusivo, prácticas y productos alkímicos para este módulo de transformación.
                  </CardDescription>
                  <div className="mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Videos y guías
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Kit de productos
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Sesión grupal
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon CTA */}
      <section className="py-20 px-6 bg-bg-cream">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-velista text-3xl md:text-4xl font-bold mb-6">
            Próximamente Disponible
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Estamos finalizando los últimos detalles de este programa transformador. 
            Únete a nuestra lista de espera para ser el primero en conocer el lanzamiento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-brand-primary hover:bg-brand-secondary">
              Unirme a Lista de Espera
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contacto">Más Información</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
