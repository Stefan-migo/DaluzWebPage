import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, Clock, Heart } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terapias Grupales | DA LUZ CONSCIENTE',
  description: 'Únete a nuestras sesiones grupales de transformación consciente.',
}

export default function GruposPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-jade-primary to-jade-secondary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Sanación Colectiva
          </Badge>
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6">
            Terapias Grupales
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Experimenta el poder de la transformación en comunidad
          </p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Users className="w-16 h-16 text-brand-primary mx-auto mb-6" />
          <h2 className="font-velista text-3xl md:text-4xl font-bold mb-6">
            Próximamente Disponible
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Estamos preparando experiencias grupales únicas para nuestra comunidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contacto">Más Información</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/servicios">Ver Todos los Servicios</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
