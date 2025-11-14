import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Tesoros Da Luz | ALKIMYA | DA LUZ CONSCIENTE',
  description: 'Productos especiales y exclusivos de DA LUZ CONSCIENTE.',
}

export default function TesorosDaLuzPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6 text-brand-primary">
            Tesoros Da Luz
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Productos especiales y exclusivos
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-title text-2xl">Contenido en Desarrollo</CardTitle>
            <CardDescription>
              Esta sección está en construcción. Próximamente encontrarás nuestros productos especiales y exclusivos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Estamos trabajando en crear contenido completo sobre nuestros tesoros especiales, 
              productos exclusivos y ediciones limitadas que forman parte de la experiencia DA LUZ CONSCIENTE.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

