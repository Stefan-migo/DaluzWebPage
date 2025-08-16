import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, Clock, MapPin, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Políticas de Envío | DA LUZ CONSCIENTE',
  description: 'Información detallada sobre nuestras políticas de envío y tiempos de entrega.',
}

export default function PoliticasEnvioPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Información de Envíos
          </Badge>
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6">
            Políticas de Envío
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Todo lo que necesitas saber sobre nuestros envíos
          </p>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <MapPin className="w-8 h-8 text-brand-primary mb-2" />
                <CardTitle className="font-velista">Zonas de Envío</CardTitle>
                <CardDescription>Llegamos a toda Argentina</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• CABA y GBA: 24-48hs</li>
                  <li>• Interior del país: 3-7 días hábiles</li>
                  <li>• Zonas remotas: 7-10 días hábiles</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Truck className="w-8 h-8 text-brand-primary mb-2" />
                <CardTitle className="font-velista">Costos de Envío</CardTitle>
                <CardDescription>Envío gratis en compras mayores</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Gratis en compras +$15.000</li>
                  <li>• CABA: $1.200</li>
                  <li>• GBA: $1.800</li>
                  <li>• Interior: $2.500-4.000</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h2 className="font-velista text-2xl font-bold mb-6">Información Próximamente</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Estamos actualizando nuestras políticas de envío. Para consultas específicas, 
              no dudes en contactarnos.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
