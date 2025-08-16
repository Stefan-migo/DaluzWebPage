import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Video, MessageCircle, Star } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Consultas Individuales | DA LUZ CONSCIENTE',
  description: 'Agenda tu consulta personalizada con nuestros especialistas en alkimya consciente.',
}

export default function ConsultasPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-umbral-primary to-umbral-secondary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Atención Personalizada
          </Badge>
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6">
            Consultas Individuales
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Sesiones personalizadas para tu viaje de transformación consciente
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              60 Minutos
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Online o Presencial
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Seguimiento Incluido
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-6 text-brand-primary">
              Tipos de Consulta
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Elige la consulta que mejor se adapte a tus necesidades de transformación
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Análisis Personalizado",
                description: "Evaluación completa de tu estado actual y plan personalizado",
                duration: "90 min",
                price: "$8,500",
                features: ["Diagnóstico integral", "Plan personalizado", "Recomendaciones de productos"]
              },
              {
                title: "Sesión de Coaching",
                description: "Acompañamiento en tu proceso de transformación consciente",
                duration: "60 min", 
                price: "$6,000",
                features: ["Coaching personalizado", "Técnicas específicas", "Material de apoyo"]
              },
              {
                title: "Seguimiento Mensual",
                description: "Revisión y ajuste de tu programa de desarrollo",
                duration: "45 min",
                price: "$4,500",
                features: ["Evaluación de progreso", "Ajustes al plan", "Nuevas herramientas"]
              }
            ].map((service, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{service.duration}</Badge>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <CardTitle className="font-velista text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-brand-primary mb-4">
                    {service.price}
                    <span className="text-sm text-gray-500 ml-1">ARS</span>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full" disabled>
                    Próximamente Disponible
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 bg-bg-cream">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-6">
              ¿Cómo Funciona?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Un proceso simple para comenzar tu transformación personalizada
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Agenda", description: "Selecciona el tipo de consulta y horario", icon: Calendar },
              { step: 2, title: "Prepárate", description: "Completa el cuestionario previo", icon: MessageCircle },
              { step: 3, title: "Consulta", description: "Sesión personalizada con especialista", icon: Video },
              { step: 4, title: "Seguimiento", description: "Recibe tu plan y materiales", icon: Star }
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="font-velista text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-velista text-3xl md:text-4xl font-bold mb-6">
            Comienza tu Transformación
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Estamos preparando esta experiencia personalizada. Contáctanos para más información.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contacto">Contactar Ahora</Link>
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
