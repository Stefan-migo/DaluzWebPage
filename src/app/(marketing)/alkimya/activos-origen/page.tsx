import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Activos y Origen | ALKIMYA | DA LUZ CONSCIENTE',
  description: 'Descubre los ingredientes naturales y su procedencia en nuestras alkimyas.',
}

export default function ActivosOrigenPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6 text-brand-primary">
            Activos y Origen
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ingredientes naturales y su procedencia
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-title text-2xl">Contenido en Desarrollo</CardTitle>
            <CardDescription>
              Esta sección está en construcción. Próximamente encontrarás información detallada sobre los activos naturales y su origen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Estamos trabajando en crear contenido completo sobre los ingredientes naturales que utilizamos en nuestras alkimyas, 
              su procedencia y sus beneficios para tu bienestar integral.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

