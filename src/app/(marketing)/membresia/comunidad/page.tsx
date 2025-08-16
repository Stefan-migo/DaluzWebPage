import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, MessageCircle, Heart, Star } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Comunidad | DA LUZ CONSCIENTE',
  description: 'Únete a nuestra comunidad de transformación consciente.',
}

export default function ComunidadPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-alma-primary to-alma-secondary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Conexión Consciente
          </Badge>
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6">
            Comunidad
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Conecta con personas que comparten tu camino de transformación
          </p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Heart className="w-16 h-16 text-brand-primary mx-auto mb-6" />
          <h2 className="font-velista text-3xl md:text-4xl font-bold mb-6">
            Próximamente Disponible
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Estamos creando un espacio especial para nuestra comunidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/membresia">Ver Membresía</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contacto">Contactar</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
